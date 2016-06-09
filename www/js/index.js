// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//var app = angular.module('starter', ['ionic', 'ngCordova', 'ngCookies', 'ui.chart', 'ionic-datepicker'])
angular.module('myapp').factory('signalRHubProxy', ['$rootScope', 'signalRServer', function ($rootScope, signalRServer) {
    function signalRHubProxyFactory(serverUrl, hubName, options) {        
        try{
        
            options = $.extend(true, {
                //start: { logging: true, transport: 'longPolling' },
                start: { logging: true },
                jsonp: true,
                done: null, //function
                fail: null, //function
            }, options);

            var connection = $.hubConnection(signalRServer);

            var proxy = connection.createHubProxy(hubName);
            connection.start(options.start).done(function () {
                if (options.done != null)
                    options.done();
            }).fail(function () {
                if (options.fail != null)
                    options.fail();
            });

            return {
                on: function (eventName, callback) {                    
                    proxy.on(eventName, function (result) {
                        Common.Log('SignalR on');
                        $rootScope.$apply(function () {
                            
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                off: function (eventName, callback) {
                    proxy.off(eventName, function (result) {
                        Common.Log('SignalR off');
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                invoke: function (methodName, callback) {
                    proxy.invoke(methodName)
                        .done(function (result) {
                            Common.Log('SignalR invoke');
                            $rootScope.$apply(function () {
                                if (callback) {
                                    callback(result);
                                }
                            });
                        });
                },
                connection: connection
            };

        }
        catch (ex) {
            Common.Log(ex);
        }
    };

    return signalRHubProxyFactory;
}]);

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
    });
}]);


angular.module('myapp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('main', { url: '^/main', cache: false, templateUrl: 'features/main.html', controller: 'mainController' });
    $stateProvider.state('map', { url: '^/map/{p0}&{p1}&{p2}&{p3}', cache: false, templateUrl: 'features/map.html', controller: 'mapController' });
	$stateProvider.state('log', { url: '^/log', cache: false, templateUrl: 'features/log.html', controller: '' });
    angular.forEach(features, function (v, i) {
        $stateProvider.state(v.name, { url: v.url, cache: v.cache, templateUrl: v.templateUrl, controller: v.controller });
    });
}]);

angular.module('myapp').value('charting', {
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
});

angular.module('myapp').value('charting', {
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
});

//#region Data
var _index = {
    URL: {
        GetAuthorization: 'App_GetAuthorization',
        ListFunctionMobile: 'App_ListFunctionMobile',
    }
};
//#endregion

angular.module('myapp').controller('indexController', function ($rootScope, $scope, $http, $sce, $location, $ionicLoading, $state, $timeout, $window, $ionicPopup, $ionicSideMenuDelegate, signalRHubProxy) {
    $rootScope.Logs = [];
	Common.Log = function(msg){
		$rootScope.Logs.push(msg);
	};
	
	Common.Log('indexController');
	Common.Auth.HeaderKey = location.href.substr(location.href.indexOf('?p=') + 3);
	Common.Log(Common.Auth.HeaderKey);
		$rootScope.MenuList = [
				{ Href: 'log', Src: 'img/iaccount.png', Text: 'LOG' }
			];
	
	$ionicLoading.show();
	
	Common.Services.Call($http, {
		url: Common.Services.url.SYS,
		method: _index.URL.GetAuthorization,
		data: { },
		success: function (res) {
			$ionicLoading.hide();
			Common.Auth.Item = res;
			Common.Log('Authorization: ' + Common.Auth.Item.UserID);
		},
		error: function (res) {					
			$ionicLoading.hide();
			Common.Log(res);
		}
	});
	
	Common.Services.Call($http, {
		url: Common.Services.url.SYS,
		method: _index.URL.ListFunctionMobile,
		data: { },
		success: function (res) {
			$ionicLoading.hide();
			if(res.length > 0){
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
	$timeout(function () {
	    try {
	        $rootScope.signalProxy = signalRHubProxy(signalRHubProxy.defaultServer, 'clientHub', {
	            done: function () {
	                Common.Log('done SignalR');
	            },
	            fail: function () {
	                Common.Log('fail SignalR');
	                $rootScope.ServerTime.IsConnected = false;
	            }
	        });

			//$rootScope.signalProxy.on('eventcommonworkflow', function (data) {
			//    Common.Log(data);
			//});
		}
		catch(ex){
			Common.Log(ex);
		}        
    }, 2);
	
	//$state.go('map');

    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };
    
    //#region alert popup

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
});

