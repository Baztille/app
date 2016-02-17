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

appBaztille.controller('SigninCtrl', function($scope, $ionicModal, $timeout, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate) {
  
  // Form data for the login modal
  $scope.loginData = {};
  $ionicSideMenuDelegate.canDragContent(false)
  
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signin.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeSignin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  // $scope.loginData
  
  $scope.doSignin = function() {

      $scope.closeSignin();
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        historyRoot: true,
        disableBack: true
      });   
      $state.go('question.questions');

  };
});
