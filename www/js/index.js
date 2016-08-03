var localDB = new PouchDB("dto_flmdriver_schedule_mobile");
var remoteDB = new PouchDB("http://localhost:8100/dto_flmdriver_schedule_mobile");

angular.module('myapp').run(['$ionicPlatform', function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
		localDB.sync(remoteDB, {live: true});
    });
}]);

angular.module('myapp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('main',{ url: '^/main', cache: false, templateUrl: 'features/main.html', controller: 'mainController' });
    $stateProvider.state('map', { url: '^/map/{p0}&{p1}&{p2}&{p3}', cache: false, templateUrl: 'features/map.html', controller: 'mapController' });
    $stateProvider.state('log', { url: '^/log', cache: false, templateUrl: 'features/log.html', controller: '' });
    angular.forEach(features, function (v, i) {
        $stateProvider.state(v.name, { url: v.url, cache: v.cache, templateUrl: v.templateUrl, controller: v.controller });
    });
}]);

angular.module('myapp').config(function ($ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
});

angular.module('myapp').directive('multiselect', ['$document', '$timeout', function ($document, $timeout) {

    return {
        restrict: 'E',
        require: '?ngModel',
        scope: {
            mThis: '=',
            mData: '=',
            mModel: '=',
            mCallBack: '&',
            mTextField: '@',
            mValueField: '@',
            mPlaceholder: '@',
        },
        templateUrl: 'tpl.html',
        replace: true,
        link: function (scope, element, attr) {

            scope.isPopupVisible = false;
            scope.Data = [];
            scope.DisplayText = "";


            scope.mThis.Text = function (text) {
                scope.DisplayText = text;
            }
            scope.mThis.Clear = function () {
                scope.DisplayText = "";
                scope.mModel = -1;
            }

            scope.toggleSelect = function () {
                scope.isPopupVisible = !scope.isPopupVisible;

                scope.Data = [];
                angular.forEach(scope.mData, function (o, i) {
                    scope.Data.push({ text: o[scope.mTextField], value: o[scope.mValueField] })
                })
            }

            scope.SelectItem = function (item) {
                scope.mModel = item.value;
                scope.DisplayText = item.text;
                scope.isPopupVisible = false;
                if (scope.mCallBack) {
                    $timeout(function () { scope.mCallBack(); }, 10)

                }
            }

            $document.bind('click', function (event) {
                var isClickedElementChildOfPopup = $(element).find(event.target).length > 0;

                if (isClickedElementChildOfPopup)
                    return;

                scope.isPopupVisible = false;
                scope.$apply();
            });
        }
    };
}]);

angular.module('myapp').value('charting', {
    pieChartOptions: {
        seriesDefaults: {
            // Make this a pie chart.
            renderer: jQuery.jqplot.PieRenderer,
            rendererOptions: {
                // Put data labels on the pie slices.
                // By default, labels show the percentage of the slice.
                sliceMargin: 1,
                shadowAlpha: 0,
                showDataLabels: true
            },
            color: ['#515974']
        },
        animate: true,
        animateReplot: true,
        grid: { shadow: false, drawBorder: false, shadow: false },
        seriesColors: ['#4caf50', '#f5455a', '#03a9f4'],
        legend: { show: true, location: 'e', border: '0px' }
    },
    donutOptions: {
        seriesDefaults: {
            renderer: jQuery.jqplot.DonutRenderer,
            rendererOptions: {
                // Pies and donuts can start at any arbitrary angle.
                startAngle: -90,
                // "totalLabel=true" uses the centre of the donut for the total amount
                totalLabel: true,
                shadowAlpha: 0
            },
            color: ['#515974']
        },
        animate: true,
        animateReplot: true,
        grid: { shadow: false, drawBorder: false, shadow: false },
        seriesColors: ['#03a9f4', 'orange', '#f5455a', '#4caf50'],
        legend: { show: true, location: 'e', border: '0px' }
    }
});


//#region Data
var _index = {
    URL: {
        GetAuthorization: 'App_GetAuthorization',
        ListFunctionMobile: 'App_ListFunctionMobile',
    }
};
//#endregion

angular.module('myapp').controller('indexController', function ($rootScope, $scope, $http, $sce, $location, $interval, $ionicLoading, $state, $timeout, $window, $ionicPopup, $ionicSideMenuDelegate) {
    $rootScope.Logs = [];
    Common.Log = function (msg) {
        $rootScope.Logs.push(msg);
    };

    Common.Log('indexController');
    Common.Auth.HeaderKey = location.href.substr(location.href.indexOf('?p=') + 3);
    Common.Log(Common.Auth.HeaderKey);
    $rootScope.MenuList = [
            { Href: 'log', Src: 'img/iaccount.png', Text: 'LOG' }
    ];
    try {
        var route = location.href.substr(location.href.indexOf('?d=') + 3, location.href.indexOf('?p=') - location.href.indexOf('?d=') - 3);
        if (route != "") {
            Common.Services.url.Host = 'http://' + route + '.' + Common.Services.url.domain;
            Common.Services.url.SYS = Common.Services.url.Host + Common.Services.url.SYS;
            Common.Services.url.MOBI = Common.Services.url.Host + Common.Services.url.MOBI;
        }
        else {
            Common.Services.url.Host = 'http://localhost:2743/';
            Common.Services.url.SYS = '/api/SYS/';
            Common.Services.url.MOBI = '/api/Mobile/';
        }
    }
    catch (e) {
        $ionicPopup.alert({ title: "", template: e });
    }
    Common.Services.Call($http, {
        url: Common.Services.url.SYS,
        method: _index.URL.GetAuthorization,
        data: {},
        success: function (res) {
            $ionicLoading.hide();
            Common.Auth.Item = res;
            Common.Log('Authorization: ' + Common.Auth.Item.UserID);
        }
    });

    Common.Services.Call($http, {
        url: Common.Services.url.SYS,
        method: _index.URL.ListFunctionMobile,
        data: {},
        success: function (res) {
            $ionicLoading.hide();
            if (res.length > 0) {
                var item = res[0];

                var useDriver = item.ListActionCode.indexOf('ViewDriver') >= 0;
                var useVendor = item.ListActionCode.indexOf('ViewVendor') >= 0;
                var useManager = item.ListActionCode.indexOf('ViewAdmin') >= 0;

                $rootScope.ViewTransfer = [
					{ Icon: '', Title: 'Tài xế', URL: 'driver', IsUsed: useDriver },
					{ Icon: '', Title: 'Vendor', URL: 'vendor', IsUsed: useVendor },
					{ Icon: '', Title: 'Quản lý', URL: 'manager', IsUsed: useManager }
                ];

                $state.go('map');
            }
        },
        error: function (res) {
            $ionicLoading.hide();
            Common.Log(res);
        }
    });

    $rootScope.ServerTime = { IsConnected: false, Date: null, Day: '', Month: '', Hour: '', Minute: '' };

    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };

    $rootScope.CurrentTemperature = null;
    //save state
    $rootScope.PreviousState = {};
    $rootScope.PreviousParam = {};
    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        
        $rootScope.PreviousState = from;
        $rootScope.PreviousParam = fromParams;
    });

    //#region alert popup

    $rootScope.PopupConfirm = function (options) {
        $ionicLoading.hide();
        var optOrg = {
            title: "",
            subTitle: "",
            okText: "OK",
            cancelText: "Cancel",
            template: '',
            ok: function () { },
            cancel: function () { },
        }
        var opt = {}; angular.extend(opt, optOrg, options);

        $ionicPopup.show({
            title: opt.title,
            subTitle: opt.subTitle,
            template: opt.template,
            scope: opt.scope,
            buttons: [
              {
                  text: opt.okText,
                  type: 'button-positive',
                  onTap: function (e) { return true; }
              },
              { text: opt.cancelText, onTap: function (e) { return false; } },
            ]
        }).then(function (res) {
            if (res) {
                opt.ok();
            }
            else {
                opt.cancel();
            }
        });
    };

    $rootScope.PopupConfirmInput = function (options) {
        var optOrg = {
            title: "",
            subTitle: "",
            okText: "OK",
            cancelText: "Cancel",
            template: '',
            scope: {},
            ok: function () { },
            cancel: function () { },
        }
        var opt = {}; angular.extend(opt, optOrg, options);

        $ionicPopup.show({
            title: opt.title,
            subTitle: opt.subTitle,
            template: opt.template,
            scope: opt.scope,
            buttons: [
              {
                  text: opt.okText,
                  type: 'button-positive',
                  onTap: function (e) { return { ok: true, scope: this }; }
              },
              { text: opt.cancelText, onTap: function (e) { return { ok: false, scope: this }; } },
            ]
        }).then(function (res) {
            if (res.ok) {
                opt.ok(res.scope.scope);
            }
            else {
                opt.cancel();
            }
        });
    };

    $rootScope.PopupAlert = function (options) {
        $ionicLoading.hide();
        var optOrg = {
            title: "Thông báo",
            okText: "OK",
            template: '',
            ok: function () { },
        }
        var opt = {}; angular.extend(opt, optOrg, options);

        var alertPopup = $ionicPopup.alert({
            title: opt.title,
            template: opt.template,
        });

        alertPopup.then(function (res) {
            opt.ok();
        });
        return alertPopup
    };

    //#endregion

    //record

    $rootScope.vehicleCode = "";
    $rootScope.IsRecordVehicle = false;
    var record;

    $rootScope.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
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
    //end

    // get gps

    $rootScope.GetCurrentPosition = function (success, error, opstions) {
        var timeoutVal = 10 * 1000 * 1000;
        if (opstions == null) {
            opstions = { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 };
        }
        navigator.geolocation.getCurrentPosition(
          success,
          error,
          opstions
        );
    }

    //backgroud geofence
    var objGF = {
        Lat: 0,
        Lng: 0,
        Radius: -1,
        IsEnter: false,
        Item: null,
        EnterParams:{},
        Enter: function () { },
    }

    $rootScope.GFInterval = null;
    $rootScope.ListGeofence = [];
    $rootScope.IndexOfList = {
        Station: null,
        COStation: null,
        LocationTo: null,
        LocationFrom: null,
        LocationGetRomooc: null,
        LocationReturnRomooc: null,
    };
    $rootScope.IsCallServer = false;
    $rootScope.IsCheckRouteProblem = false;
    $rootScope.AddGeofence = function (lst, index) {
        if (index == null) {
            index = $rootScope.ListGeofence.length;
        }
        $rootScope.ListGeofence[index] = lst;
        return index;
    }
    $rootScope.RemoveGeofence = function (index) {
        $rootScope.ListGeofence[index] = [];
    }

    $rootScope.UpdateLocation = function () {
        if ($rootScope.GFInterval != null)
            $interval.cancel($rootScope.GFInterval);
        var intervalGPSVehicle = 0;
        $rootScope.GFInterval = $interval(function () {
            $rootScope.GetCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                for (var i = 0; i < $rootScope.ListGeofence.length; i++) {
                    if (Common.HasValue($rootScope.ListGeofence[i]))
                        for (var j = 0; j < $rootScope.ListGeofence[i].length; j++) {
                            if (Common.HasValue($rootScope.ListGeofence[i][j]))
                                if ($rootScope.getDistanceFromLatLonInKm(lat, lng, $rootScope.ListGeofence[i][j].Lat, $rootScope.ListGeofence[i][j].Lng) <= $rootScope.ListGeofence[i][j].Radius) {
                                    $rootScope.ListGeofence[i][j].Enter($rootScope.ListGeofence[i][j].EnterParams);
                                }
                        }
                }
                //luu toa do xe
                intervalGPSVehicle += 5000;
                if ($rootScope.IsRecordVehicle && intervalGPSVehicle >= 60000) {
                    intervalGPSVehicle = 0;
                    if (Common.Services.url.Host != 'http://localhost:2743/') {
                        Common.Services.Call($http, {
                            url: Common.Services.url.MOBI,
                            method: "Extend_VehiclePosition_Add",
                            data: {
                                vehicleCode: $rootScope.vehicleCode,
                                lat: lat,
                                lng: lng
                            },
                            success: function (res) { }
                        });
                    }
                }
            }, function (e) { console.log(e) })

            //bao su co
            if ($rootScope.IsCheckRouteProblem) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "MessageCall",
                    data: {},
                    success: function (res) {
                        if (res.length > 0) {
                            var isBackgroundMode = false;
                            try {
                                isBackgroundMode = cordova.plugins.backgroundMode.isActive();
                            } catch (e) {
                                isBackgroundMode = false;
                            }
                            if (!isBackgroundMode) {
                                $rootScope.PopupConfirm({
                                    title: "Báo sự cố",
                                    template: res[0].Message,
                                    okText: "Xem chi thiết",
                                    cancelText: "Không xem",
                                    ok: function () {
                                        $state.go('driver.problem');
                                    },
                                    cancel: function () { },
                                })
                            }
                        }
                    }
                });
            }
        }, 5000)
    }

    $rootScope.UpdateLocation();

    document.addEventListener('deviceready', function () {
        console.log('ready to run backgroundMode');
        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.onactivate = function () {
            console.log('Tinh trang backgroundMode: ' + cordova.plugins.backgroundMode.isActive().toString());
            $rootScope.UpdateLocation();
        };
        cordova.plugins.backgroundMode.ondeactivate = function () {
            $rootScope.UpdateLocation();
            console.log('Tinh trang backgroundMode: '+ cordova.plugins.backgroundMode.isActive().toString());
            
        };

        cordova.plugins.notification.local.on("click", function (notification) {
            if (notification.id == 10) {
                $state.go('driver.truck');
            }
        });
    }, false);
});

