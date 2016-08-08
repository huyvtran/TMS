angular.module('myapp').controller('driver_truckDetailController', function ($rootScope, $scope, $state, $stateParams, $location, $http, $timeout, $ionicLoading, $ionicModal, localDb) {
    console.log('driver_truckDetailController');

    $scope.masterID = $stateParams.masterID;
    $scope.locationID = $stateParams.locationID;
    $scope.sheetDriverID = $stateParams.sheetDriverID;
    $scope.sheetID = $stateParams.sheetID;
    $scope.statusID = 1
    $scope.selectedTab = 1
    $scope.ShowReturnDetail = false;
    $scope.GOPItem = {};
    $scope.ShowBtnAdd = true;
    $scope.SOAddressCombobox = {};
    $scope.GOPCombobox = {};
    $scope.ProductCombobox = {};

    $scope.BtnAdd = function () {
        $scope.ShowBtnAdd = !$scope.ShowBtnAdd;
    }

    $scope.StatusObj = {
        Close: 221,
        Plan: 222,
        Come: 223,
        LoadStart: 224,
        LoadEnd: 225,
        Leave:226
    }

    if ($stateParams.statusID == 0) {
        $scope.statusID = 1;
    }
    else if ($stateParams.statusID == 1) {
        $scope.statusID = 2;
    }
    else if ($stateParams.statusID == 2) {
        $scope.statusID = 3;
    }
    else if ($stateParams.statusID == 3) {
        $scope.statusID = 4;
    }
    else {
        $scope.statusID = 5;
    }

    Common.RootObj.selectedTab = 2;
    $scope.SOList = [];
    $scope.FileList = [];
    $scope.Host = Common.Services.url.Host;


    $scope.LoadSO = function () {

        localDb.FLMMobileSOList($scope.masterID, $scope.locationID).then(function (res) {
            $ionicLoading.hide();
            $scope.SOList = res;
            angular.forEach($scope.SOList, function (o, i) {
                o.lstFile = [];
                localDb.FLMMobileDriverFileList(o.ID, "dipod").then(function (res) {
                    o.lstFile = res;
                })              
            })

        }) 
    }
    $scope.LoadSO();

    $scope.Reject = function () {
        localDb.Reject($scope.timeSheetDriverID).then(function (res) {
            $state.go('main.truck');
        })
    }

    $scope.LocationComplete = function () {
        if ($scope.statusID == 1) {
            $scope.temp = $rootScope.CurrentTemperature;
            var str = "Xác nhận đến điểm";
            if ($scope.temp != null) {
                str = 'Nhập nhiệt độ xe';
            }
            $rootScope.PopupConfirmInput({
                title: str,
                okText: 'Đồng ý',
                cancelText: 'Quay lại',
                scope: $scope,
                template: '<div style="margin-top:5px" ng-show="temp!=null"><input type="number" class="input-temp" placeholder="Nhập nhiệt độ..." type="text" ng-model="temp"> ',
                ok: function (scope) {
                    $rootScope.CurrentTemperature = scope.temp;
                    $ionicLoading.show();
                    localDb.FLMMobileStatusSave($scope.sheetID, $scope.sheetDriverID, $scope.masterID, $scope.locationID, $scope.CurrentTemperature).then(function (res) {
                        $scope.statusID++;
                        if ($scope.statusID > 4) {
                            $state.go('driver.truck');
                        }
                        $ionicLoading.hide();
                    })            
                }
            });
        }
        else if ($scope.statusID <= 4)
            $rootScope.PopupConfirm({
            title: 'Xác nhận rời khỏi điểm này?',
            okText: 'Chấp nhận',
            cancelText: 'Từ chối',
            ok: function () {
                $ionicLoading.show();

                localDb.FLMMobileStatusSave($scope.sheetID, $scope.sheetDriverID, $scope.masterID, $scope.locationID, 0).then(function (res) {
                    $scope.statusID++;
                    if ($scope.statusID > 4) {
                        $state.go('driver.truck');
                    }
                    $ionicLoading.hide();
                })

                //Common.Services.Call($http, {
                //    url: Common.Services.url.MOBI,
                //    method: "FLMMobileStatus_Save",
                //    data: { timesheetID: $scope.sheetID, timedriverID: $scope.sheetDriverID, masterID: $scope.masterID, locationID: $scope.locationID },
                //    success: function (res) {
                //        $scope.statusID++;
                //        if ($scope.statusID > 4) {
                //            $state.go('driver.truck');
                //        }
                //        $ionicLoading.hide();
                //    }
                //})


            }
        });
    }

    $scope.SwicthTab = function (i) {
        $scope.selectedTab = i;
    }

    // nav bar
    $scope.BackToTruck = function () {
        $state.go($rootScope.PreviousState, $rootScope.PreviousParam);
    }

    //#region GOPreturn

    $scope.ReloadProduct = function () {
        $scope.ProductCombobox.Clear();
        $scope.GOPItem.ProductID = 0;
        $scope.ProductReturnList = [];
        angular.forEach($scope.ProductReturnData, function (o, i) {
            if (o.GroupOfProductID == $scope.GOPItem.GroupProductID)
                $scope.ProductReturnList.push(o);
        })
    }

    $scope.LoadGOPReturn = function () {

        $ionicLoading.show();
        localDb.MobileGOPReturnList($scope.masterID, $scope.locationID).then(function (res) {
            $scope.ReturnList = res;
        })

        localDb.MobileDITOGroupProductList($scope.masterID, $scope.locationID).then(function (res) {
            if (res.length > 0) {
                $scope.SOAddressList = res;
            }
            else {
                $scope.NoReturn = true;
            }
        })

        localDb.MobileCUSGOPList($scope.masterID).then(function (res) {
            if (res.length > 0) {
                $scope.GOPReturnList = res;
            }
            else {
                $scope.NoReturn = true;
            }
        })

        localDb.MobileCUSGOPList($scope.masterID).then(function (res) {
            $ionicLoading.hide();
            if (res.length > 0) {
                $scope.ProductReturnData = res;
                $scope.ReloadProduct();
            }
            else {
                $scope.NoReturn = true;
            }
        })

    }
    $scope.LoadGOPReturn();

    $scope.GOPReturn_Save = function () {
        if ($scope.GOPItem.OrderGroupID > 0 && $scope.GOPItem.GroupProductID > 0 && $scope.GOPItem.ProductID > 0 && $scope.GOPItem.Quantity > 0) {
            $scope.GOPItem.MasterID = $scope.masterID;
            $rootScope.PopupConfirm({
                title: 'Xác nhận lưu ?',
                okText: 'Chấp nhận',
                cancelText: 'Từ chối',
                ok: function () {
                    $ionicLoading.show();
                    localDb.MobileGOPReturnSave($scope.GOPItem).then(function (res) {
                        $ionicLoading.hide();
                        $scope.ShowReturnDetail = false;
                        $scope.LoadGOPReturn();
                        $scope.SOAddressCombobox.Clear();
                        $scope.GOPCombobox.Clear();
                        $scope.ProductCombobox.Clear();
                    })
             
                }
            });
        }
        else {
            $rootScope.PopupAlert({
                title: "Chưa điền đủ thông tin",
                okText: "OK",
                template: '',
                ok: function () {
                },
            })
        }
        
    };

    $scope.ReturnAdd = function () {
        if ($scope.NoReturn) {
            $rootScope.PopupAlert({
                title: "Không có hàng trả về",
                okText: "OK",
                template: '',
                ok: function () {
                },
            })
        }
        else {
            $scope.GOPItem.OrderGroupID = 0;
            $scope.GOPItem.GroupProductID = 0;
            $scope.GOPItem.ProductID = 0;
            $scope.GOPItem.Quantity = '';
            $scope.ShowReturnDetail = true;
        }
    };

    $scope.GOPReturnCancel = function () {
        $scope.ShowReturnDetail = false;
        $scope.SOAddressCombobox.Clear();
        $scope.GOPCombobox.Clear();
        $scope.ProductCombobox.Clear();
    }

    $scope.GOPReturnEdit = function (item) {
        $scope.ReturnQuantity = item.Quantity;
        $rootScope.PopupConfirmInput({
            title: 'Điều chỉnh số lượng',
            okText: 'Đồng ý',
            cancelText: 'Quay lại',
            scope: $scope,
            template: '<input class="cus-textbox" type="number" ng-model="ReturnQuantity" />',
            ok: function (scope) {
                var num = scope.ReturnQuantity;
                if (num > 0) {
                    $ionicLoading.show();
                    localDb.MobileGOPReturnEdit(item.ID, num).then(function (res) {
                        $ionicLoading.hide();
                        $scope.LoadGOPReturn();
                    })

                    //Common.Services.Call($http, {
                    //    url: Common.Services.url.MOBI,
                    //    method: "Mobile_GOPReturnEdit",
                    //    data: {
                    //        id: item.ID,
                    //        quantity: num
                    //    },
                    //    success: function (res) {
                    //        $ionicLoading.hide();
                    //        $scope.LoadGOPReturn();
                    //    }
                    //})
                }
            }
        });
    }

    //#endregion

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
            e.TypeOfFileCode = 'DIPOD';

            localDb.AppFileSave(e).then(function (res) {
                $rootScope.PopupAlert({
                    title: 'Thông báo',
                    template: 'Lưu thành công',
                    ok: function () { $scope.LoadSO(); }
                })
            })
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