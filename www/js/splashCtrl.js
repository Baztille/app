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

appBaztille.controller('SplashCtrl', function(User, $window, $scope, $ionicModal, $timeout, $state, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $rootScope) {

  // destroy modals on destroy view
  $scope.$on('$destroy', function() { 
    $scope.modalLogin.remove();
    $scope.modal.remove();
    $scope.modalforgetPassword.remove();
  });

  $scope.isAuthenticated = false;

  // Form data for the login modal
  $scope.loginData = {};
  $scope.forgetdata = {};
  $ionicSideMenuDelegate.canDragContent(false);

  

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

  $scope.$on('$ionicView.enter', function (event, data) {
      if(data.stateName == 'splash.login' ) {
        $scope.login();
      }
      if(data.stateName == 'splash.suscribe' ) { console.log(11111);
        $scope.signin();
      }
  });


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
  
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system

    User.login($scope.loginData).success(function(data){

        if(data.auth) 
        {
            $window.localStorage.token = data.auth.token;
            $window.localStorage.points= data.auth.points;
            $scope.closeLogin();
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                historyRoot: true,
                disableBack: true
            });  
            $rootScope.currentUser = data.auth.token; 
            $rootScope.points = data.auth.points;
            $rootScope.$broadcast('tracking:event', {title:'session',value:'login-success'});
            var destinationAfterLogin = ($window.localStorage.afterlogin) ? $window.localStorage.afterlogin : 'question.questions';
            var destinationAfterLoginParams = ($window.localStorage.afterloginParams) ? JSON.parse($window.localStorage.afterloginParams) : {} ;
            $window.localStorage.removeItem('afterloginParams');
            $window.localStorage.removeItem('afterlogin');
            $state.go(destinationAfterLogin, destinationAfterLoginParams);
            

        }
        else
        {

            var alertPopup = $ionicPopup.alert({
             title: 'Problème de connexion',
             template: 'Mauvais identifiant ou mot de passe.'
           });

            $rootScope.$broadcast('tracking:event', {title:'session',value:'login-failure'});

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
  
    User.forgetpassword($scope.forgetdata).success(function(data){

        if(data.id) 
        {
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
            
            $rootScope.$broadcast('tracking:event', {title:'compte',value:'mdp-forget-success'});

        }
        else
        {

            var alertPopup = $ionicPopup.alert({
             title: 'Problème de connexion',
             template: 'Email inconnu.<br/><br/><b>Important</b> : si vous vous étiez pré-inscrit à Baztille avant le lancement, vous devez créer un compte ("s\'inscrire") pour pouvoir accéder au service.'
            });
            
            $rootScope.$broadcast('tracking:event', {title:'compte',value:'mdp-forget-failure'});

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
    $rootScope.$broadcast('tracking:event', {title:'ios',value:'acces-libre'});
    $state.go('question.questions', {reload: true});    
  };

  // Open the login modal
  $scope.signin = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  // $scope.signinData

  $scope.doSignin = function() {
      
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

                $scope.modal.hide();
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    historyRoot: true,
                    disableBack: true
                });  
                $rootScope.currentUser = data.auth.token; 
                $rootScope.points = data.auth.points;
                $rootScope.$broadcast('tracking:event', {title:'compte',value:'signin-success'});
                $state.go('question.questions', {reload: true});
            } else {
               $rootScope.$broadcast('tracking:event', {title:'compte',value:'signin-failure'});
            }     
        
       }
    });
  
  };



});
