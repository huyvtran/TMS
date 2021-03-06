﻿angular.module('myapp').controller('driver_truckstationController', function ($rootScope, $scope, $state, $location, $http, $timeout, $ionicLoading, $ionicSideMenuDelegate, $ionicModal, localDb) {
    console.log('driver_truckstationController');

    $ionicSideMenuDelegate.canDragContent(false);
    Common.RootObj.selectedTab = 2;
    //var strMethod="FLMMobileDriver_StationPassed";
    //if ($state.params.type == "container")
    //    strMethod = "FLMMobileDriver_COStationPassed";
    $scope.LoadData = function () {
        $ionicLoading.show();
        localDb.FLMMobileDriverStationPassed($state.params.masterID).then(function (res) {
            $ionicLoading.hide();
            $scope.StationData = res;
        })       
    }
    $scope.LoadData();

    $scope.StationClick = function (e, o) {
        e.preventDefault();
    }

    // nav bar
    $scope.BackToTruck = function () {
        $state.go('driver.truck');
    }
});