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

appBaztille.controller('QuestionsCtrl', function(Questions, UxQuestions, $scope, $rootScope, $timeout, $state, $ionicLoading,  $ionicModal, $window, $ionicHistory,$ionicPopup,$ionicPopover, $ionicSideMenuDelegate, $http) {
  $ionicSideMenuDelegate.canDragContent(true);
  
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

  $scope.proposedvote = function() {

  };
  
  $scope.moreQuestions = function() {

  };

  // Create the search modal
  $ionicModal.fromTemplateUrl('templates/small/search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalSearch = modal;
  });

  // Triggered in the search modal to close it
  $scope.closeSearch = function() {
    $scope.modalSearch.hide();
  };

  $scope.openSearch = function() {

    Questions.getMostUsedTopics({
      limit: 30
    }).then( function(resp) {

      $scope.modalSearch.show();
      $scope.topicsMostUsed = resp.data.result;

    }, function( err ) {

    } );

    $rootScope.$broadcast('tracking:event', {title:'search',value:'open'});
        
  };
  
  $scope.voteProposed = function( ) {
    return false;
  }; 

  $scope.shareNative = function(message,link) {
        UxQuestions.shareNative(message,link);
  };
  $scope.simpleShare = function(question) { console.log(question);
        $state.go('question.share',{ questionID: question.id });
  };
  $scope.onWhyLimit = function() {
    UxQuestions.onWhyLimit();
  };
  
  /* keep scroll position */

  $scope.scrollSavePos = function( ) {
    if (!ionic.Platform.isIOS()) {
        var scrollPosition = document.querySelector('.ionic-scroll');
        $window.localStorage.questionsLastPos = scrollPosition.scrollTop;
        delete $window.localStorage.questionLastPos;
    }
  }
  
  /*$scope.$on('$ionicView.loaded', function(){
    if (!ionic.Platform.isIOS()) {
        $timeout(function () {
          var scrolldiv = document.querySelector('.ionic-scroll');
              scrolldiv.scrollTop = $window.localStorage.questionsLastPos;
              delete $window.localStorage.questionsLastPos;
        }, 1000);
    }
         
  });*/



   $scope.categories = UxQuestions.categoryChoice();
  

    $scope.reloadQuestions = function() 
    {
        Questions.getActive({
            session: $window.localStorage.token
        }).then( function(resp) {

            $scope.questions = [];

            if( resp.data.list.length == 0 )
            {
                // Case 1 : there is NO current question
                //   => we display a word of explanation
                $scope.explanation = 'La prochaine question sera posée Vendredi à 14:00.';
                $scope.explanationlink = 'Choisir la question qui sera posée';
                $scope.showExplanationlink = true;
                $scope.see_future_questions_visible = true;
                $scope.new_answer_visible = false;
            
            }
            else if( resp.data.list.length == 1 )
            {
                // Case 2 : there is a UNIQUE question
                //   => we display the details of this question
                $scope.templateUnique = true;
                $scope.showExplanationlink = false;
                $scope.questionId = resp.data.list[0]._id.$id;
                $scope.see_future_questions_visible = false;
                $scope.new_answer_visible = true;

                $scope.reloadQuestion();
            }
            else
            {
                // Case 3 : there are SEVERAL questions
                //   => we display a list of these questions
                $scope.showExplanationlink = false;
                $scope.see_future_questions_visible = true;
                $scope.new_answer_visible = false;
                
                for( var i in resp.data.list )
                {
                    var question = resp.data.list[i];

                    var voted = '';
                    if( typeof resp.data.myvotes[ question._id.$id ] != 'undefined' )
                    {   voted = 'voted';    }

                    var validated_answers = '';

                    if( question.bestAnswer[0] != null) {

                        for( var j in question.bestAnswer )
                        {
                            var validanswer = question.bestAnswer[j];
                                validated_answers += '<p>'+validanswer.text+'</p>';
                            
                        }
                    }


                    $scope.questions.push( { 
                        title: question.text, 
                        vote: question.vote,
                        date_proposed: question.date_vote + (7*60*60*24), 
                        id: question._id.$id,
                        nbReponse: question.nbReponse,
                        voted: voted,
                        url: 'http://app.baztille.org/question/questions/'+question._id.$id,
                        validated_answers: validated_answers
                    } );
                }
            }


        }, function( err ) {
            //console.error('ERR', err);
        } );
    };
    
    $scope.reloadQuestions();

    //  Doing question proposal
    //  $scope.newQuestion
    $scope.propose_a_new_argument = 'Proposer une réponse';

    $scope.doPropose = function() {
        
        $scope.newQuestion.session = $window.localStorage.token;

        Questions.newQuestion($scope.newQuestion).success(function(data){
            
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
                var question_id = data.id;
                $scope.modalNewQuestion.hide();
                $state.go('question.single', {questionID:question_id.$id} );

            }
         });


        
    };

  // Form data for the login modal
  $scope.newQuestion = {};


    // Characters left counter
    $scope.maxChars = 200;
    $scope.ngCharacterCount = $scope.maxChars;
    $scope.inputChange = function()
    {
        $scope.ngCharacterCount = ( $scope.maxChars - $scope.newQuestion.text.length );
        if( $scope.ngCharacterCount < 20 )
        {
            angular.element(  document.querySelector( "#characters_count") ).addClass( 'character_count_almost_over' );
        }
        else
        {
            angular.element(  document.querySelector( "#characters_count") ).removeClass( 'character_count_almost_over' );
        }
    };
    
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////// Copied from QuestionCtrl.js (code to manage a unique question) /////////////////////////
  
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
        $scope.modal_title = 'Nouvelle réponse';
        $scope.new_answer_on = 'Nouvelle réponse à la question';
        $scope.your_answer = 'Votre réponse';

        $scope.maxChars = 200;
        $scope.ngCharacterCount = $scope.maxChars;
        $scope.ngCountExplanation = false;
        $scope.modalNewArg.show();
        $rootScope.$broadcast('tracking:event', {title:'argument',value:'ajout-open'});
      };


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

                if(  resp.data.question.category )
                {
                    $scope.questionCategory = $scope.categories[ resp.data.question.category -1 ];
                }
                else
                {
                    $scope.questionCategory = $scope.categories[ 15-1 ]; // "others"
                }

                var voted = '';
                if( typeof resp.data.myvotes[ resp.data.question._id.$id ] != 'undefined' )
                {   voted = 'voted';    }
                                                
                if( status == 'proposed' )
                {
                    // 31 days to be validated
                    var date = moment(resp.data.question.date_proposed,'X').fromNow();
                    status_explanation = "Votez pour cette question pour qu'elle soit sélectionnée et soumise au vote (encore "+resp.data.question.remaining_attempts+' tentatives).';
                    date_prefix = 'Question proposée';
                    $scope.valid_answer_class= '';
                    $scope.new_answer_visible = true;
                    $scope.question_vote_visible = true;
                    $scope.question_header_margin = 75;
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
                }
                else if( status == 'decided' )
                {
                    status_explanation = "Question déjà débattue et votée.";
                    date = moment(resp.data.question.date_vote_end,'X').fromNow();
                    date_prefix = 'Question débattue et votée ';
                    $scope.new_answer_visible = false;
                }

                $scope.question = { 
                    title: resp.data.question.text,
                    date: date,
                    date_prefix: date_prefix,
                    status: status,
                    status_explanation: status_explanation,
                    category : resp.data.question.category,
                    vote: resp.data.question.vote,
                    voted: voted,
                    url: 'http://app.baztille.org/question/questions/'+$scope.questionId,
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
                        date : arg.date,
                        vote: arg.vote,
                        argnbr: arg.args.length,
                        argnbrdisplay: arg.args.length>0 ? 'flex': 'none',
                        question_id: $scope.questionId,
                        voted: voted,
                        valid: '', // Note: do not mark any answers as "valid" during the vote
                        arg_footer: footer_text
                    } );
                }
                
                if (!ionic.Platform.isIOS()) {
                    $timeout(function () {
                      var scrolldiv = document.querySelector('.ionic-scroll');
                          scrolldiv.scrollTop = $window.localStorage.questionsLastPos;
                          delete $window.localStorage.questionsLastPos;
                    }, 100);
                } 

            }, function( err ) {} );
      
      };

      $scope.actionArg = function(arg, $event) {

    if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        $event.cancelBubble = true;
        $event.returnValue = false;

        var alertPopup = $ionicPopup.show({
        title: '',
        subTitle: '',
        template: arg.id,
        cssClass: "popup-vertical-buttons-no-head",
        buttons: [
        {
            text: 'Partager',
            type: 'button-default',
            onTap: function(e) {
                $scope.scrollSavePos();
                $state.go('question.argshare',{ questionID: arg.question_id, argID: arg.id });
            }
        },
        { 
            text: 'Modifier',
            type: 'button-default',
            onTap: function(e) {
               $scope.scrollSavePos();
                $state.go('question.argedit',{ questionID: arg.question_id, argID: arg.id });
            }
        },
        { 
            text: 'Signaler',
            type: 'button-default',
            onTap: function(e) {
              $scope.scrollSavePos();
                $state.go('question.argreport',{ questionID: arg.question_id, argID: arg.id });
            }
        },
        { text: 'Retour' }

        ]
    });
  }
    
    // Form data for the login modal
    $scope.newArgData = { text: '' };

    // Doing New argument posting modal
    //  Doing new argument posting

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
                $state.go('question.argpromote',{ questionID: $scope.questionId, argID: data.id.$id });
                //$scope.reloadQuestion();
            }
         });


        
    }; 
    
    // Voting for arg

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


    $scope.inputChange = function() { UxQuestions.inputChange( $scope, $scope.newArgData.text ); }
    
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
                    UxQuestions.errorEmailNotConfirmed(data);
                } 
        
            }
            else
            {
                UxQuestions.incrementVote($event);
            }            
        } );
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
        $scope.modalSearch.remove();
      });

    
});
