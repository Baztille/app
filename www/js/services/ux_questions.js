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


serviceBaztille.factory('UxQuestions',['$http','config','User','$cacheFactory', '$rootScope', '$ionicAnalytics','$ionicPopup', '$window',function($http, config, User, $cacheFactory, $rootScope, $ionicAnalytics,$ionicPopup, $window){

  

    return {

        filterChoice : function() {

            return [ 
                {code: 1, name: 'Popularité'}, 
                {code: 2, name: 'Votes'}, 
                {code: 3, name: 'Date'} 
//                {code: 4, name: 'Déjà votées'},
//                {code: 5, name: 'Non votées'}
            ];

        },

        categoryChoice : function() {

            return [ 
                // Note : 0 is reserved for "no category"
                {code: 1, name: 'Choisir dans la liste'}, 
                {code: 2, name: 'Culture'}, 
                {code: 3, name: 'Economie'}, 
                {code: 4, name: 'Education'}, 
                {code: 5, name: 'Environnement'},
                {code: 6, name: 'Etat'},
                {code: 7, name: 'International'},
                {code: 8, name: 'Justice'},
                {code: 9, name: 'Recherche'},
                {code: 10, name: 'Santé'},
                {code: 11, name: 'Sécurité'},
                {code: 12, name: 'Societé'},
                {code: 13, name: 'Travail'},
                {code: 14, name: 'Baztille'},
                {code: 15, name: 'Autres'}
            ];

        },

        inputChange : function( $scope, text )
        {
            $scope.ngCharacterCount = ( $scope.maxChars - text.length );

            if( $scope.ngCharacterCount < 20 )
            {
                angular.element(  document.querySelector( "#characters_count") ).addClass( 'character_count_almost_over' );
            }
            else
            {
                angular.element(  document.querySelector( "#characters_count") ).removeClass( 'character_count_almost_over' );
            }
        },

        incrementVote : function($event, context) {

                var nbVoteInitial = parseInt($event.target.firstElementChild.innerHTML);
                var isVoted = $event.target.parentElement.classList.contains('voted');

                if(isVoted) {
                    $event.target.firstElementChild.innerHTML = nbVoteInitial - 1;
                    if( typeof context != 'undefined' && context == 'proposed'  )
                    {
                        $event.target.lastElementChild.innerHTML = "choisir";
                    }
                    else
                    {
                        $event.target.lastElementChild.innerHTML = "je vote";
                    }
                    $event.target.parentElement.classList.remove('voted');
                } else {
                    $event.target.firstElementChild.innerHTML = nbVoteInitial + 1;
                    if( typeof context != 'undefined' && context == 'proposed'  )
                    {
                        $event.target.lastElementChild.innerHTML = "a choisi";
                    }
                    else
                    {
                        $event.target.lastElementChild.innerHTML = "a voté";
                    }
                    $event.target.parentElement.classList.add('voted');
                }
        },


      // Called when a 570 error come from WS (= email not confirmed)
      errorEmailNotConfirmed : function(data) {
            var alertPopup = $ionicPopup.show({
             title: 'Email non confirmé',
             template: data.error_descr,
             buttons: [
                { 
                    text: 'Rien reçu ?',
                    onTap: function(e)
                    {
                        User.reconfirmEmail().success( function( data ) {

                            if( data.error )
                            {
                                var alertPopup = $ionicPopup.alert({
                                 title: 'Erreur',
                                 template: data.error_descr
                                });
                            }
                            else
                            {

                                var alertPopup = $ionicPopup.alert({
                                 title: 'Email non confirmé',
                                 template: "Email de confirmation renvoyé"
                                });

                            } 
                        });
                    }
                
                },
                { 
                    text: 'Ok',
                    type: 'button-positive'
                }

             ]
           });
        
        }      

     
    }
    

    
}]);


appBaztille.directive('eatClickIf', ['$parse', '$rootScope',
  function($parse, $rootScope) {
    return {
      // this ensure eatClickIf be compiled before ngClick
      priority: 100,
      restrict: 'A',
      compile: function($element, attr) {
        var fn = $parse(attr.eatClickIf);
        return {
          pre: function link(scope, element) {
            var eventName = 'click';
            element.on(eventName, function(event) {
              var callback = function() {
                if (fn(scope, {$event: event})) {
                  // prevents ng-click to be executed
                  event.stopImmediatePropagation();
                  // prevents href 
                  event.preventDefault();
                  return false;
                }
              };
              if ($rootScope.$$phase) {
                scope.$evalAsync(callback);
              } else {
                scope.$apply(callback);
              }
            });
          },
          post: function() {}
        }
      }
    }
  }
]);
