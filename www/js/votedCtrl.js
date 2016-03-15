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

appBaztille.controller('VotedCtrl', function(Questions, $scope, $state, $timeout, $ionicLoading, $ionicModal, $window, $ionicHistory, $ionicSideMenuDelegate, $http) {
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
  
  $scope.voteProposed = function( ) {    
    return false;
  }; 

  $scope.questions = [];
  $scope.questionPage = 1;
  $scope.questionPageEnd = true;

  /* Load More */

  $scope.loadMore = function() {
    $scope.questionPage++
    $scope.reloadQuestions($scope.questionPage);
  };

  $scope.moreDataCanBeLoaded = function(number) {
    return $scope.questionPageEnd;
  };

  /* keep scroll position */

  $scope.scrollSavePos = function( ) {
    if (!ionic.Platform.isIOS()) {
      var scrollPosition = document.querySelector('.ionic-scroll');
      $window.localStorage.votedLastPos = scrollPosition.scrollTop;
    }
  }
  
  $scope.$on('$ionicView.loaded', function(){
    if (!ionic.Platform.isIOS()) {
      $timeout(function () {
        var scrolldiv = document.querySelector('.ionic-scroll');
            scrolldiv.scrollTop = $window.localStorage.votedLastPos;
            delete $window.localStorage.votedLastPos;
      }, 1000);
    }
  });
  

    $scope.reloadQuestions = function(numPage) 
    {
        Questions.getVoted({
            session: $window.localStorage.token,
            page: (numPage) ? numPage : 1
        }).then( function(resp) {

            if(resp.data.list.length == 0) {
              $scope.questionPageEnd = false;
            } else {
              $scope.questionPageEnd = true;
            }
            
            for( var i in resp.data.list )
            {
                var question = resp.data.list[i];

                var voted = '';
                if( typeof resp.data.myvotes[ question._id.$id ] != 'undefined' )
                {   voted = 'voted';    }
                
                var validated_answers = '';
                
                for( var j in question.validanswers )
                {
                    var validanswer = question.validanswers[j];
                    validated_answers += '<p>'+validanswer.text+'</p>';
                }

                $scope.questions.push( { 
                    title: question.text, 
                    vote: question.vote,
                    date_proposed: question.date_decided, 
                    id: question._id.$id,
                    voted: voted,
                    validated_answers: validated_answers
                } );

                $scope.$broadcast('scroll.infiniteScrollComplete');
            }


        }, function( err ) {

        } );
    };
    
    $scope.$on('$stateChangeSuccess', function() {
      $scope.reloadQuestions();
    });


    //  Doing question proposal

    $scope.doPropose = function() {
        
          $scope.newQuestion.session = $window.localStorage.token;

          Questions.newQuestion($scope.newQuestion).success(function(data){
            
            if( data.error )
            {
                var alertPopup = $ionicPopup.alert({
                 title: 'Erreur',
                 template: data.error_descr
               });
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
});
