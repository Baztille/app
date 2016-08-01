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


serviceBaztille.factory('Questions',['$http','config','Webservice', '$cacheFactory', '$rootScope', '$window',function($http, config, webservice, $cacheFactory, $scope, $window){

    //var questCache = $cacheFactory('questCache', { capacity: 10 });

	return {
	
		getActive:function(data){
		    return webservice.callGetBaztilleWs( data, '/question/list/vote/1' );
        },
        getProposed: function(data){
            if(data.filter && data.category && data.page) {
                return webservice.callGetBaztilleWs( data, '/question/pagelist/proposed/'+data.page+'/'+data.category+'/'+data.filter );
            }
            else if(data.filter && data.category) {
                // DEPRECATED : you should specify page all the time
                return webservice.callGetBaztilleWs( data, '/question/list/proposed/1/'+data.category+'/'+data.filter );
            }
            else if (data.filter && data.category == 1) {
                return webservice.callGetBaztilleWs( data, '/question/list/proposed/1/all/'+data.filter );
                // DEPRECATED : you should specify page all the time
            } 
            else {
                // DEPRECATED : you should specify filter & category all the time
                return webservice.callGetBaztilleWs( data, '/question/list/proposed/1' );
            }
        },
        getVoted: function(data){
            if( data.page) {
                return webservice.callGetBaztilleWs( data, '/question/pagelist/decided/'+data.page+'/1/0' );
            }
            else {
                // DEPRECATED : you should specify page all the time
                return webservice.callGetBaztilleWs( data, '/question/list/decided/1' );
            }
        },
        getRejected: function(data){
            // DEPRECATED : there is no more rejected question
            return webservice.callGetBaztilleWs( data, '/question/list/rejected/1' );
        },
        newQuestion: function( data ) {
            return webservice.callPostBaztilleWs( data, '/question/propose' );
        },
        getQuestion: function( data ) { 
            if( data.filter )
            {
                return webservice.callGetBaztilleWs( data, '/question/'+data.id+'/'+data.filter );
            }
            else
            {
                // Backward compatibility        
                return webservice.callGetBaztilleWs( data, '/question/'+data.id );
            }
        },
        newArg: function( data ) {
            return webservice.callPostBaztilleWs( data, '/question/'+data.id+'/postarg' );
        },
        vote: function( data ) {
            return webservice.callPostBaztilleWs( data, '/question/vote/arg/'+data.id );
        },
        questionvote: function( data ) {
            return webservice.callPostBaztilleWs( data, '/question/vote' );
        },     
        listVoters: function( data ) {
            if( data.isArg )
            {
                return webservice.callGetBaztilleWs( data, '/question/votersarg/'+data.id );
            }            
            else
            {
                return webservice.callGetBaztilleWs( data, '/question/voters/'+data.id );
            }
        },   
        updateQuestion: function( data ) {
            return webservice.callPostBaztilleWs( data, '/question/updateQuestion' );
        },
        updateArg: function( data ) {
            return webservice.callPostBaztilleWs( data, '/question/updateArg' );
        },
        report: function( data ) {
            return webservice.callPostBaztilleWs( data, '/admin/report' );
        }
    }
}]);


