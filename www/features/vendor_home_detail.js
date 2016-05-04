/// <reference path="~/Scripts/jquery-1.9.1.intellisense.js" />
/// <reference path="~/Scripts/kendo/2015.1.429/kendo.all-vsdoc.js" />
/// <reference path="~/Scripts/common.js" />
app.controller('vendor_homeDetailCtrl', function ($rootScope, $scope, $state, $location, $http, $timeout, $cordovaFileTransfer, $ionicLoading) {
    console.log('vendor_homeDetailCtrl');

    $scope.masterID = $state.params.id;
    $scope.vendorID = $state.params.venid;
    $scope.dataVehicle = [];
    $scope._dataHasDNVendor = [];
    $scope._dataHasDNVehicle = [];

    $scope.vehicleID = "";
    $scope.driverID = "";

    $scope.ItemSave = {};

    $scope.CheckAllLoad = function (stt, callback) {
        $scope.lstCheck[stt] = true;
        var rs = true;
        for (var i = 0; i < $scope.lstCheck.length; i++) {
            if ($scope.lstCheck[i] == false) {
                rs = false;
                break;
            }
        }
        if (rs)
            callback();
    }

    $scope.Init = function () {
        $ionicLoading.show();
        $scope.lstCheck = [false, false, false, false, false];
        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileVendor_MasterDetail",
            data: { id: $scope.masterID },
            success: function (res) {
                $scope.MasterItem = res;
                $scope.CheckAllLoad(0, function () { $scope.LoadEnd() });
            }
        });

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileVendor_ReasonList",
            data: {},
            success: function (res) {
                //$scope.CheckAllLoad(3, function () { $ionicLoading.hide(); $scope.$broadcast('scroll.refreshComplete'); });
                $scope.ReasonData = res;
                $scope.CheckAllLoad(1, function () { $scope.LoadEnd() });
            }
        });

        // Load danh sách Vendor
        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileVendor_ListVendor",
            data: {},
            success: function (res) {
                if (Common.HasValue(res)) {
                    $timeout(function () {
                        res.splice(0, 1);
                        $scope._dataHasDNVendor = res;
                        if ($scope._dataHasDNVendor.length > 0 && $scope._dataHasDNVehicle.length > 0)
                            $scope.LoadDataVehicleVendor();
                    }, 1);
                }
                $scope.CheckAllLoad(2, function () { $scope.LoadEnd() });
            }
        });

        // Load danh sách xe
        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileVendor_VehicleListVehicle",
            data: {},
            success: function (res) {
                if (Common.HasValue(res)) {
                    $timeout(function () {
                        $scope._dataHasDNVehicle = res;
                        $scope._dataVehicleVEN = res;
                        if ($scope._dataHasDNVendor.length > 0 && $scope._dataHasDNVehicle.length > 0)
                            $scope.LoadDataVehicleVendor();
                    }, 1);
                }

                $scope.CheckAllLoad(3, function () { $scope.LoadEnd() });
            }
        });

        // Load danh sách tài xế
        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileVendor_ListDriver",
            success: function (res) {
                Common.Services.Error(res, function (res) {
                    $scope._dataDriver = [];
                    $.each(res, function (i, v) {
                        $scope._dataDriver.push({ 'ID': v.ID, 'Text': v.LastName + ' ' + v.FirstName + ' (' + v.EmployeeCode + ')', 'DriverName': v.LastName + ' ' + v.FirstName, 'DriverTelNo': v.Cellphone });
                    });

                    $scope.CheckAllLoad(4, function () { $scope.LoadEnd() });
                });
            }
        });

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileVendor_MasterGet",
            data: { id: $scope.masterID },
            success: function (res) {
                $scope.ItemSave = res;
                $scope.CheckAllLoad(5, function () { $scope.LoadEnd() });
            }
        });
    }
    $scope.Init();

    $scope.LoadEnd = function () {
        $ionicLoading.hide(); $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.TenderAccept = function () {
        $scope.ItemSave.CreateVendorID = $scope.vendorID;
        $scope.ItemSave.TOMasterID = $scope.masterID;
        $scope.ItemSave.CreateDateTime = new Date();
        $rootScope.PopupConfirm({
            title: 'Bạn chắc chắn muốn chạy chuyến này?',
            okText: 'Chấp nhận',
            cancelText: 'Từ chối',
            ok: function () {
                $ionicLoading.show("Gửi duyệt...")
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileVendor_TenderSave",
                    data: {
                        item: $scope.ItemSave,
                    },
                    success: function (res) {
                        $ionicLoading.hide();
                        $state.go('vendor.home')
                    }
                })
            }
        });

    }

    $scope.TenderReject = function () {
        $rootScope.PopupConfirmInput({
            title: 'Chọn lý do từ chối',
            okText: 'Đồng ý',
            cancelText: 'Quay lại',
            scope: $scope,
            template: '<div style="margin-top:5px">Lý do từ chối</div><select style="width:100%;margin-bottom:8px;" ng-model="reasonID" ng-init="reasonID = ReasonData[0]==null? 0 :ReasonData[0]" ng-options="option.ReasonName for option in ReasonData"></select> <br/>Ghi chú<input type="text" ng-model="reasonNote"> ',
            ok: function (scope) {
                var rsid = scope.reasonID.ID;
                if (rsid > 0) {
                    $ionicLoading.show();
                    Common.Services.Call($http, {
                        url: Common.Services.url.MOBI,
                        method: "FLMMobileVendor_TenderReject",
                        data: {
                            id: $scope.masterID,
                            item: { ReasonID: rsid, Reason: scope.reasonNote }
                        },
                        success: function (res) {
                            $ionicLoading.hide();
                            $scope.LoadData();
                        }
                    })
                }
                else {
                    var confirmPopup = $ionicPopup.alert({
                        title: 'Lỗi',
                        template: "Chưa chọn lý do từ chối",
                    });
                }
            }
        });
    }

    $scope.LoadDataVehicleVendor = function () {
        var lstVendor = $scope._dataHasDNVendor;
        var lstVehicle = $scope._dataHasDNVehicle;
        $scope._dataHasDNVehicleVEN = [];
        $scope._dataHasDNVehicleHome = [];
        $.each(lstVehicle, function (idx, vehicle) {
            if (vehicle.RegNo != "[Chờ nhập xe]") {
                for (var i = 0; i < vehicle.lstVendorID.length; i++) {
                    var vendorid = vehicle.lstVendorID[i];
                    if (!Common.HasValue($scope._dataHasDNVehicleVEN[vendorid]))
                        $scope._dataHasDNVehicleVEN[vendorid] = [];
                    $scope._dataHasDNVehicleVEN[vendorid].push(vehicle);
                }
                if (vehicle.IsOwn) {
                    $scope._dataHasDNVehicleHome.push(vehicle);
                }
            } else {
                $scope._dataHasDNVehicleHome.push(vehicle);
                for (var i = 0; i < lstVendor.length; i++) {
                    var vendorid = lstVendor[i].ID;
                    if (!Common.HasValue($scope._dataHasDNVehicleVEN[vendorid]))
                        $scope._dataHasDNVehicleVEN[vendorid] = [];
                    $scope._dataHasDNVehicleVEN[vendorid].push(vehicle);
                }
            }
        });

        $scope.dataVehicle = $scope._dataHasDNVehicleVEN[$scope.vendorID];
    }
});