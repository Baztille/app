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


/* load controllers*/
var appBaztille = angular.module('app.controllers', ['angularMoment']); 
     
var serviceBaztille = angular.module('app.services',[]);

var initBaztille = angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'ionic.service.push' , 'app.controllers', 'app.services']);

initBaztille.run(function($ionicPlatform, $ionicLoading, $ionicAnalytics, $rootScope, $ionicPopup, $ionicPush, $ionicSideMenuDelegate, $ionicHistory, $state, $window) {

   $rootScope.currentVersion = window.VERSION;
   $rootScope.currentPlatform = ionic.Platform.platform();
   $rootScope.currentPlatformVersion = ionic.Platform.version();

   $rootScope.$on('loading:show', function() {
    $ionicLoading.show({templateUrl: 'templates/loader.html', animation: 'fade-in',
      maxWidth: 60,
      noBackdrop: true,
      showDelay: 90})
    
    if($window.localStorage.points)
    {
        $rootScope.points = $window.localStorage.points;
    }
  })

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
  })

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    console.log(toState);
    
    // fixed menu
    if (toState.name == 'question.questions' || toState.name == 'question.voted' || toState.name == 'question.proposed' || toState.name == 'app.about' || toState.name == 'app.news' || toState.name == 'compte.points') {
        $rootScope.showCustomMenuHack = false;
        $rootScope.showCustomMenu = true;
        $rootScope.showCustomBack = false;
    } else {
        $rootScope.showCustomMenuHack = false;
        $rootScope.showCustomMenu = false;
        $rootScope.showCustomBack = true;
    }


    if($window.localStorage.token) {
      $rootScope.currentUser = $window.localStorage.token;

    }

    var requireLogin = toState.access.requireLogin;

    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
      event.preventDefault();

      var alertPopup = $ionicPopup.alert({
        title: 'Attention',
        template: 'Vous devez être connecté pour accéder à cette page'
      });

      alertPopup.then(function(res) {
        $state.go('splash');
      });
       
    }
   
  });
  
  //  Toggle menu on ion-nav
  $rootScope.toggleLeftSideMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
  }

  //  GoBack Function on ion-nav
  $rootScope.goBack = function() {
      window.history.back();
  }


  $ionicPlatform.ready(function() {

    // IONIC ANALYTICS

    $ionicAnalytics.register({
      // Don't send any events to the analytics backend.
      // (useful during development)
      //dryRun: true
      silent: true
    });
    $ionicAnalytics.setGlobalProperties({
      app_version_number: $rootScope.currentVersion,
      user_device: $rootScope.currentPlatform,
      user_device_version: $rootScope.currentPlatformVersion,
      day_of_week: (new Date()).getDay()
    });

    if( window.cordova ) {

    // PUSH only for native cordova
    
      Ionic.io();
    
      var user = Ionic.User.current();
      
      if (!user.id) {
        user.id = Ionic.User.anonymousId();
        //no need to save as we save once we push register
      }

      user.set('device', $rootScope.currentPlatform);
      
      $ionicPush.init({
        "debug": false,
        "onNotification": function(notification) {
          var payload = notification.payload;
          console.log(notification, payload);
        },
        "onRegister": function(data) {
          console.log(data.token);
          user.save();
        },
        "pluginConfig": {
          "ios": {
            "badge": true,
            "sound": true
           },
           "android": {
             "senderId" : 488668833089,
             "icon": "notification",
             "iconColor": "#F9DA00",
             "forceShow": true
           }
          }
      });

      $ionicPush.register();
    
    }

    ionic.Platform.fullScreen(true,true);

     if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    
  });
});

initBaztille.config(['$ionicAutoTrackProvider', function($ionicAutoTrackProvider) {
  // Don't track which elements the user clicks on.
  //$ionicAutoTrackProvider.disableTracking('Tap');
}])

initBaztille.config(function($ionicConfigProvider) {
  //native scrolling
  if (!ionic.Platform.isIOS()) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }
})

initBaztille.config(function($ionicConfigProvider) {
  // remove back button previous title text
  // use unicode em space characters to increase touch target area size of back button
  $ionicConfigProvider.backButton.previousTitleText(false).text('&emsp;&emsp;');
});
