app.controller('loginCtrl', function ($rootScope, $scope, $state, $location, $http, $timeout, $ionicLoading) {
    console.log('loginCtrl');
    $rootScope.mainShowBack = false;

    $scope.modelUsername = '';
    $scope.modelPassword = '';
    $rootScope.DriverItem = {};
    $rootScope.DriverID = 0;

    //$state.go('vendor.home');
    $scope.eventLogin = function ($event) {
        $event.preventDefault();
        $ionicLoading.show({template: 'Loading...'});
        Common.Services.Call($http, {
            url: Common.Services.url.SYS,
            method: "App_Login",
            data: { username: this.login_Username, password: this.login_Password, devicetype: 1 },
            success: function (res) {
                $ionicLoading.hide();
                if (Common.HasValue(res) && res.UserID > 0) {
                    Common.Auth.Item = res;
                    Common.Auth.HeaderKey = res.HeaderKey;
                    if (res.StringError == "") {
                        $rootScope.DriverID = res.DriverID;
                        $rootScope.DriverName = res.DriverName;
                        $rootScope.CustomerID = res.CustomerID;
                        $state.go('login.swap');
                    } else {
                        $scope.ErrorStr = res.StringError;
                    }
                    
                }
                else {
                    $scope.ErrorStr="Sai tài khoản hoặc mật khẩu!"
                }
            }
        });
    }
});