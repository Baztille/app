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

        incrementVote : function($event) {

                var nbVoteInitial = parseInt($event.target.firstElementChild.innerHTML);
                var isVoted = $event.target.parentElement.classList.contains('voted');

                if(isVoted) {
                    $event.target.firstElementChild.innerHTML = nbVoteInitial - 1;
                    $event.target.lastElementChild.innerHTML = "je vote";
                    $event.target.parentElement.classList.remove('voted');
                } else {
                    $event.target.firstElementChild.innerHTML = nbVoteInitial + 1;
                    $event.target.lastElementChild.innerHTML = "a voté";
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


