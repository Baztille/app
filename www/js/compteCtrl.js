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

appBaztille.controller('CompteCtrl', function(User, $scope, $rootScope, $state, $ionicLoading, $ionicModal, $ionicPopup, $window, $ionicHistory, $ionicSideMenuDelegate, $http) {
  $ionicSideMenuDelegate.canDragContent(true);
    
    // destroy modals on destroy view
    $scope.$on('$destroy', function() { 
        $scope.ExplainedModal.remove();
    });
    
    // Modal point expliqués

    $ionicModal.fromTemplateUrl('templates/pointsexplained.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function ($ionicModal) {
        $scope.ExplainedModal = $ionicModal;
    });

    $scope.closePointsExplained = function () {
        $scope.ExplainedModal.hide()
    };

     $scope.PointsExplained = function () {
        $scope.ExplainedModal.show()
    };
  

    $scope.loadUserinfos = function() 
    {
        
      User.getRank({
        session: $window.localStorage.token
      }).success(function(data){

        if(data.user_id) 
        {
            $scope.data = data;
            
            $scope.data.pointsdetails.contribution_day_points = 3 * $scope.data.pointsdetails.contribution_day;
            $scope.data.pointsdetails.validated_nbr = 0;
            if( $scope.data.pointsdetails.validated_answer ) { $scope.data.pointsdetails.validated_nbr += $scope.data.pointsdetails.validated_answer };
            if( $scope.data.pointsdetails.validated_question ) { $scope.data.pointsdetails.validated_nbr += $scope.data.pointsdetails.validated_question };
            $scope.data.pointsdetails.validated_nbr_points = 100 * $scope.data.pointsdetails.validated_nbr;
        }
        else
        {

            // delete old session locally
            $scope.currentUser = undefined;
            $window.localStorage.clear();

            $rootScope.$broadcast('unloggedin:show');
        }
    });

    };
    
    $scope.loadUserinfos();


    $scope.nb_points_label = "Points Baztille";
    $scope.points = $window.localStorage.points;

  // Form data for the login modal
  $scope.newQuestion = {};

});
