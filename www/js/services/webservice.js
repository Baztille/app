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


serviceBaztille.factory('Webservice',['$http','config','$cacheFactory', '$rootScope', '$ionicAnalytics', '$ionicPopup', '$state', '$window','$ionicContentBanner',function($http, config, $cacheFactory, $scope, $ionicAnalytics, $ionicPopup, $state, $window, $ionicContentBanner){

    var processBzComDatas = function( data )
    {
        if( data.user && data.user.points )
        {
            if( $scope.points != data.user.points )
            {
                $window.localStorage.points = data.user.points;
                $scope.points = data.user.points;
            }
            if( data.user._id )
            {
                $window.localStorage.userID = data.user._id.$id;
                $scope.userID = data.user._id.$id;
                $scope.userLastSession = data.user.last_session;
            }
            
        }    
    }

    return {


    //var questCache = $cacheFactory('questCache', { capacity: 10 });

      callGetBaztilleWs : function( data, url ) {

        var session = $window.localStorage.token;
        
        var result = $http.get(config.apiUrl + url + '?session='+session,{
            timeout : 10000,
            headers:{
                'Content-Type':'application/json'
            }}).success(function(reply, status, headers, configlocal) {
            
                $scope.needToReload = false;

                if( typeof reply != 'object' )
                {
                    console.log( reply );
                }            

                if( reply._bzcom )
                {
                    // Standard Baztille datas to process
                    processBzComDatas( reply._bzcom );
                }

        })
        .error(function(data, status, headers, configlocal) {

            $ionicContentBanner.show({
              text: ['Vous êtes déconnecté'],
              autoClose: 3000,
              icon: 'none',
              type: 'error',
              transition: 'vertical'
            });

            $scope.needToReload = true;

            $scope.$broadcast('loading:hide')
            $ionicAnalytics.track('Bug', {
              type: 'Webservice',
              error: 'Baztille Webservice error during call '+url+' with args: ',
              error_url: url,
              error_data: data
            });
            
            if( config.alertForWsError )
            {
                alert( result );
            }

        });    


        return result;      
    },
    
    callPostBaztilleWs : function( data, url ) {

        var session = $window.localStorage.token;

        var result = $http.post(config.apiUrl + url + '?session='+session,data,{
            timeout : 10000,        
            headers:{
                'Content-Type':'application/json'
            }}).success(function(reply, status, headers, configlocal) {
            
                if( typeof reply != 'object' )
                {
                    $scope.$broadcast('loading:hide')
                    $ionicAnalytics.track('Bug', {
                      type: 'Webservice',
                      error: 'Baztille Webservice error (server replay not JSON) during call with args ',
                      error_data: data,
                      error_url: url
                    });

                    if( config.alertForWsError )
                    {
                        alert( reply );
                    }
                }
                else
                {
                    // Detect "not logged" message and redirect user to home page
                    if( typeof reply.error != 'undefined' )
                    {
                        if( reply.error_descr == 'Not logged' )
                        {
                            // delete old session locally
                            $scope.currentUser = undefined;
                            $window.localStorage.clear();

                            var alertPopup = $ionicPopup.show({
                                title: 'Accès Membre',
                                subTitle: 'cette fonctionnalité n\'est pas disponible',
                                template: 'Vous devez être connecté pour accéder à cette page',
                                scope: $scope,
                                cssClass: "popup-vertical-buttons",
                                buttons: [
                                  {
                                    text: '<b>Inscription</b>',
                                    type: 'button-positive',
                                    onTap: function(e) {
                                      $state.go('splash');
                                    }
                                  },
                                  { 
                                    text: 'Connexion',
                                    type: 'button-dark',
                                    onTap: function(e) {
                                      $state.go('splash');
                                    }
                                  },
                                  { text: 'Retour' }
                                  
                                ]
                            });

                            delete reply.error; // Make sure no error message is displayed afterwards
                        }                        
                    }
                }            
        })
        .error(function(reply, status, headers, configlocal) {


            $scope.$broadcast('loading:hide')
            $ionicAnalytics.track('Bug', {
              type: 'Webservice',
              error: 'Baztille Webservice error during call url with args',
              error_url: url,
              error_data: data,
              error_result : result
            });
            if( config.alertForWsError )
            {
                alert( reply );
            }
        });    

        return result;      
    }
    
    } // return
}]);