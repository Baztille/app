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

serviceBaztille.factory('User',['$http','config', 'Webservice', function($http, config,webservice){
	return {
		login:function(data){
            return webservice.callPostBaztilleWs( data, '/session/login' );
        },
        create:function(data){
            return webservice.callPostBaztilleWs( data, '/user/signin' );
        },
        get:function(data){
            return webservice.callGetBaztilleWs( data, '/session/who_am_i' );
        },
        getRank:function(data){
            return webservice.callGetBaztilleWs( data, '/session/myranking' );
        },        
        logout:function(data){
            return webservice.callPostBaztilleWs( data, '/session/logout' );
        },        
        forgetpassword:function(data){
            return webservice.callPostBaztilleWs( data, '/user/forgetpassword' );
        },
        changePassword:function(data){
            return webservice.callPostBaztilleWs( data, '/user/changepassword' );
        },
        sendContactMessage:function(data){
            return webservice.callPostBaztilleWs( data, '/user/sendcontactmessage' );
        },        
        reconfirmEmail:function(data){
            return webservice.callGetBaztilleWs( data, '/user/reconfirmemail' );
        },        
    }
}]);

serviceBaztille.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.localStorage.token) {
       // config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.data.error_code === 500) {
        if(response.data.error_descr == "Invalid object ID") {
            //console.log('kill authInterceptor');
            //$rootScope.currentUser;
        //    delete $window.localStorage.token;
        }
        
      }
      return response || $q.when(response);
    }
  };
});
