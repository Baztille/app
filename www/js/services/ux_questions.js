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
                {code: 3, name: 'Date'}, 
                {code: 4, name: 'Déjà votées'},
                {code: 5, name: 'Non votées'}
            ];

        },

        categoryChoice : function() {

            return [ 
                {code: 1, name: 'Toutes'}, 
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
                {code: 14, name: 'Autres'}
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


