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

appBaztille.controller('SplashCtrl', function(User, $window, $scope, $ionicModal, $ionicAnalytics, $timeout, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $rootScope) {

  $scope.isAuthenticated = false;

  // Form data for the login modal
  $scope.loginData = {};
  $scope.forgetdata = {};
  $ionicSideMenuDelegate.canDragContent(false);

  $timeout(function () {
    $scope.endTransition = 'endTransition';
  }, 500);

  // Create the login modal that we will use later
  
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalLogin = modal;
  });

  // Create the forget Password modal

  $ionicModal.fromTemplateUrl('templates/forgetpassword.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalforgetPassword = modal;
  });


  if(typeof $rootScope.currentUser !== 'undefined' && typeof $window.localStorage.token !== 'undefined') {
    $state.go('question.questions');
  }

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modalLogin.show();
  };

  // Perform the login action when the user submits the login form
  // $scope.loginData

  $scope.doLogin = function() {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
  
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system

    User.login($scope.loginData).success(function(data){

        if(data.auth) 
        {
            $window.localStorage.token = data.auth.token;
            $window.localStorage.points= data.auth.points;
            $ionicLoading.hide();
            $scope.closeLogin();
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                historyRoot: true,
                disableBack: true
            });  
            $rootScope.currentUser = data.auth.token; 
            $rootScope.points = data.auth.points;
            $state.go('question.questions', {reload: true});
        }
        else
        {
            $ionicLoading.hide();

            $ionicAnalytics.track('Login', {
              status: 'Problème de connexion',
              detail: 'Mauvais identifiant ou mot de passe.'
            });

            var alertPopup = $ionicPopup.alert({
             title: 'Problème de connexion',
             template: 'Mauvais identifiant ou mot de passe.'
           });

        }
    });
  };

  // Open the Forget password modal
  $scope.forget = function() {
    $scope.modalforgetPassword.show();
  };
  
  // Triggered in the login modal to close it
  $scope.closeForgetPassord = function() {
    $scope.modalforgetPassword.hide();
  };
  
  // Perform the forget password action when the user submits the forget form
  // $scope.forgetdata

  $scope.doForget = function() {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
  
    User.forgetpassword($scope.forgetdata).success(function(data){

        if(data.id) 
        {
            $ionicLoading.hide();
            $scope.closeForgetPassord();
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                historyRoot: true,
                disableBack: true
            });  

            var alertPopup = $ionicPopup.alert({
             title: 'Mot de passe oublié',
             template: 'Un email vous a été envoyé.'
           });

        }
        else
        {
            $ionicLoading.hide();

            $ionicAnalytics.track('ForgetPassword', {
              status: 'Problème de connexion',
              detail: 'Email inconnu.'
            });

            var alertPopup = $ionicPopup.alert({
             title: 'Problème de connexion',
             template: 'Email inconnu.<br/><br/><b>Important</b> : si vous vous étiez pré-inscrit à Baztille avant le lancement, vous devez créer un compte ("s\'inscrire") pour pouvoir accéder au service.'
           });

        }
    });
  };  

  // Form data for the login modal
  $scope.signinData = {};

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

  $scope.takeatour = function() {
    $state.go('question.questions', {reload: true});    
  };

  // Open the login modal
  $scope.signin = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  // $scope.signinData

  $scope.doSignin = function() {

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });    
    
    User.create($scope.signinData).success(function(data){

        if( data.error )
        {
            var alertPopup = $ionicPopup.alert({
             title: 'Warning',
             template: data.error_descr
           });
        }
        else
        {
            if(data.auth) 
            {
                $window.localStorage.token = data.auth.token;
                $window.localStorage.points= data.auth.points;
                $ionicLoading.hide();
                $scope.modal.hide();
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    historyRoot: true,
                    disableBack: true
                });  
                $rootScope.currentUser = data.auth.token; 
                $rootScope.points = data.auth.points;
                $state.go('question.questions', {reload: true});
            }        
        
       }
    });
  
  };


});
