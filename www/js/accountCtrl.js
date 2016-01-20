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

appBaztille.controller('AccountCtrl', function(User, $scope, $state, $ionicLoading, $ionicModal, $ionicPopup, $window, $ionicHistory, $ionicSideMenuDelegate, $http) {
  $ionicSideMenuDelegate.canDragContent(true);
  
    $scope.loadUserinfos = function() 
    {
        
      User.getAllInfos({
        session: $window.localStorage.token
      }).success(function(data){


        $scope.data = data;

    });

    };

    $scope.updateOptin = function( value, control )
    {
        if( typeof value == 'undefined' )
        {
            value = false;
        }

        if( control == 'email_votes' )
        {
            User.updateOptin( {email:'votes', optin:value} );
        }
        else if( control == 'email_news' )
        {
            User.updateOptin( {email:'news', optin:value} );
        }
    };
    
    $scope.removeAccount = function() {

           var confirmPopup = $ionicPopup.confirm({
             title: 'Supprimer mon compte Baztille',
             template: "Nous sommes désolé que Baztille ne réponde pas à votre attente.<br/>Ce mouvement est le vôtre : n'hésitez pas à nous contacter pour nous dire commment nous pourrions nous améliorer.<br/><br/>Etes-vous sûr de vouloir supprimer votre compte maintenant ?"
           });

           confirmPopup.then(function(res) {
             if(res) {
                User.removeAccount( {} );
                $scope.currentUser = 'undefined';
                delete $window.localStorage.token;
                
                $state.go('splash');
             } else {
             }
           });


    };
    
    $scope.loadUserinfos();


});
