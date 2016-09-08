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

appBaztille.controller('ContentsCtrl', function(User, UxQuestions, Questions, $scope, $rootScope, $state, $ionicLoading, $ionicModal, $ionicPopup, $ionicPopover, $window, $ionicHistory, $ionicSideMenuDelegate, $http) {
  $ionicSideMenuDelegate.canDragContent(true);
    
    // destroy modals on destroy view
    $scope.$on('$destroy', function() { 
        $scope.popover.remove();
    });

    $ionicPopover.fromTemplateUrl('templates/small/filter-content-popover.html', {
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

    
    $scope.questions = [];
    $scope.args = [];
    
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

  /* keep scroll position */

  $scope.scrollSavePos = function( ) {
    if (!ionic.Platform.isIOS()) {
      var scrollPosition = document.querySelector('.ionic-scroll');
      $window.localStorage.contentsLastPos = scrollPosition.scrollTop;
      delete $window.localStorage.contentsLastPos;
    }
  }
  
  $scope.$on('$ionicView.loaded', function(){
    if (!ionic.Platform.isIOS()) {
      $timeout(function () {
        var scrolldiv = document.querySelector('.ionic-scroll');
            scrolldiv.scrollTop = $window.localStorage.contentsLastPos;
            delete $window.localStorage.contentsLastPos;
      }, 1000);
    }
         
  });

  $scope.reloadQuestions = function(numPage) 
    {

        User.getContents({
            session: $window.localStorage.token,
            page: (numPage) ? numPage : 1
        }).then( function(resp) {

            $scope.args = []; // clean args list

            $scope.closePopover();

            if(resp.data.questions.length == 0) {
              $scope.questionPageEnd = false;
            } else {
              $scope.questionPageEnd = true;
            }
           
            for( var i in resp.data.questions )
            {
                var question = resp.data.questions[i];

                var voted = '';
                if( typeof resp.data.myvotes[ question._id.$id ] != 'undefined' )
                {   voted = 'voted';    }
                
                $scope.questions.push( { 
                    title: question.text, 
                    vote: question.vote,
                    argnbr: question.nbReponse,
                    date_proposed: question.date_proposed, 
                    id: question._id.$id,
                    url: 'http://app.baztille.org/question/questions/'+question._id.$id,
                    voted: voted
                } );

                $scope.data = resp.data;
                $scope.totalQ = resp.data.questions.length;
                $scope.type = "questions";
                $scope.typePhrase = "TOUTES MES QUESTIONS ";
                //$scope.$broadcast('scroll.infiniteScrollComplete');
            }


        }, function( err ) {

        } );
    };

 $scope.reloadArgs = function(numPage) 
    {
        User.getArgs({
            session: $window.localStorage.token,
            page: (numPage) ? numPage : 1
        }).then( function(resp) {

            $scope.questions = []; // clean question list

            $scope.closePopover();

            if(resp.data.args.length == 0) {
              $scope.questionPageEnd = false;
            } else {
              $scope.questionPageEnd = true;
            }
           
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
                        argnbr: arg.nbReponse,
                        question_id: arg.question,
                        voted: voted,
                        valid: '',
                        arg_footer: ''
                    } );

                $scope.data = resp.data;
                $scope.totalQ = resp.data.args.length;
                $scope.type = "arguments";
                $scope.typePhrase = "TOUS MES ARGUMENTS ";
                //$scope.$broadcast('scroll.infiniteScrollComplete');
            }


        }, function( err ) {

        } );
    };

    
    $scope.$on('$stateChangeSuccess', function() {
      $scope.reloadArgs();
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
                if (typeof $rootScope.currentUser !== 'undefined') {
                    UxQuestions.incrementVote($event);
                    $rootScope.$broadcast('tracking:event', {title:'argument_vote',value:post_id});
                }
            }            
        } );
        

    };
    


    $scope.nb_points_label = "Points Baztille";
    $scope.points = $window.localStorage.points;


});
