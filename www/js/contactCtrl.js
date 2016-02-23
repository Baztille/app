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

appBaztille.controller('ContactCtrl', function(User, $window, $scope, $ionicModal, $timeout, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $rootScope) {

    $scope.msgdata = {};

    $scope.sendMessage = function() {

          $scope.msgdata.session = $window.localStorage.token;

          if ($scope.msgdata.text) {

              User.sendContactMessage($scope.msgdata).success(function(data){

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
                     title: 'Merci pour votre message',
                     template: "Votre message a bien été envoyé. Nous vous répondrons rapidement."
                   });
                   
                   $scope.msgdata.text = '';
                   
                   $state.go('question.questions', {reload: true});
                }
             });

          } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Message vide',
                    template: "Veuillez saisir votre message."
                });
          }


    };

});

