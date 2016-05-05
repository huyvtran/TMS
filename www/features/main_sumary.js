app.controller('main_sumaryCtrl', function ($rootScope, $scope, $ionicLoading, $state, $location, $http, $timeout, $ionicSideMenuDelegate, charting) {
    console.log('main_sumaryCtrl');

    $rootScope.DriverID = Common.Auth.Item.DriverID;
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.selectedTab = 2;
    $scope.salaryChart = null;
    $scope.performChart = null;

    var date = new Date();
    $scope.dSFrom = new Date(date.getFullYear(), date.getMonth(), 1);
    $scope.dSTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    $scope.HSearch = {
        dSFrom: new Date(date.getFullYear(), date.getMonth(), 1),
        dSTo: new Date(date.getFullYear(), date.getMonth() + 1, 0)
    }

    //Performance


    $scope.myChartOpts = charting.pieChartOptions;

    //History
    $scope.loadHistory = function () {
        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileDriverHistory_List",
            data: {
                driverID: $rootScope.DriverID,
                dtfrom: $scope.HSearch.dSFrom,
                dtto: $scope.HSearch.dSTo
            },
            success: function (res) {
                $ionicLoading.hide(); $scope.$broadcast('scroll.refreshComplete');
                $scope.HistoryList = res;
                $ionicLoading.hide();

                var hdata = [];
                hdata[0] = ['Complete', 0];
                hdata[1] = ['Cancel', 1];
                angular.forEach(res, function (o, i) {
                    if (o.IsReject) {
                        hdata[1][1]++;
                    }
                    else {
                        hdata[0][1]++;
                    }
                })
                $scope.someData = [hdata];
            }
        })
    }
    $scope.$watch("HSearch.dSFrom", function (newValue, oldValue) {
        if (newValue != oldValue) {
            $ionicLoading.show();
            $scope.loadHistory();
        }
    });
    $scope.$watch("HSearch.dSTo", function (newValue, oldValue) {
        if (newValue != oldValue) {
            $ionicLoading.show();
            $scope.loadHistory();
        }
    });

    $scope.SelectTab = function (idx) {
        if (idx == 2) {
            $scope.performChart.destroy();
            $timeout(function () {
                $scope.salaryChart = $.jqplot('salaryChart', $scope.salaryData, charting.donutOptions);
            },100)
        }
        else if (idx == 3) {
            $scope.salaryChart.destroy();
            $timeout(function () {
                $scope.performChart = $.jqplot('chart', $scope.someData, charting.pieChartOptions);
            }, 100)
        }
        else {
            $scope.salaryChart.destroy();
            $scope.performChart.destroy();
        }
        $scope.selectedTab = idx;
    }

    $scope.LoadData = function () {
        $scope.lstCheck = [false, false, false, false, false, false];

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileDriverHistory_List",
            data: {
                driverID: $rootScope.DriverID,
                dtfrom: $scope.HSearch.dSFrom,
                dtto: $scope.HSearch.dSTo
            },
            success: function (res) {
                $ionicLoading.hide(); $scope.$broadcast('scroll.refreshComplete');
                $scope.HistoryList = res;
                $ionicLoading.hide();

                var hdata = [];
                hdata[0] = ['Complete', 0];
                hdata[1] = ['Cancel', 1];
                angular.forEach(res, function (o, i) {
                    if (o.IsReject) {
                        hdata[1][1]++;
                    }
                    else {
                        hdata[0][1]++;
                    }
                })
                $scope.someData = [hdata];
                $scope.performChart = $.jqplot('chart', $scope.someData, charting.pieChartOptions);
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
                var data = [[]];
                var hasData=false;
                data[0].push(['Lương chuyến', 0]);
                data[0].push(['Lương cơ bản', 0]);
                data[0].push(['Lương thưởng', 0]);
                data[0].push(['Lương doanh thu', 0]);
                angular.forEach(res, function (o, i) {
                    switch (o.CostName) {
                        case 'Lương chuyến':
                            data[0][0][1] += o.Price;
                            hasData=true;
                            break;
                        case 'Lương thưởng':
                            data[0][1][1] += o.Price;
                            hasData = true;
                            break;
                    }
                })
                if (hasData) {
                    $scope.salaryData = data;
                    $scope.salaryChart = $.jqplot('salaryChart', $scope.salaryData, charting.donutOptions);
                }
            }
        })
    }
    $scope.LoadData();

    //Incomde
    $scope.salaryData = [[['s',10]]];
    $scope.SalaryChartOpts = charting.donutOptions;
});