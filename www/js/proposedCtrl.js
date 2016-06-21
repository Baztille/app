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

appBaztille.controller('ProposedCtrl', function(Questions, User, UxQuestions, $timeout, $scope, $rootScope, $state, $ionicLoading,  $ionicModal, $window, $ionicHistory, $rootScope,$ionicSideMenuDelegate, $ionicPopup, $ionicPopover, $http) {
  $ionicSideMenuDelegate.canDragContent(true);

  // destroy modals on destroy view
  $scope.$on('$destroy', function() { 
    $scope.modalNewQuestion.remove();
  });
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
    // Characters left counter
    $scope.maxChars = 200;
    $scope.ngCharacterCount = $scope.maxChars;
    $scope.ngCountExplanation = false;

    $scope.newQuestion.text = '';
    $scope.modal_title = 'Proposer une question';
    $scope.newQuestion.bConfirmation = false;
    $scope.updateQuestion = false;
    $scope.ngCharacterCount = $scope.maxChars;
    $scope.modalNewQuestion.show();
    $rootScope.$broadcast('tracking:event', {title:'question',value:'ajout-open'});
  };


  $scope.proposedvote = function() {

  };
  
  $scope.moreQuestions = function() {

  };
  
  $scope.actionQuest = function(question, $event) {

    if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        $event.cancelBubble = true;
        $event.returnValue = false;

        var alertPopup = $ionicPopup.show({
        title: '',
        subTitle: '',
        template: question.id,
        cssClass: "popup-vertical-buttons-no-head",
        buttons: [
        {
            text: '<b>Partager</b>',
            type: 'button-default',
            onTap: function(e) {
              if(!window.cordova) { 
                $scope.scrollSavePos();
                $state.go('question.share',{ questionID: question.id });
              } else {
                UxQuestions.shareNative(question.title,question.url);
              }
            }
        },
        { 
            text: 'Modifier',
            type: 'button-default',
            onTap: function(e) {
              $scope.scrollSavePos();
              $state.go('question.edit',{ questionID: question.id });
            }
        },
        { 
            text: 'Signaler',
            type: 'button-default',
            onTap: function(e) {
              $scope.scrollSavePos();
              $state.go('question.report',{ questionID: question.id });
            }
        },
        { text: 'Retour' }

        ]
    });
  }

  $scope.shareNative = function(message,link) {
        UxQuestions.shareNative(message,link);
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


    /* Filter questions by Category*/
  
    $scope.categories = UxQuestions.categoryChoice();
    $scope.questionCategory = ($window.localStorage.proposedCategory) ? $scope.categories[$window.localStorage.proposedCategory-1] : $scope.categories[0];

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
        $scope.questions = [];
        $scope.questionPage = 1;
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
  /* keep scroll position */

  $scope.scrollSavePos = function( ) {
    if (!ionic.Platform.isIOS()) {
      var scrollPosition = document.querySelector('.ionic-scroll');
      $window.localStorage.proposedLastPos = scrollPosition.scrollTop;
      delete $window.localStorage.questionLastPos;
    }
  }
  
  $scope.$on('$ionicView.loaded', function(){
    if (!ionic.Platform.isIOS()) {
      $timeout(function () {
        var scrolldiv = document.querySelector('.ionic-scroll');
            scrolldiv.scrollTop = $window.localStorage.proposedLastPos;
            delete $window.localStorage.proposedLastPos;
      }, 1000);
    }
         
  });
  

    $scope.reloadQuestions = function(numPage) 
    {
        Questions.getProposed({
            session: $window.localStorage.token,
            filter: $scope.questionFilter.code,
            category: $scope.questionCategory.code,
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
                    date_proposed: question.date_proposed, 
                    id: question._id.$id,
                    url: 'http://app.baztille.org/question/questions/'+question._id.$id,
                    voted: voted,
                    attempts_status: attempts_status
                } );

                $scope.$broadcast('scroll.infiniteScrollComplete');
            }


        }, function( err ) {

        } );
    };
    
    $scope.$on('$stateChangeSuccess', function() {
      $scope.reloadQuestions();
    });
    

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

           // $ionicLoading.hide();
            
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
                if (typeof $rootScope.currentUser !== 'undefined') {
                  UxQuestions.incrementVote($event, 'proposed');
                  $rootScope.$broadcast('tracking:event', {title:'question_vote',value:question_id});
                }

            }            
        } );
        

    };
    

    //  Doing question proposal
    //  $scope.newQuestion
    
    $scope.updateNewQuestionCategory = function(item) { 
      $scope.questionCategory = item;
    };

    $scope.doPropose = function() {
        // At first, we do a confirmation step
        $scope.newQuestion.text_br = $scope.newQuestion.text.replace(/(?:\r\n|\r|\n)/g, '<br />');
        $scope.newQuestion.bConfirmation = true;
        $scope.newQuestion.category = $scope.questionCategory.code;
        $rootScope.$broadcast('tracking:event', {title:'question',value:'ajout-previsualisation'});
    }; 
    
    $scope.onWhyLimit = function() {
        UxQuestions.onWhyLimit();
    };

    $scope.onConseilsRedaction = function() {
        UxQuestions.onConseilsRedaction();
    };

    $scope.fixNewQuestion = function() {
        // Back to edition
        $scope.newQuestion.bConfirmation = false;
        $rootScope.$broadcast('tracking:event', {title:'question',value:'ajout-corriger'});
    };

    $scope.confirmNewQuestion = function() {

          $scope.newQuestion.category = $scope.questionCategory.code;
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
                $scope.ngCharacterCount = $scope.maxChars;
                $scope.modalNewQuestion.hide();
                $rootScope.$broadcast('tracking:event', {title:'question',value:'ajout-success'});
                $state.go('question.promote', {questionID:question_id.$id} );

            }
         });


        
    };

    // Form data for the login modal
    $scope.newQuestion = {};

    $scope.inputChange = function() { UxQuestions.inputChange( $scope, $scope.newQuestion.text ); }
    
   
});
