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

appBaztille.controller('ProposedCtrl', function(Questions, User, UxQuestions,$scope, $state, $ionicLoading,  $ionicModal, $window, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $ionicPopover, $http) {
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

  // Open the login modal
  $scope.addNewQuestion = function() {
    $scope.newQuestion.text = '';
    $scope.ngCharacterCount = $scope.maxChars;
    $scope.modalNewQuestion.show();
  };


  $scope.proposedvote = function() {

  };
  
  $scope.moreQuestions = function() {

  };
  
  $scope.voteProposed = function( ) {
    
    return false;
  }; 

    /* Filter questions by Category*/
  
    $scope.categories = UxQuestions.categoryChoice();
    $scope.questionCategory = ($window.localStorage.proposedCategory) ? $scope.categories[$window.localStorage.proposedCategory-1] : $scope.categories[0]; //;

    $scope.filters = UxQuestions.filterChoice();
    $scope.questionFilter = ($window.localStorage.proposedFilter) ? $scope.filters[$window.localStorage.proposedFilter-1] : $scope.filters[0]; 

    $scope.questionCategoryActive = ($scope.questionCategory.code == 1) ? 'inactive' : 'active' ;

    $scope.update = function(item,type) {
        
        if(type == "category") {
            $window.localStorage.proposedCategory = item.code;
            $scope.questionCategory = item;
            // icon category filter state
            $scope.showCategoryfilter = ($scope.questionCategory.code == 1) ? false : true ;
            $scope.showCategoryfilterDelete  = ($scope.questionCategory.code == 1) ? false : true ;
            $scope.questionCategoryActive = ($scope.questionCategory.code == 1) ? 'inactive' : 'active' ;
        } else {
            $window.localStorage.proposedFilter = item.code;
            $scope.questionFilter = item;
            $scope.closePopover();
        }
        //reload scope question
        $scope.reloadQuestions();
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
      $scope.showCategoryfilter = ($scope.questionCategory.code == 1) ? false : true ;
      $scope.showCategoryfilterDelete  = ($scope.questionCategory.code == 1) ? false : true ;
      $scope.openCategoryFilter = function($event) {
        $scope.showCategoryfilter = ($scope.showCategoryfilter) ? false : true ;
        $scope.showCategoryfilterDelete  = ($scope.questionCategory.code == 1) ? false : true ;
      };

      $scope.deleteCategoryFilter = function($event) {
        $scope.update($scope.categories[0],'category');
      }
      

    //end filter
  

    $scope.reloadQuestions = function() 
    {
        Questions.getProposed({
            session: $window.localStorage.token,
            filter: $scope.questionFilter.code,
            category: $scope.questionCategory.code
        }).then( function(resp) {

            $scope.questions = [];
            
            for( var i in resp.data.list )
            {
                var question = resp.data.list[i];

                var voted = '';
                if( typeof resp.data.myvotes[ question._id.$id ] != 'undefined' )
                {   voted = 'voted';    }
                
                //console.log(question);
                if( question.failedSelection == 0 )
                {
                    attempts_status = 'Nouvelle question';
                }
                else if( question.remaining_attempts > 1 )
                {
                    attempts_status = 'Encore '+question.remaining_attempts+' chances de sélectionner cette question';
                }
                else
                {
                    attempts_status = 'Dernière chance de sélectionner cette question';
                }
                
                $scope.questions.push( { 
                    title: question.text, 
                    vote: question.vote,
                    argnbr: question.nbReponse,
                    date_proposed: question.date_proposed_end, 
                    id: question._id.$id,
                    voted: voted,
                    attempts_status: attempts_status
                } );
            }


        }, function( err ) {
            //console.error('ERR', err);
        } );
    };
    
    $scope.reloadQuestions();

    //  Voting for question

    $scope.voteProposed = function( question_id , $event)
    {

        if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        $event.cancelBubble = true;
        $event.returnValue = false;
        
        Questions.questionvote( {
            id:question_id,
            session: $window.localStorage.token
        } ).success(function(data){

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
                $scope.reloadQuestions();
            }            
        } );
        

    };
    

    //  Doing question proposal
    //  $scope.newQuestion


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

          Questions.newQuestion($scope.newQuestion).success(function(data){

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
                var question_id = data.id;
                $scope.ngCharacterCount = $scope.maxChars;
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
    $scope.inputChange = function() { UxQuestions.inputChange( $scope, $scope.newQuestion.text ); }
    
   

    
    
});
