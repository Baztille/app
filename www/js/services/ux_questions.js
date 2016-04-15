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


serviceBaztille.factory('UxQuestions',['$http','config','User','$cacheFactory', '$rootScope', '$ionicAnalytics','$ionicPopup', '$window', function($http, config, User, $cacheFactory, $rootScope, $ionicAnalytics,$ionicPopup, $window){

  

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
            $scope.ngCountExplanation = false;

            if( $scope.ngCharacterCount < 20 )
            {   
                angular.element(  document.querySelector( "#characters_count") ).addClass( 'character_count_almost_over' );
                $scope.ngCountExplanation = true;
            }
            else
            {
                angular.element(  document.querySelector( "#characters_count") ).removeClass( 'character_count_almost_over' );
                $scope.ngCountExplanation = false;
            }
        },
        
        onWhyLimit: function()
        {
            var alertPopup = $ionicPopup.alert({
             title: 'Limite des 200 caractères',
             template: "Certains d'entre vous ont peu de temps à consacrer à Baztille, et pourtant nous souhaitons que tout le monde prenne part aux décisions.<br/>C'est pourquoi vous devez aller à l'essentiel et que la taille des contributions est limitée.<br/>N'oubliez pas que si vous voulez argumenter vous pouvez proposer autant d'arguments et de sous-arguments que vous le souhaitez !"
            });
        
        },

        onConseilsRedaction: function()
        {
            var alertPopup = $ionicPopup.alert({
             title: 'Conseils de rédaction',
             template: "<p>Quelques conseils pour que votre question soit sélectionnée :</p><ul><li><p>&bull; Posez une question liée à un problème d’actualité</p></li><li><p>&bull; Vérifiez dans les “questions votées” que cette question n’a pas déjà été votée récemment.</p></li><li><p>&bull; Posez votre question de manière non-orientée, de manière à ce que les autres utilisateurs puisse la trouver intéressante quelque soit leur avis (ex: Démarrez votre question par : Doit-on, Faut-il, Voulez-vous, Peut-on,... )</p></li></ul>"
            });
        
        },

        shareNative: function(message,link) {
            if(window.plugins.socialsharing) {
                window.plugins.socialsharing
                .share(message, null, null, link) // Share via native share sheet
                .then(function(result) {
                  //success
                }, function(err) {
                  // An error occured. Show a message to the user
                });
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

appBaztille.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);