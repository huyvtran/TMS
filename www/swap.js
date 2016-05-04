app.controller('swapCtrl', function ($rootScope, $scope, $state, $location, $http, $timeout, $ionicLoading) {
    console.log('swapCtrl');
    $rootScope.mainShowBack = false;
    $scope.dirverID = $rootScope.DriverID;
    $scope.cusID = $rootScope.CustomerID;

    var CountView = 0;
    if ($scope.dirverID > 0) CountView++;
    if ($scope.cusID > 0) CountView++;

    if (CountView == 1) {
        if ($scope.dirverID > 0) $state.go('main.truck');
        else $state.go('vendor.home');
    }
    else {
    }

    $scope.PickView = function (idx) {
        switch (idx) {
            case 1:
                $state.go('main.home', {}, { reload: true });
                break;
            default:
                $state.go('vendor.home');
                break;
        }
    }
});