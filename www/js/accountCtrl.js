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

appBaztille.controller('AccountCtrl', function(User, $scope, $rootScope, $state, $ionicLoading, $ionicModal, $ionicPopup, $window, $ionicHistory, $ionicSideMenuDelegate, $http) {
  $ionicSideMenuDelegate.canDragContent(true);
  
    $scope.loadUserinfos = function() 
    {
        User.getAllInfos({
        session: $window.localStorage.token
      }).success(function(datafirst){

          User.getRank({
            session: $window.localStorage.token
          }).success(function(data){
            
            if(data.user_id) 
            {
                $scope.data = angular.extend(data, datafirst);
                
                $scope.data.pointsdetails.contribution_day_points = 3 * $scope.data.pointsdetails.contribution_day;
                $scope.data.pointsdetails.validated_nbr = 0;
                if( $scope.data.pointsdetails.validated_answers ) { $scope.data.pointsdetails.validated_nbr += $scope.data.pointsdetails.validated_answers };
                if( $scope.data.pointsdetails.validated_question ) { $scope.data.pointsdetails.validated_nbr += $scope.data.pointsdetails.validated_question };
                $scope.data.pointsdetails.validated_nbr_points = 100 * $scope.data.pointsdetails.validated_nbr;
            }
            else
            {

              $rootScope.$broadcast('unloggedin:show');

            }
        });



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
                $rootScope.$broadcast('tracking:event', {title:'compte',value:'remove-account-open'});
                User.removeAccount( {} );
                $scope.currentUser = undefined;
                $window.localStorage.clear();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                
                $state.go('splash');
             } else {
             }
           });


    };
    
    $scope.loadUserinfos();

    $scope.nb_points_label = "Points Baztille";


});
