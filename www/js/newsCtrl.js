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

appBaztille.controller('NewsCtrl', function(User, News, $scope, $state, $ionicLoading,  $ionicModal, $ionicPopup, $window, $ionicHistory, $ionicSideMenuDelegate, $http) {
  $ionicSideMenuDelegate.canDragContent(true);
  
      $scope.reloadNews = function()
      {

            News.getAllNews( {
            } ).then( function(resp) {

                $scope.headlines = [];

                for( var i in resp.data )
                {
                   var news = resp.data[i];
                   
                   if( news.virtuals &&news.virtuals.emailSnippet )
                   {
                        var preview = news.virtuals.emailSnippet.replace(/(¶)/gm,"");

                        $scope.headlines.push( { 
                            id: news.id,
                            title: news.title,
                            preview: preview,
                            date: moment( Math.round( news.firstPublishedAt / 1000 ),'X').fromNow()
                        } );
                    }                   
                }

            }, function( err ) {} );
      
      };

     $scope.reloadNews();  


});
