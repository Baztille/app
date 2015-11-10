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

appBaztille.controller('NewPasswordCtrl', function(User, $window, $scope, $ionicModal, $timeout, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $rootScope, $stateParams) {


  $scope.changePasswordData = {};
  $scope.changePasswordData.code = $stateParams.code;

  // Perform the login action when the user submits the login form
  // $scope.changePasswordData

  $scope.doChangePassword = function() {

    User.changePassword($scope.changePasswordData).success(function(data){

        if( data.error )
        {
            var alertPopup = $ionicPopup.alert({
             title: 'Warning',
             template: data.error_descr
           });
        }
        else
        {
            var alertPopup = $ionicPopup.alert({
             title: 'Changement du mot de passe',
             template: 'Votre mot de passe a été modifié avec succès.'
           });
        
        
          $state.go('splash', {reload: true});
        }
       } );
  };
  

});

