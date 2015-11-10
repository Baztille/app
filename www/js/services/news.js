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

serviceBaztille.factory('News',['$http','config','Webservice', '$cacheFactory',function($http, config, webservice, $cacheFactory){


	return {
		
		getAllNews:function(data){
		    return webservice.callGetBaztilleWs( data, '/news/list' );
        },
		getNews:function(data){
		    return webservice.callGetBaztilleWs( data, '/news/read/'+data.id );
        },


    }
}]);


