angular.module('myapp').controller('driver_summaryController', function ($rootScope, $scope, $ionicLoading, $state, $location, $http, $timeout, $ionicSideMenuDelegate, charting) {
    console.log('driver_summaryController');

    $rootScope.DriverID = Common.Auth.Item.DriverID;
    $scope.selectedTab = 1;
    $scope.salaryChart = null;
    $scope.performChart = null;

    var date = new Date();
    $scope.SSearch = {
        dSFrom: new Date(date.getFullYear(), date.getMonth(), 1),
        dSTo: new Date(date.getFullYear(), date.getMonth() + 1, 0)
    }
    $scope.HSearch = {
        dSFrom: new Date(date.getFullYear(), date.getMonth(), 1),
        dSTo: new Date(date.getFullYear(), date.getMonth() + 1, 0)
    }

    //Performance

    $scope.myChartOpts = charting.pieChartOptions;

    //History; H: history ; S:Summary

    $scope.H_dateFrom_callback = function (val) {
        if (!val) {
        } else {
            $scope.HSearch.dSFrom = val;
        }
    };

    $scope.H_dateTo_callback = function (val) {
        if (!val) {
        } else {
            $scope.HSearch.dSTo = val;
        }
    };

    $scope.S_dateFrom_callback = function (val) {
        if (!val) {
        } else {
            $scope.SSearch.dSFrom = val;
        }
    };

    $scope.S_dateTo_callback = function (val) {
        if (!val) {
        } else {
            $scope.SSearch.dSTo = val;
        }
    };

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
    $scope.loadSalary = function () {
        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileDriverSalary_List",
            data: {
                dtfrom: $scope.SSearch.dSFrom,
                dtto: $scope.SSearch.dSTo
            },
            success: function (res) {
                $ionicLoading.hide();
                $scope.SalaryList = res;
                var data = [[]];
                var hasData = false;
                data[0].push(['Lương chuyến', 0]);
                data[0].push(['Lương cơ bản', 0]);
                data[0].push(['Lương thưởng', 0]);
                data[0].push(['Lương doanh thu', 0]);
                angular.forEach(res, function (o, i) {
                    switch (o.CostName) {
                        case 'Lương chuyến':
                            data[0][0][1] += o.Price;
                            hasData = true;
                            break;
                        case 'Lương thưởng':
                            data[0][1][1] += o.Price;
                            hasData = true;
                            break;
                    }
                })
                if (hasData) {
                    $scope.salaryData = data;

                    if (Common.HasValue($scope.salaryChart))
                        $scope.salaryChart.destroy();
                    $timeout(function () {
                        $scope.salaryChart = $.jqplot('salaryChart', $scope.salaryData, charting.donutOptions);
                    }, 100)
                }
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

    $scope.$watch("SSearch.dSFrom", function (newValue, oldValue) {
        if (newValue != oldValue) {
            $ionicLoading.show();
            $scope.loadSalary();
        }
    });
    $scope.$watch("SSearch.dSTo", function (newValue, oldValue) {
        if (newValue != oldValue) {
            $ionicLoading.show();
            $scope.loadSalary();
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
            if (Common.HasValue($scope.salaryChart))
                $scope.salaryChart.destroy();
            $timeout(function () {
                $scope.performChart = $.jqplot('chart', $scope.someData, charting.pieChartOptions);
            }, 100)
        }
        else {
            if(Common.HasValue($scope.salaryChart))
                $scope.salaryChart.destroy();
            if (Common.HasValue($scope.performChart))
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
                dtfrom: $scope.SSearch.dSFrom,
                dtto: $scope.SSearch.dSTo
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

    $scope.Master = function (item) {
        $state.go('driver.summary_master', { timeSheetDriverID: item.TimeSheetDriverID });
    }

    //Incomde
    $scope.salaryData = [[['s',10]]];
    $scope.SalaryChartOpts = charting.donutOptions;
});