angular.module('myapp').controller('driver_containerDetailController', function ($rootScope, $scope, $state, $stateParams, $location, $http, $timeout, $ionicLoading, $ionicModal,localDb) {
    console.log('driver_containerDetailController');

    $scope.masterID = $stateParams.masterID;

    $scope.statusID = 1
    $scope.ShowReturnDetail = false;
    $scope.ShowBtnAdd = true;

    $scope.BtnAdd = function () {
        $scope.ShowBtnAdd = !$scope.ShowBtnAdd;
    }

    Common.RootObj.selectedTab = 2;
    $scope.SOList = [];
    $scope.FileList = [];
    $scope.Host = Common.Services.url.Host;


    $scope.LoadSO = function () {
        localDb.FLMMobileCOList($scope.masterID).then(function (res) {
            $ionicLoading.hide();
            $scope.SOList = res;
            angular.forEach($scope.SOList, function (o, i) {
                o.lstFile = [];
                var code = "copod";
                localDb.FLMMobileDriverFileList(o.ID, code).then(function (res) {
                    o.lstFile = res;
                })               
            })
        })      
    }
    $scope.LoadSO();

    // nav bar
    $scope.BackToTruck = function () {
        $state.go($rootScope.PreviousState, $rootScope.PreviousParam);
    }

    $scope.filesChanged = function (e) {
        $scope.fileUploads = e.files;
        var file = $scope.fileUploads;
        var fd = new FormData();
        fd.append('file', file[0]);
        $http.post(Common.Services.url.Host + "/api/Mobile/SaveImage", fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'auth': Common.Auth.HeaderKey
            }
        })
        .success(function (e) {
            e.ReferID = $scope.uploadItem.ID;
            e.TypeOfFileCode = 'COPOD';

            Common.Services.Call($http, {
                url: Common.Services.url.SYS,
                method: 'App_FileSave',
                data: { item: e },
                success: function (res) {
                    $rootScope.PopupAlert({
                        title: 'Thông báo',
                        template: 'Lưu thành công',
                        ok: function () { $scope.LoadSO(); }
                    })
                }
            });
        })
        .error(function () {
        });
    }

    $scope.BtnUpload = function (item) {
        $scope.uploadItem = item;
        $('#file').click();
    }

    $scope.takePicture = function () {
        navigator.camera.getPicture(function (imageURI) {
            
        }, function (err) {

            // Ruh-roh, something bad happened

        }, {
            quality: 75,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: false
        });
    }

    $scope.showImages = function (index, lst) {
        $scope.FileList = lst
        $scope.activeSlide = index;
        $scope.showModal('features/image-popover.html');
    }

    $scope.showModal = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    $scope.TempClick = function () {
        $scope.temp = $scope.CurrentTemperature;
        $rootScope.PopupConfirmInput({
            title: 'Thay đổi nhiệt độ hiện tại của xe',
            okText: 'Đồng ý',
            cancelText: 'Quay lại',
            scope: $scope,
            template: '<div style="margin-top:5px"><input type="number" class="input-temp" placeholder="Nhập nhiệt độ..." type="text" ng-model="temp"> ',
            ok: function (scope) {
                $scope.CurrentTemperature = scope.temp;
            }
        });
    }

    // Close the modal
    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal.remove()
    };
});