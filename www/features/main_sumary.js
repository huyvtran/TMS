app.controller('main_sumaryCtrl', function ($rootScope, $scope, $ionicLoading, $state, $location, $http, $timeout, $ionicSideMenuDelegate, charting) {
    console.log('main_sumaryCtrl');

    $rootScope.DriverID = Common.Auth.Item.DriverID;
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.selectedTab = 2;

    var date = new Date();
    $scope.dSFrom = new Date(date.getFullYear(), date.getMonth(), 1);
    $scope.dSTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    //Performance
    $scope.someData = [[
        ['Heavy Industry', 66], ['Retail', 15], ['Light Industry', 19]
    ]];

    $scope.myChartOpts = charting.pieChartOptions;
    //History

    $scope.LoadData = function () {
        $ionicLoading.show();
        $scope.lstCheck = [false, false, false, false, false, false];

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileDriverHistory_List",
            data: {
                driverID: $rootScope.DriverID,
            },
            success: function (res) {
                $scope.HistoryList = res;
                $ionicLoading.hide();
            }
        })

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileDriverSalary_List",
            data: {
                dtfrom: $scope.dSFrom,
                dtto: $scope.dSTo
            },
            success: function (res) {
                $scope.SalaryList = res;
            }
        })
    }
    $scope.LoadData();

    //Incomde

    $scope.salaryData = [[
    ['Heavy Industry', 12], ['Retail', 9], ['Light Industry', 14],
    ['Out of home', 16]
    ]];
    $scope.SalaryChartOpts = charting.donutOptions;
});