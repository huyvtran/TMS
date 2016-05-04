/// <reference path="~/Scripts/jquery-1.9.1.intellisense.js" />
/// <reference path="~/Scripts/kendo/2015.1.429/kendo.all-vsdoc.js" />
/// <reference path="~/Scripts/common.js" />
app.controller('main_homeCtrl', function ($rootScope, $scope, $state, $location, $http, $timeout, $cordovaFileTransfer, $ionicLoading, charting) {
    console.log('main_homeCtrl');
    //$ionicLoading.show();
    $scope.dfrom = new Date("3/30/2016");
    $scope.dto = new Date();
    $scope.fileUploads = [];
    $rootScope.DriverID = Common.Auth.Item.DriverID;

    $scope.upload = function () {
        var file = $scope.fileUploads;
        var files = $("#fileUpload").get(0).files;
        var fd = new FormData();
        debugger
        fd.append('model', $scope.uploadID);
        fd.append('file', files[0]);
        $http.post("/api/Mobile/SaveImage", fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'auth': Common.Auth.HeaderKey
            }
        })
        .success(function () {
        })
        .error(function () {
        });
    }
    $scope.uploadID = 0;
    $scope.filesChanged = function (e) {
        $scope.fileUploads = e.files;
        var file = $scope.fileUploads;
        var fd = new FormData();
        fd.append('model', $scope.uploadID);
        fd.append('file', file[0]);
        $http.post("/api/Mobile/SaveImage", fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'auth': Common.Auth.HeaderKey
            }
        })
        .success(function (e) {
            debugger
        })
        .error(function () {
        });
    }
    //Common.Services.Call($http, {
    //    url: Common.Services.url.MOBI,
    //    method: "PODDIInput_List",
    //    data: {
    //        dtFrom: $scope.dfrom,
    //        dtTo: $scope.dto,
    //    },
    //    success: function (res) {
    //        $ionicLoading.hide();
    //        $scope.lstPOD = res;
    //    }
    //})

    $scope.BtnUpload = function (id) {
        $scope.uploadID = id;
        $('#file').click();
    }

    //chart
    $scope.someData = [[
      ['Heavy Industry', 66], ['Retail', 15], ['Light Industry', 19]
    ]];

    $scope.myChartOpts = charting.pieChartOptions;
});