/*********************************************************************************

    Baztille
        
    Copyright (C) 2015  Grégory Isabelli, Thibaut Villemont and contributors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
***********************************************************************************/

appBaztille.controller('QuestionCtrl', function(Questions, UxQuestions, $scope, $timeout, $state, $location, $ionicSideMenuDelegate, $window, $ionicLoading, $ionicModal, $http, $stateParams, $ionicPopup, $ionicPopover) {
  $ionicSideMenuDelegate.canDragContent(true);

      // Create the arg proposing modal that we will use later
      $ionicModal.fromTemplateUrl('templates/newarg.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modalNewArg = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeNewArg = function() {
        $scope.modalNewArg.hide();
      };

      // Open the login modal
      $scope.newArg = function() {
        $scope.newArgData.text = '';
        $scope.newArgData.bConfirmation = false;
        $scope.modal_title = 'Nouvelle réponse';
        $scope.new_answer_on = 'Nouvelle réponse à la question';
        $scope.your_answer = 'Votre réponse';
        $scope.ngCharacterCount = $scope.maxChars;
        $scope.modalNewArg.show();
        
        // Characters left counter
        $scope.maxChars = 200;
        $scope.ngCharacterCount = $scope.maxChars;
        $scope.inputChange = function() { 
            UxQuestions.inputChange( $scope, $scope.newArgData.text ); 
        }
        
      };


      $scope.questionId = $stateParams.questionID;

      /* keep scroll position */

      $scope.scrollSavePos = function( ) {
        var scrollPosition = document.querySelector('.overflow-scroll');
        $window.localStorage.questionLastPos = scrollPosition.scrollTop;
      }
      
      $scope.$on('$ionicView.loaded', function(){
        $timeout(function () {
          var scrolldiv = document.querySelector('.overflow-scroll');
              scrolldiv.scrollTop = $window.localStorage.questionLastPos;
              delete $window.localStorage.questionLastPos;
        }, 1000);
             
      });

      $scope.reloadQuestion = function()
      {
            Questions.getQuestion( {
                id:$scope.questionId,
                filter: $scope.questionFilter.code,
                session: $window.localStorage.token
            } ).then( function(resp) {

                var status = resp.data.question.status;
                var date_prefix = 'Encore ';
                var footer_text = 'Réponse approuvée';
                $scope.valid_answer_class= 'valid_anwser';
                $scope.question_vote_visible = false;
                $scope.question_header_margin = 0;

                if( typeof resp.data.question.category != 'undefined' )
                {
                    $scope.questionCategory = $scope.categories[ resp.data.question.category ];
                }
                else
                {
                    $scope.questionCategory = $scope.categories[ 15-1 ]; // "others"
                }

                var voted = '';

                if( resp.data.questionvoted == true )
                {   voted = 'voted';    }
                                                
                if( status == 'proposed' )
                {
                    // some times to be validated
                    var date = moment(resp.data.question.date_proposed,'X').fromNow();
                    status_explanation = "Votez pour cette question pour qu'elle soit sélectionnée et soumise au vote (encore "+resp.data.question.remaining_attempts+' tentatives).';
                    date_prefix = 'Question proposée';
                    $scope.valid_answer_class= '';
                    $scope.new_answer_visible = true;
                    $scope.question_vote_visible = true;
                    $scope.question_header_margin = 75;
                    $scope.question_voted = resp.data.questionvoted ? 'voted' : '';
                }
                else if( status == 'rejected' )
                {
                    var date = moment(resp.data.question.date_proposed,'X').fromNow();
                    status_explanation = "Cette question n'a pas intéressé suffisamment de membres pour être mise au vote.";
                    date_prefix = 'Proposée ';
                    $scope.new_answer_visible = false;
                    $scope.valid_answer_class= '';
                }
                else if( status == 'vote' )
                {
                    status_explanation = "Votez pour la ou les réponses qui vous paraissent les meilleures.";
                    date = moment(resp.data.question.date_vote_end,'X').fromNow();
                    date_prefix = 'En cours de vote jusque ';
                    $scope.new_answer_visible = true;
                    $scope.valid_answer_class= '';
                }
                else if( status == 'decided' )
                {
                    status_explanation = "Question déjà débattue et votée.";
                    date = moment(resp.data.question.date_decided,'X').fromNow();
                    date_prefix = 'Question débattue et votée ';
                    $scope.new_answer_visible = false;
                }

                // Modification status
                var author_is_you = false;
                $scope.modificationStatus = 'none';
                if( typeof resp.data.question.author_is_you != 'undefined' )
                {   author_is_you = true;    }
                if( status == 'proposed' || status == 'vote' )
                {
                    if( author_is_you && ( ( resp.data.question.vote == 0 ) || ( resp.data.question.vote == 1 && resp.data.questionvoted ) ) )
                    {
                        // Can modify the question without a moderator
                        $scope.modificationStatus = 'possible';
                    }
                    else
                    {
                        // Can suggest a modification to the moderator
                        $scope.modificationStatus = 'moderator';
                    }
                }


                $scope.question = { 
                    title: resp.data.question.text,
                    date: date,
                    date_prefix: date_prefix,
                    status_explanation: status_explanation,
                    vote: resp.data.question.vote,
                    category : resp.data.question.category,
                    voted: voted,
                    status: status,
                    id: $scope.questionId
                };
                
                $scope.args = [];
                
                
                for( var i in resp.data.args )
                {
                    var arg = resp.data.args[i];
                    
                    var voted = '';
                    if( typeof resp.data.myvotes[ arg._id.$id ] != 'undefined' )
                    {   voted = 'voted';    }

                    $scope.args.push( { 
                        text: arg.text, 
                        id: arg._id.$id, 
                        vote: arg.vote,
                        argnbr: arg.args.length,
                        argnbrdisplay: arg.args.length>0 ? 'flex': 'none',
                        question_id: $scope.questionId,
                        voted: voted,
                        valid: ( typeof resp.data.valid_answers[ arg._id.$id ] != 'undefined' ) ? $scope.valid_answer_class : '',
                        arg_footer: footer_text
                    } );
                }

            }, function( err ) {} );
      
      };

    
    // Form data for the login modal
    $scope.newArgData = { text: '' };

    //  Doing new argument posting
    //  $scope.newArgData


    $scope.doNewArg = function() {

        // At first, we do a confirmation step
        $scope.newArgData.text_br = $scope.newArgData.text.replace(/(?:\r\n|\r|\n)/g, '<br />');
        $scope.newArgData.bConfirmation = true;
    }; 

    $scope.fixNewArg = function() {
        // Back to edition
        $scope.newArgData.bConfirmation = false;
    };

    $scope.confirmNewArg = function() {
    
              // Post new arg
              $scope.newArgData.id = $scope.questionId;
              $scope.newArgData.session = $window.localStorage.token;
              $scope.newArgData.parent = 0;  // Root argument

              Questions.newArg($scope.newArgData).success(function(data){

                if( data.error )
                {
                    if( data.error_code != 570 )
                    {
                        var alertPopup = $ionicPopup.alert({
                         title: 'Erreur',
                         template: data.error_descr
                        });
                    }
                    else
                    {  
                        UxQuestions.errorEmailNotConfirmed(data);
                    }
                }
                else
                {
                    $scope.modalNewArg.hide();
                    $scope.reloadQuestion();
                }
             });

    };

    
    
    //  Voting for arg

    $scope.voteArg = function( post_id , $event)
    {

        if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        $event.cancelBubble = true;
        $event.returnValue = false;

        Questions.vote( {
            id:post_id,
            session: $window.localStorage.token
        } ).success(function(data){

            if( data.error )
            {
                if( data.error_code != 570 )
                {
                    var alertPopup = $ionicPopup.alert({
                     title: 'Erreur',
                     template: data.error_descr
                    });
                }
                else
                {  
                    UxQuestions.errorEmailNotConfirmed(data);
                }
            }
            else
            {
                UxQuestions.incrementVote($event);
            }            
        } );
        

    };

    
    // Voting for question

    $scope.voteProposed = function( question_id, $event)
    {

        if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        $event.cancelBubble = true;
        $event.returnValue = false;

        var data = {
            id: question_id,
            session: $window.localStorage.token
        };
                
        Questions.questionvote( data ).success(function(data){

            $ionicLoading.hide();
            
            if( data.error )
            {
                if( data.error_code != 570 )
                {
                    var alertPopup = $ionicPopup.alert({
                     title: 'Erreur',
                     template: data.error_descr
                    });
                }
                else
                {  
                    $scope.errorEmailNotConfirmed(data);
                }
            
            }
            else
            {
                UxQuestions.incrementVote($event);
            }            
        } );
        

    };
    
      $scope.Voters = function( question_id, $event ) {
        if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        $event.cancelBubble = true;
        $event.returnValue = false;

        $state.go('question.voters', {questionId: question_id});
    };   
    
    /* Contribution editing */
    
      // Create the arg proposing modal that we will use later
      $ionicModal.fromTemplateUrl('templates/newquestion.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modalNewQuestion = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeNewQuestion = function() {
        $scope.modalNewQuestion.hide();
      };
    
    $scope.newQuestion = { text: '' };
    
    $scope.editContribution = function() {

        $scope.newQuestion.category = $scope.question.category;
        $scope.newQuestion.text = $scope.question.title;
        $scope.newQuestion.bConfirmation = false;
        $scope.ngCharacterCount = $scope.maxChars;
        $scope.modalNewQuestion.show();
        $scope.modal_title = 'Modifier une question';
        $scope.updateQuestion = true;

        $scope.questionCategory = $scope.categories[$scope.question.category-1];

        // Characters left counter
        $scope.maxChars = 200;
        $scope.ngCharacterCount = $scope.maxChars;
        $scope.inputChange = function() { 
            UxQuestions.inputChange( $scope, $scope.newQuestion.text ); 
        }
        $scope.updateNewQuestionCategory = function(item) {
            $scope.questionCategory = item;
        }

        $scope.modal_title = 'Modifier une question';
        
        if( $scope.modificationStatus == 'possible' )
        {        
            $scope.modal_subtitle = 'Modification de votre question.';
        }
        else
        {
            $scope.modal_subtitle = 'Cette question a déjà reçue des soutiens et donc votre modification ne doit porter que sur des corrections syntaxiques qui ne change pas le sens de la contribution.';
        }
        
        UxQuestions.inputChange( $scope, $scope.newQuestion.text );         


    };
    
    // Propose a modified question
    $scope.categories = UxQuestions.categoryChoice();
    

    $scope.doPropose = function() {
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
          

          $scope.newQuestion.category = $scope.questionCategory.code;

          $scope.newQuestion.session = $window.localStorage.token;
          $scope.newQuestion.id = $scope.questionId;

          Questions.updateQuestion($scope.newQuestion).success(function(data){

            $ionicLoading.hide();
            
            if( data.error )
            {
                if( data.error_code != 570 )
                {
                    var alertPopup = $ionicPopup.alert({
                     title: 'Erreur',
                     template: data.error_descr
                    });
                }
                else
                {  
                    UxQuestions.errorEmailNotConfirmed(data);
                }            
            }
            else
            {
                // Question has been added with success. Redirect to this question
                $scope.modalNewQuestion.hide();
                $scope.reloadQuestion();
                
                if( data.id == 0 )
                {
                    var alertPopup = $ionicPopup.alert({
                     title: 'Merci',
                     template: "Votre modification a été soumise aux modérateurs"
                    });
                    
                }
            }
         });
        
    };


    /* Sort answers & arguments */

    $scope.filters = UxQuestions.filterChoice();
    $scope.questionFilter = ($window.localStorage.proposedFilter) ? $scope.filters[$window.localStorage.proposedFilter-1] : $scope.filters[0]; 

    $scope.update = function(item,type) {
        
        $window.localStorage.proposedFilter = item.code;
        $scope.questionFilter = item;
        $scope.closePopover();

        //reload scope question
        $scope.reloadQuestion();
    }

      $ionicPopover.fromTemplateUrl('templates/small/filter-popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });


      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });

      // toggle filter
      $scope.showCategoryfilter = false;
      $scope.openCategoryFilter = function($event) {
        $scope.showCategoryfilter = ($scope.showCategoryfilter) ? false : true ;
      };
      

    //end sorting

    
     // Initial question load    
     $scope.reloadQuestion();

});
