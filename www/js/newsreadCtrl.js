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

appBaztille.controller('NewsreadCtrl', function(User, News, $scope, $state, $ionicLoading,  $ionicModal, $ionicPopup, $window, $ionicHistory, $ionicSideMenuDelegate, $http, $stateParams ) {
    
    $ionicSideMenuDelegate.canDragContent(true);

    $scope.newsId = $stateParams.newsID;

      $scope.reloadOneNews = function()
      {

            News.getNews( {
                id: $scope.newsId
                
            } ).then( function(resp) {
                
                var html = '';

                for( var i in resp.data.content.bodyModel.paragraphs )
                {
                    var p = resp.data.content.bodyModel.paragraphs[i];

                    if( p.type == 13 )
                    {
                        html += '<h3>'+p.text+'</h3>';
                    }
                    else
                    {
                        html += '<p>'+p.text+'</p>';
                    }
                    
                    if( p.metadata )
                    {
                        // TODO: fix this to display image
                        // html += '<p><img src="https://cdn-images-1.medium.com/max/800/'+p.metadata.id+'" style="width:100%;height:100%;"/></p>';
                    }
                }
            
                $scope.news = {
                    title: resp.data.title,
                    content: html
                };

                if(!window.cordova) { // Force update title
                    document.title = 'Baztille - News : ' + $scope.news.title;
               }

                $scope.date = moment( Math.round( resp.data.firstPublishedAt / 1000 ),'X').fromNow();

            }, function( err ) {} );
      
      };

     $scope.reloadOneNews();  


});
