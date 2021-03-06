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
if(window.cordova) {
  var appBaztille = angular.module('app.controllers', ['angularMoment']); 
} else {
  var appBaztille = angular.module('app.controllers', ['angularMoment','720kb.socialshare']); 
}

var serviceBaztille = angular.module('app.services',[]);

var initBaztille = angular.module('starter', ['ionic', 'app.controllers', 'app.services','jett.ionic.content.banner']);

initBaztille.run(function($ionicPlatform, $ionicLoading, $rootScope, $ionicPopup, $ionicSideMenuDelegate, $ionicHistory, $ionicContentBanner, $state, $window, config) {
    
   // Analytics If keenIO config
   if (config.KeenProjectId && config.KeenWriteKey) {
    
     var wsAnalytics = new Keen({
        projectId: config.KeenProjectId,
        writeKey: config.KeenWriteKey
     });

     $rootScope.isFirstLoadedPage = true; // Track Load

   } 
    
   // Globals vars

   $rootScope.isDev = (document.URL.indexOf( 'localhost' ) > -1) ? true : false;
   $rootScope.currentVersion = window.VERSION;
   $rootScope.currentPlatform = ionic.Platform.platform();
   $rootScope.currentPlatformVersion = ionic.Platform.version();
   if($window.localStorage.points){ $rootScope.points = $window.localStorage.points; }
   if($window.localStorage.userID){ $rootScope.userID = $window.localStorage.userID; } 

   $rootScope.$on('loading:show', function() {
    $ionicLoading.show({templateUrl: 'templates/loader.html', animation: 'fade-in',
      maxWidth: 60,
      noBackdrop: true,
      showDelay: 200})
   })


  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  })

  $rootScope.$on('unloggedin:show', function (event, toState) {

    $window.localStorage.afterlogin = $state.current.name;
    var data = JSON.stringify($state.params);
    $window.localStorage.setItem("afterloginParams", data);
    
    var alertPopup = $ionicPopup.show({
       // title: 'Devenez membre Baztille',
       // subTitle: 'proposez, votez et décidez !',
        template: '<div style="text-align:center;font-size:90%;"><img id="splash_logo" src="img/logo_long_black.png" style="width:170px;margin:auto;" alt="Baztille"></img><br>Chaque jour, en quelques minutes, décidez à la place des décideurs.<br><br><h3>Reprenez en main votre démocratie !</h3></div>',
        cssClass: "popup-vertical-buttons popup-suscribe-extend",
         inputType: 'password',
        buttons: [
        { 
            text: 'Connectez-vous',
            type: 'button-dark',
            onTap: function(e) {
              $state.go('splash.login');
            }
        },

        {
            text: 'Inscrivez-vous',
            type: 'button-positive',
            onTap: function(e) {
              $state.go('splash.suscribe');
            }
        },
        { text: 'Fermer' }

        ]
    });

  });

  $rootScope.$on('tracking:event', function (event,args) {
    $rootScope.wsAnalyticsEvent(args);
  });

  $rootScope.wsAnalyticsEvent = function(args) {
    wsAnalytics.addEvent("action", {
          user : {
            id : $rootScope.userID,
            points : $rootScope.points,
            device: $rootScope.currentPlatform,
            device_version: $rootScope.currentPlatformVersion
          },
          app: {
            version_number: $rootScope.currentVersion,
            dev_mode: $rootScope.isDev
          },
          action: {
            title: args.title,
            value: args.value
          }
      });
  }


  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    
    // fixed menu
    if (toState.name == 'question.questions' || toState.name == 'question.voted' || toState.name == 'question.proposed' || toState.name == 'app.about' || toState.name == 'app.news' || toState.name == 'compte.points' || toState.name == 'compte.infos' || toState.name == 'compte.contents') {
        $rootScope.showCustomMenuHack = false;
        $rootScope.showCustomMenu = true;
        $rootScope.showCustomBack = false;
    } else {
        $rootScope.showCustomMenuHack = false;
        $rootScope.showCustomMenu = false;
        $rootScope.showCustomBack = true;
    }

    //fixed shadow header
    if (toState.name == 'question.questions' || toState.name == 'question.voted' || toState.name == 'question.proposed' || toState.name == 'compte.points' || toState.name == 'compte.infos' || toState.name == 'compte.contents') {
        $rootScope.isTabs = true;
    } else {
        $rootScope.isTabs = false;
    }

    if($window.localStorage.token) {
      $rootScope.currentUser = $window.localStorage.token;
    } else {
      $rootScope.currentUser = undefined;
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

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {

    if(wsAnalytics) {
        
      if($rootScope.isFirstLoadedPage) {

        var campaign={};

        if(!window.cordova) { // Only Desktop
          if(window.getParameterByName('source')) {
            campaign = { source: window.getParameterByName('source'), title: window.getParameterByName('title')};
          }
        }
        
        wsAnalytics.addEvent("load", {
          user : {
            id : $rootScope.userID,
            points : $rootScope.points,
            device: $rootScope.currentPlatform,
            device_version: $rootScope.currentPlatformVersion
          },
          app: {
            version_number: $rootScope.currentVersion,
            dev_mode: $rootScope.isDev
          },
          ip_address: "${keen.ip}",
          user_agent: "${keen.user_agent}",
          referrer_url: document.referrer,
          page_url : toState.name,
          campaign : campaign, 
          keen: {
            addons: [
              {
                name: "keen:ip_to_geo",
                input: {
                  ip: "ip_address"
                },
                output: "ip_geo_info"
              },
              {
                name: "keen:ua_parser",
                input: {
                  ua_string: "user_agent"
                },
                output: "parsed_user_agent"
              },
              {
                name: "keen:referrer_parser",
                input: {
                  referrer_url: "referrer_url",
                  page_url: "page_url"
                },
                output: "referrer.info"
              }
            ]
          }
        });
      
        $rootScope.isFirstLoadedPage = false;

      } else {

        wsAnalytics.addEvent("pageviews", {
          user : {
            id : $rootScope.userID,
            points : $rootScope.points,
            device: $rootScope.currentPlatform,
            device_version: $rootScope.currentPlatformVersion
          },
          app: {
            version_number: $rootScope.currentVersion,
            dev_mode: $rootScope.isDev
          },
          page_url : toState.name
        });

      }
      
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

  //  NotLogged Function on ion-nav
  $rootScope.notLogged = function() {
    $rootScope.$broadcast('unloggedin:show');
  }


  $ionicPlatform.ready(function() {

    if (navigator.splashscreen) {
      navigator.splashscreen.hide();
    }

    if( window.universalLinks ) {
      window.universalLinks.subscribe(null, function(eventData) { 

        if(eventData.hash) { // if !html5mode
          var substrHash    = eventData.hash.substr(1);
              arrayHash = substrHash.split('/');
        } else {
          var substrHash    = eventData.path.substr(1);
              arrayHash = substrHash.split('/');
        }
        
            if(arrayHash[0] == "question") {
              if(arrayHash[1] == "voted") {
                $state.go('question.voted');
              }
              if(arrayHash[1] == "questions") {
                $state.go('question.questions');
                if(arrayHash[2]) {
                  $state.go('question.single',{ questionID: arrayHash[2] });
                  if(arrayHash[3]) {
                    $state.go('question.arg',{ questionID: arrayHash[2], argID: arrayHash[3] });
                  }
                }
              }  
              if(arrayHash[1] == "proposed") {
                $state.go('question.proposed');
              }              
            }
            if(arrayHash[0] == "compte") {
              if(arrayHash[1] == "infos") {
                $state.go('compte.infos');
              }
              if(arrayHash[1] == "points") {
                $state.go('compte.points');
              }
            }
      });
    }

    if( window.cordova ) {

      if (config.oneSignal && config.googleProjectNumber) {
      
      // PUSH only for native cordova
      //window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

      var notificationOpenedCallback = function(jsonData) {
        //alert("Notification received:\n" + JSON.stringify(jsonData));
        //console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      };

      // Update with your OneSignal AppId and googleProjectNumber before running.
      window.plugins.OneSignal.init(config.oneSignal,
        {googleProjectNumber: config.googleProjectNumber},
        notificationOpenedCallback);
      }
    
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

initBaztille.config(function($ionicConfigProvider) {
  //native scrolling
  if (!ionic.Platform.isIOS()) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }
  //disabled transition
  $ionicConfigProvider.views.transition('none');
})

initBaztille.config(function($ionicConfigProvider) {
  // remove back button previous title text
  // use unicode em space characters to increase touch target area size of back button
  $ionicConfigProvider.backButton.previousTitleText(false).text('&emsp;&emsp;');
});
