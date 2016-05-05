// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova', 'ngCookies', 'ui.chart'])

.run(function ($ionicPlatform) {
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
    });
})

.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}])

.config(function ($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.when("/", "/login");
    //$urlRouterProvider.otherwise("/login")

    $stateProvider
    .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'login.html',
        controller: 'loginCtrl'
    })
    $stateProvider
    .state('log', {
        url: '/log',
        cache: false,
        templateUrl: 'features/systemlog.html',
        controller: 'sytemlogCtrl'
    })
    .state('mapview', {
        url: '/mapview/{p0}&{p1}&{p2}&{p3}',
        cache: false,
        templateUrl: 'features/mapview.html',
        controller: 'mapviewCtrl'
    })
    .state('login.swap', {
        url: '/swap',
        cache: false,
        templateUrl: 'swap.html',
        controller: 'swapCtrl'
    })
    .state('vendor', {
        url: '/vendor',
        abstract: true,
        templateUrl: 'vendor.html'
    })
    .state('vendor.home', {
        url: '/home',
        cache: false,
        views: {
            'menuVendorContent': {
                templateUrl: 'features/vendor_home.html',
                controller: 'vendor_homeCtrl'
            }
        }
    })
    .state('vendor.home_detail', {
        url: '/home/{id}&{venid}',
        cache: false,
        views: {
            'menuVendorContent': {
                templateUrl: 'features/vendor_home_detail.html',
                controller: 'vendor_homeDetailCtrl'
            }
        }

    })
    .state('vendor.home_Acceptdetail', {
        url: '/home/{id}',
        cache: false,
        views: {
            'menuVendorContent': {
                templateUrl: 'features/vendor_home_AcceptDetail.html',
                controller: 'vendor_homeAcceptDetailCtrl'
            }
        }

    })
    .state('vendor.home_Trouble', {
        url: '/home/:masterID',
        cache: false,
        views: {
            'menuVendorContent': {
                templateUrl: 'features/vendor_homeTrouble.html',
                controller: 'vendor_homeTroubleCtrl'
            }
        }

    })
    .state('vendor.home_SODetail', {
        url: '/home/{masterID}&{locationID}&{statusID}',
        cache: false,
        views: {
            'menuVendorContent': {
                templateUrl: 'features/vendor_homeSODetail.html',
                controller: 'vendor_homeSODetail'
            }
        }

    })
    .state('vendor.info', {
        url: '/info',
        views: {
            'menuVendorContent': {
                templateUrl: 'features/vendor_info.html',
                controller: 'vendor_infoCtrl'
            }
        }
    })

    .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'main.html'
    })
    .state('main.home', {
        url: '/home',
        cache: false,
        views: {
            'menuDriverContent': {
                templateUrl: 'features/main_home.html',
                controller: 'main_homeCtrl'
            }
        }
    })
    .state('main.info', {
        url: '/info',
        cache: false,
        views: {
            'menuDriverContent': {
                templateUrl: 'features/main_info.html',
                controller: 'main_infoCtrl'
            }
        }
    })
    .state('main.sumary', {
        url: '/sumary',
        cache: false,
        views: {
            'menuDriverContent': {
                templateUrl: 'features/main_sumary.html',
                controller: 'main_sumaryCtrl'
            }
        }
    })
    .state('main.truck', {
        url: '/truck',
        cache: true,
        views: {
            'menuDriverContent': {
                templateUrl: 'features/main_truck.html',
                controller: 'main_truckCtrl'
            }
        }
    })
    .state('main.truck_detail', {
        url: '/truck/{masterID}&{locationID}&{statusID}&{sheetDriverID}&{sheetID}',
        views: {
            'menuDriverContent': {
                templateUrl: 'features/main_truckDetail.html',
                controller: 'main_truckDetailCtrl'
            }
        }

    })
    .state('main.truck_trouble', {
        url: '/truck/:masterID',
        views: {
            'menuDriverContent': {
                templateUrl: 'features/main_truckTrouble.html',
                controller: 'main_truckTroubleCtrl'
            }
        }
    })
})

.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);
})

.value('charting', {
    pieChartOptions: {
        seriesDefaults: {
            // Make this a pie chart.
            renderer: jQuery.jqplot.PieRenderer,
            rendererOptions: {
                // Put data labels on the pie slices.
                // By default, labels show the percentage of the slice.
                sliceMargin :1,
                shadowAlpha: 0,
                showDataLabels: true
            },
            color:['#515974']
        },
        animate: true,
        animateReplot: true,
        grid: { shadow: false, drawBorder: false, shadow: false },
        seriesColors: ['#4caf50', '#f5455a', '#03a9f4'],
        legend: { show: false, location: 's', border: '0px' }
    },
    donutOptions: {
        seriesDefaults: {
            renderer: jQuery.jqplot.DonutRenderer,
            rendererOptions: {
                // Pies and donuts can start at any arbitrary angle.
                startAngle: -90,
                // "totalLabel=true" uses the centre of the donut for the total amount
                totalLabel: true,
                shadowAlpha : 0
            },
            color: ['#515974']
        },
        animate: true,
        animateReplot: true,
        grid: { shadow: false, drawBorder: false, shadow: false },
        seriesColors: ['#03a9f4', 'orange', '#f5455a', '#4caf50'],
        legend: { show: false, location: 's', border: '0px' }
    }
})

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                });
            });
        }
    }
}]);

app.controller('defaultController', function ($rootScope, $scope, $http, $sce, $location, $state, $timeout, $window, $cookies, $ionicPopup, $ionicSideMenuDelegate) {
    Common.Log('defaultController');
    $rootScope.Logs = [];
    $rootScope.LogWrite = function (msg, iserror) {
        if (!Common.HasValue(iserror))
            iserror = false;
        $rootScope.Logs.push({ Msg: msg, IsError: iserror });
    };

    $rootScope.IsOnline = $window.navigator.onLine;

    $window.addEventListener('online', function () {
        $rootScope.IsOnline = true;
    }, true);
    $window.addEventListener('offline', function () {
        $rootScope.IsOnline = false;
    }, true);

    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }

    Common.Log('GetAuthorization');
    //$rootScope.DriverID = 0;
    //Common.Auth.HeaderKey = Common.Auth.GetHeaderKey($cookies);
    $state.go('login');

    $scope.Logout = function ($event) {
        $event.preventDefault();

        Common.Auth.Item = null;
        Common.Auth.HeaderKey = '';
        Common.Auth.SetHeaderKey('');
        $rootScope.Default_IsLogin = false;
        $state.go('login');
    }

    $rootScope.onDrag = function (e) {
        $ionicSideMenuDelegate.toggleLeft();
    }

    //variable 
    $rootScope.PullText = "Cập nhật dữ liệu";

    //message popup

    $rootScope.PopupConfirm = function (options) {
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
    }

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
    }

    $rootScope.PopupAlert = function (options) {
        var optOrg = {
            title: "",
            okText: "OK",
            template: '',
            ok: function () { },
        }
        var opt = {}; angular.extend(opt, optOrg, options);

        var alertPopup = $ionicPopup.alert({
            title: opt.title,
            template: opt.template,
        });

        alertPopup.then(function(res) {
            opt.ok();
        });
        return alertPopup
    }
     
});

