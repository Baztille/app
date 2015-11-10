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

appBaztille.controller('QuestionCtrl', function(Questions, UxQuestions, $scope,$state, $location, $ionicSideMenuDelegate, $window, $ionicLoading, $ionicModal, $http, $stateParams, $ionicPopup) {
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
        $scope.modal_title = 'Nouvelle réponse';
        $scope.new_answer_on = 'Nouvelle réponse à la question';
        $scope.your_answer = 'Votre réponse';
        $scope.ngCharacterCount = $scope.maxChars;
        $scope.modalNewArg.show();
      };


      $scope.questionId = $stateParams.questionID;

      $scope.reloadQuestion = function()
      {
      
            Questions.getQuestion( {
                id:$scope.questionId,
                session: $window.localStorage.token
            } ).then( function(resp) {

                var status = resp.data.question.status;
                var date_prefix = 'Encore ';
                var footer_text = 'Réponse approuvée';
                $scope.valid_answer_class= 'valid_anwser';
                $scope.question_vote_visible = false;
                $scope.question_header_margin = 0;

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

                $scope.question = { 
                    title: resp.data.question.text,
                    date: date,
                    date_prefix: date_prefix,
                    status_explanation: status_explanation,
                    vote: resp.data.question.vote,
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

     $scope.reloadQuestion();
    
    // Form data for the login modal
    $scope.newArgData = { text: '' };

    //  Doing new argument posting
    //  $scope.newArgData

    $scope.doNewArg = function() {
          
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
                $scope.reloadQuestion();
            }            
        } );
        

    };

    // Characters left counter
    $scope.maxChars = 200;
    $scope.ngCharacterCount = $scope.maxChars;
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
                    $scope.errorEmailNotConfirmed(data);
                }
            
            }
            else
            {
                $scope.reloadQuestion();
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


    
});
