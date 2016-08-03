angular.module('myapp').controller('driver_summaryMasterController', function ($rootScope, $scope, $ionicLoading, $state, $http) {
    console.log('driver_summaryMasterController');


    Common.Services.Call($http, {
        url: Common.Services.url.MOBI,
        method: "FLMMobileSchedule_Get",
        data: {
            timeSheetDriverID: $state.params.timeSheetDriverID,
        },
        success: function (res) {
            $scope.AcceptedItem = res;

        }
    })

    $scope.BackToTruck = function () {
        $state.go('driver.summary');
    }

    $scope.ShowSOList = function (masterID, locationID, statusID, timedriverID, timesheetID) {
            $state.go('driver.truck_detail', { masterID: masterID, locationID: locationID, statusID: statusID, sheetDriverID: timedriverID, sheetID: timesheetID })
    }
});