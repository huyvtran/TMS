angular.module('myapp').controller('driver_summaryMasterController', function ($rootScope, $scope, $ionicLoading, $state, $http, localDb) {
    console.log('driver_summaryMasterController');

    localDb.FLMMobileScheduleGet($state.params.timeSheetDriverID).then(function (res) {
        $scope.AcceptedItem = res;
    })


    $scope.BackToTruck = function () {
        $state.go('driver.summary');
    }

    $scope.ShowSOList = function (masterID, locationID, statusID, timedriverID, timesheetID) {
            $state.go('driver.truck_detail', { masterID: masterID, locationID: locationID, statusID: statusID, sheetDriverID: timedriverID, sheetID: timesheetID })
    }
});