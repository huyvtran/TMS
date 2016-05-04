/// <reference path="~/m/common.js" />
app.controller('main_truckCtrl', function ($rootScope, $scope, $state, $location, $http, $timeout, $ionicLoading, $ionicPopup, $ionicSideMenuDelegate, openMap, $interval) {
    $rootScope.LogWrite("main_truckCtrl")
    $ionicSideMenuDelegate.canDragContent(false)

    $scope.MainData = [];
    $scope.TimeSheet = [];
    $scope.lstCheck = [];
    $scope.reasonID = 0;
    $scope.ShowMap = 1;
    $scope.IsReceiveFull = false;
    $scope.selectedTab = 1;
    $scope.StatusObj = {
        Close: 221,
        Plan: 222,
        Come: 223,
        LoadStart: 224,
        LoadEnd: 225,
        Leave: 226
    };
    $scope.ProblemItem = {};

    $scope.curLat = 0;
    $scope.curLng = 0;
    $scope.curMinDistance = -1;
    $scope.curMinLocation = null;
    $scope.curDelayTime = -1;
    $scope.lstDistance = [];

    var interval;

    if (Common.RootObj.selectedTab==2) {
        $scope.selectedTab = 2;
    }
   
    $rootScope.DriverID = Common.Auth.Item.DriverID;
    $rootScope.DirverItem = Common.Auth.Item;
    $rootScope.Host = Common.Services.url.Host;

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
    
    Date.prototype.addDays = function (days) {
        this.setDate(this.getDate() + parseInt(days));
        return this;
    };

    Date.prototype.addHours = function (h) {
        this.setTime(this.getTime() + (h * 60 * 60 * 1000));
        return this;
    }
    
    $scope.LoadData = function () {
        $ionicLoading.show();
        $scope.lstCheck = [false, false, false, false, false, false, false];

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileScheduleOpen_List",
            data: {
                driverID: $rootScope.DriverID,
            },
            success: function (res) {
                $scope.OpenTimeSheet = res;
                $scope.CheckAllLoad(0, function () { $scope.LoadEnd() });
            }
        })

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileScheduleAccept_List",
            data: {
                driverID: $rootScope.DriverID,
            },
            success: function (res) {
                $scope.AcceptTimeSheet = res;
                $scope.CheckAllLoad(1, function () { $scope.LoadEnd() });
            }
        })

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileReject_List",
            data: {},
            success: function (res) {
                $scope.RejectTimeSheet = res;
                $scope.CheckAllLoad(2, function () { $scope.LoadEnd() });
            }
        })

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileScheduleGet_List",
            data: { driverID: $rootScope.DriverID, },
            success: function (res) {
                $scope.GetTimeSheet = res;
                $scope.CheckAllLoad(3, function () { $scope.LoadEnd() });
            }
        })

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileReason_List",
            data: { },
            success: function (res) {
                $scope.ReasonData = res;
                $scope.CheckAllLoad(4, function () { $scope.LoadEnd() });
            }
        })

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileDriver_ProblemTypeList",
            data: {},
            success: function (res) {
                $scope.ProblemTypeData = res;
                $scope.CheckAllLoad(6, function () { $scope.LoadEnd() });
            }
        })

        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileScheduleRunning_List",
            data: { driverID: $rootScope.DriverID,},
            success: function (res) {
                $scope.RunningData = res;
                if (res.length > 0) {

                    $scope.IsReceiveFull = true;
                    angular.forEach(res[0].lstLocationFrom, function (o, i) {
                        if (o.IsLeave == false)
                            $scope.IsReceiveFull = false;
                    })
                }
                $scope.CheckAllLoad(5, function () { $scope.LoadEnd() });
            }
        })
    }
    $scope.LoadData();

    $scope.LoadEnd = function () {
        $ionicLoading.hide(); $scope.$broadcast('scroll.refreshComplete');
        if ($scope.RunningData.length == 0) {
            $scope.IsRunning = false;
            $scope.tabRunTitle = "Đã nhận";
            if ($scope.AcceptTimeSheet.length == 0) {
                $scope.ViewAccepted = 1;// empty
            }
            else if ($scope.AcceptTimeSheet.length == 1) {
                $scope.ViewAccepted = 2;// master detail
                $scope.AcceptedItem = $scope.AcceptTimeSheet[0];
            }
            else {
                $scope.ViewAccepted = 3; // list accepted
            }
        }
        else {
            $scope.ViewAccepted = 2;
            $scope.AcceptedItem = $scope.RunningData[0];
            $scope.IsRunning = true;
            $scope.tabRunTitle="Đang chạy"
        }
        $timeout(function () {
            $scope.LoadDataMap();
        }, 100)
    }

    $scope.RunMaster = function (id) {
        if(!$scope.IsRunning)
            $rootScope.PopupConfirm({
            title: 'Bạn chắc chắn muốn chạy chuyến này?',
            okText: 'Chấp nhận',
            cancelText: 'Từ chối',
            ok: function () {
                $ionicLoading.show();
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileMaster_Run",
                    data: { timeID: id, driverID: $rootScope.DriverID },
                    success: function (res) {
                        if (res == "") {
                            $scope.LoadData();
                        }
                        else {
                            $ionicLoading.hide();
                            var confirmPopup = $ionicPopup.alert({
                                title: 'Lỗi',
                                template: res,
                            });
                        }
                    }
                })
            }
        });
    }

    $scope.RejectMaster = function (timedriverID,timesheetID) {
        $rootScope.PopupConfirmInput({
            title: 'Chọn lý do từ chối',
            okText: 'Đồng ý',
            cancelText: 'Quay lại',
            scope:$scope,
            template: '<div style="margin-top:5px">Lý do từ chối</div><select style="width:100%;margin-bottom:8px;" ng-model="reasonID" ng-init="reasonID = ReasonData[0]==null? 0 :ReasonData[0]" ng-options="option.ReasonName for option in ReasonData"></select> <br/>Ghi chú<input type="text" ng-model="reasonNote"> ',
            ok: function (scope) {
                var rsid = scope.reasonID.ID;
                if (rsid > 0) {
                    $ionicLoading.show();
                    Common.Services.Call($http, {
                        url: Common.Services.url.MOBI,
                        method: "FLMMobileMaster_Reject",
                        data: { timesheetID: timesheetID, timedriverID: timedriverID, reasonID: rsid, reasonNote: scope.reasonNote },
                        success: function (res) {
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

    $scope.AcceptMaster = function (timedriverID, timesheetID) {
        $rootScope.PopupConfirm({
            title: 'Bạn chắc chắn muốn chạy chuyến này?',
            okText: 'Chấp nhận',
            cancelText: 'Từ chối',
            ok: function () {
                $ionicLoading.show();
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileMaster_Accept",
                    data: { timesheetID: timesheetID, timedriverID: timedriverID },
                    success: function (res) {
                        $scope.LoadData();
                    }
                })
            }
        });

    }

    $scope.ReAcceptMaster = function (timesheetID) {
        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobileMaster_ReAccept",
            data: { timesheetID: timesheetID, driverID: $rootScope.DriverID },
            success: function (res) {
                $scope.LoadData();
            }
        })
    }

    $scope.LocationComplete = function (timedriverID, timesheetID, masterID, locationID, statusID) {
        var statusType = $scope.TranslateStatus(statusID);
        var strTitle = $scope.GetTitleStatus(statusID);
        $rootScope.PopupConfirm({
            title: strTitle,
            okText: 'Chấp nhận',
            cancelText: 'Từ chối',
            ok: function () {
                $ionicLoading.show();
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileStatus_Save",
                    data: { timesheetID: timesheetID, timedriverID: timedriverID, masterID: masterID, locationID: locationID, statusID: statusType },
                    success: function (res) {
                        $scope.LoadData();
                    }
                })
            },
            cancel: function () {
                $interval.cancel(interval);
            }
        });
    }

    $scope.ShowSOList = function (masterID, locationID, statusID, timedriverID, timesheetID) {
        if ($scope.IsRunning == true)
            $state.go('main.truck_detail', { masterID: masterID, locationID: locationID, statusID: statusID, sheetDriverID: timedriverID, sheetID: timesheetID })
    }

    $scope.AddTrouble = function () {
        $state.go('main.truck_trouble', { masterID: $scope.AcceptedItem .TOMasterID})
    }

    $scope.CloseMap = function () {
        $scope.ShowMap = 1;
    }

    $scope.ShowMapRoute = function () {
        $state.go('mapview', {p0:0,p1:$scope.AcceptedItem.TOMasterID})
        //$scope.ShowMap = 2;
        //navigator.geolocation.getCurrentPosition(function (position) {
        //    var icon = openMap.mapStyle.Icon("img/icon_route.png", 1);
        //    $rootScope.LogWrite(position.coords.latitude + " - " + position.coords.longitude);
        //    $scope.Marker.push(openMap.Marker(position.coords.latitude, position.coords.longitude, "", icon, {}));
        //});

        //Common.Services.Call($http, {
        //    url: Common.Services.url.MOBI,
        //    method: "FLMMobileDriver_ProblemList",
        //    data: {},
        //    success: function (res) {
        //        $scope.ProblemMarker = [];
        //        angular.forEach(res, function (o) {
        //            var icon = openMap.mapStyle.Icon("img/iclose.png", 1);
        //            if (Common.HasValue(o.Lat) && Common.HasValue(o.Lng)) {
        //                $scope.ProblemMarker.push(openMap.Marker(o.Lat, o.Lng, "", icon, o));
        //            }
        //        })
        //    }
        //})
    }

    $scope.ReportProblem = function () {
        if ($scope.ShowMap != 3) {
            $scope.ShowMap = 3;
        }
        else {
            $scope.ShowMap = 1;
        }
    }

    $scope.ProblemSave = function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            var item = {};
            var now = new Date();
            item.Lat = position.coords.latitude;
            item.Lng = position.coords.longitude;
            item.DateStart = now;
            item.DateEnd = now.addHours(2);
            item.TypeOfRouteProblemID = $scope.ProblemItem.TypeOfRouteProblemID;
            item.DriverID = $rootScope.DriverID;
            item.VehicleID = $scope.AcceptedItem.VehicleID;
            Common.Services.Call($http, {
                url: Common.Services.url.MOBI,
                method: "FLMMobileDriver_ProblemSave",
                data: { item: item },
                success: function (res) {
                    $scope.ShowMap = 1;
                }
            })
        });
    }

    $scope.TranslateStatus = function (DITOStatusID) {
        if (DITOStatusID < $scope.StatusObj.Come) {
            return  1;
        }
        else if (DITOStatusID == $scope.StatusObj.Come) {
            return  2;
        }
        else if (DITOStatusID == $scope.StatusObj.LoadStart) {
            return  3;
        }
        else if (DITOStatusID == $scope.StatusObj.LoadEnd) {
            return 4;
        }
        else {
            return 5;
        }
    }

    $scope.GetTitleStatus = function (DITOStatusID) {
        if (DITOStatusID < $scope.StatusObj.Come) {
            return 'Xác nhận đã đến nơi';
        }
        else if (DITOStatusID == $scope.StatusObj.Come) {
            return 'Xác nhận bắt đầu bốc xếp hàng hóa';
        }
        else if (DITOStatusID == $scope.StatusObj.LoadStart) {
            return 'Xác nhận hoàn tất bốc xếp';
        }
        else if (DITOStatusID == $scope.StatusObj.LoadEnd) {
            return 'Xác nhận rời khỏi điểm này';
        }
        else {
            return "";
        }
    }
    //map

    $scope.CreateMap = function () {
        Common.Log("CreateMap");

        Common.Log(openMap.hasMap);

        openMap.Create({
            Element: 'map',
            Tooltip_Show: false,
            InfoWin_Show: false,
            ClickMarker: null,
            ClickMap: null,
            mcallback: function (e) {
                $rootScope.LogWrite(e);
            }
        });

    }

    $scope.CreateMap();
    
    $scope.LoadDataMap = function () {
        Common.Services.Call($http, {
            url: Common.Services.url.MOBI,
            method: "FLMMobile_ListLocationOfCurrentMaster",
            data: { driverID: $rootScope.DriverID },
            success: function (res) {
                $ionicLoading.hide();
                $scope.ListLocationFrom = res.lstLocationFrom;
                $scope.ListLocationTo = res.lstLocationTo;
                $scope.$broadcast('scroll.refreshComplete');

                $scope.DrawMarker();
                $scope.ReloadMap();
                if ($scope.IsRunning)
                {
                    $scope.updateDistance();
                }
            }
        });
    }

    $scope.ReloadMap = function () {
        $scope.DrawRoute();
    }

    $scope.DrawMarker = function () {
        $scope.Marker = [];
        angular.forEach($scope.ListLocationFrom, function (o) {
            var icon = openMap.mapStyle.Icon("img/marker_blue.png", 1);
            if (Common.HasValue(o.Lat) && Common.HasValue(o.Lng)) {
                $scope.Marker.push(openMap.Marker(o.Lat, o.Lng, o.LocationName, icon, o));
            }
        })
        angular.forEach($scope.ListLocationTo, function (o) {
            var icon = openMap.mapStyle.Icon("img/marker_pink.png", 1);
            if (Common.HasValue(o.Lat) && Common.HasValue(o.Lng)) {
                $scope.Marker.push(openMap.Marker(o.Lat, o.Lng, o.LocationName, icon, o));
            }
        })
        openMap.FitBound($scope.Marker);
    }

    $scope.DrawRoute = function () {
        openMap.Close(); //Hide info window
        openMap.ClearRoute(); //Clear route data, make them invisible from map
        openMap.SetVisible(null, false); //set all vectorlayers invisible from map
        for (var i = 0; i < $scope.Marker.length - 1; i++) {
            var pStart = $scope.Marker[i];
            var pEnd = $scope.Marker[i + 1];
            if (Common.HasValue(pStart) && Common.HasValue(pEnd)) {
                openMap.SetVisible([pStart, pEnd], true);
                var style = openMap.mapStyle.Route(6, 'rgba(3,169,244, 0.7)');
                openMap.Route("", pStart, pEnd, style);
            }
        }
    }

    //geo
    $scope.ttest = 0;
    $scope.$watch("curDelayTime", function () {
        $interval.cancel(interval);
        if ($scope.curDelayTime > 0) {
            interval = $interval(function () {
                $scope.GeoFencing();
            }, $scope.curDelayTime);
        }
    });

    $scope.GeoFencing = function () {

        $scope.updateDistance();

        if ($scope.curMinDistance > 0 && $scope.curMinDistance < 0.1 && $scope.curMinLocation != null) {
            $interval.cancel(interval);
            $scope.LocationComplete($scope.AcceptedItem.TimeSheetDriverID, $scope.AcceptedItem.TimeSheetID, $scope.AcceptedItem.TOMasterID, $scope.curMinLocation.LocationID, $scope.curMinLocation.DITOLocationStatusID)
        }
    }

    $scope.GetTimeLoop = function (distance) {
        if (distance < 0) {
            return 1000;
        }
        else if (distance < 1) {
            return 1000;
        }
        else if (distance < 5) {
            return 5000;
        }
        else if (distance < 100) {
            return 10000;
        }
        else
            return 11000;
    }

    $scope.updateDistance = function (callback) {
        //Status = 1:Come ; 2:LoadStart ; 3:LoadEnd ; 4:Leave
        navigator.geolocation.getCurrentPosition(function (position) {
            $scope.curLat = position.coords.latitude;
            $scope.curLng = position.coords.longitude;

            $scope.lstDistance = [];
            $scope.curMinDistance = -1;
            $scope.curMinLocation = null;
            angular.forEach($scope.ListLocationFrom, function (o, i) {
                if (o.Status == 0) {

                    o.DistanceRemain = $scope.getDistanceFromLatLonInKm($scope.curLat, $scope.curLng, o.Lat, o.Lng);
                    $scope.lstDistance.push(o);
                    if ($scope.curMinDistance < 0 || o.DistanceRemain < $scope.curMinDistance) {
                        $scope.curMinDistance = o.DistanceRemain;
                        $scope.curMinLocation = o;
                    }
                }
            })
            angular.forEach($scope.ListLocationTo, function (o, i) {
                if (o.Status == 0 && $scope.IsReceiveFull) {

                    o.DistanceRemain = $scope.getDistanceFromLatLonInKm($scope.curLat, $scope.curLng, o.Lat, o.Lng);
                    $scope.lstDistance.push(o);
                    if ($scope.curMinDistance < 0 || o.DistanceRemain < $scope.curMinDistance) {
                        $scope.curMinDistance = o.DistanceRemain;
                        $scope.curMinLocation = o;
                    }
                }
            })
            // delay dua tren diem gan nhat
            if ($scope.curMinDistance >= 0 && $scope.curDelayTime != $scope.GetTimeLoop($scope.curMinDistance)) {
                $scope.curDelayTime = $scope.GetTimeLoop($scope.curMinDistance);
            }

        });
    }

    $scope.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = $scope.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = $scope.deg2rad(lon2 - lon1);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos($scope.deg2rad(lat1)) * Math.cos($scope.deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    $scope.deg2rad = function (deg) {
        return deg * (Math.PI / 180)
    }
});