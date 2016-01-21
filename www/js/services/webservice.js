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


serviceBaztille.factory('Webservice',['$http','config','$cacheFactory', '$rootScope', '$ionicAnalytics', '$ionicPopup', '$state', '$window',function($http, config, $cacheFactory, $scope, $ionicAnalytics, $ionicPopup, $state, $window){

    var processBzComDatas = function( data )
    {
        if( data.user && data.user.points )
        {
            if( $scope.points != data.user.points )
            {
                $window.localStorage.points = data.user.points;
                $scope.points = data.user.points;
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


            $scope.$broadcast('loading:hide')
            $ionicAnalytics.track('Bug', {
              type: 'Webservice',
              error: 'Baztille Webservice error ('+result.$$state.value+') during call '+url+' with args: ',
              error_data: data,
              error_result : result
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
                      error: 'Baztille Webservice error (server replay not JSON) during call '+url+' with args: ',
                      error_data: data,
                      error_result : result
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

                              var alertPopup = $ionicPopup.alert({
                                title: 'Attention',
                                template: 'Vous devez être connecté pour accéder à cette page'
                              });

                              alertPopup.then(function(res) {
                                $state.go('splash');
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
              error: 'Baztille Webservice error ('+result.$$state.value+') during call '+url+' with args: ',
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


