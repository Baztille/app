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

appBaztille.controller('VotersCtrl', function(User,Questions, $scope, $state, $ionicLoading, $ionicModal, $ionicPopup, $window, $ionicHistory, $ionicSideMenuDelegate, $http, $stateParams) {
  $ionicSideMenuDelegate.canDragContent(true);
  
    $scope.isArg = false;
    if( $stateParams.questionId )
    {
        $scope.id = $stateParams.questionId;
    }
    else if( $stateParams.argId )
    {
        $scope.isArg = true;
        $scope.id = $stateParams.argId;
    }


    $scope.loadVoters = function() 
    {

        Questions.listVoters( {
            id:$scope.id,
            isArg: $scope.isArg,
            session: $window.localStorage.token
        } ).success(function(data){
            
            $scope.contribution_text = data.text;
            $scope.data = data;
            $scope.voters_nbr = data.voters.length;
            
        } );    
    
    };

    $scope.loadVoters();


});
