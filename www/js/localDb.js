angular.module('myapp').factory('localDb', function ($http) {
	
    var localDb = function (){	
		
        //#region truck

        this.FLMMobileScheduleOpen_List =function(){
			
            var FLMMobileScheduleOpen_ListPromise = new Promise(function (resolve, reject) {		        
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileScheduleOpen_List",
                    data: {},
                    success: function (res) {resolve(res);}
                })
            });
			
            return FLMMobileScheduleOpen_ListPromise;	
        }
		
        this.FLMMobileScheduleAcceptList=function(){
			
            var FLMMobileScheduleAcceptListPromise = new Promise(function(resolve, reject){
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileScheduleAccept_List",
                    data: {},
                    success: function (res) {resolve(res);}
                })
            });
			
            return FLMMobileScheduleAcceptListPromise;
        }
		
        this.FLMMobileRejectList=function(){
			
            var FLMMobileRejectListPromise = new Promise(function(resolve, reject){
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileReject_List",
                    data: {},
                    success: function (res) {resolve(res);}
                })
            });
			
            return FLMMobileRejectListPromise;
        }
		
		
        this.FLMMobileScheduleGetList=function(){
			
            var FLMMobileScheduleGetListPromise = new Promise(function(resolve, reject){
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileScheduleGet_List",
                    data: {},
                    success: function (res) {resolve(res);}
                })
            });
			
            return FLMMobileScheduleGetListPromise ;
        }
		
        this.FLMMobileReasonList=function(){
			
            var FLMMobileReasonListPromise = new Promise(function(resolve, reject){
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileReason_List",
                    data: {},
                    success: function (res) {resolve(res);}
                })
            });
			
            return FLMMobileReasonListPromise ;
        }
		
        this.FLMMobileRomoocList=function(){
			
            var FLMMobileRomoocListPromise = new Promise(function (resolve, reject) {                
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobile_RomoocList",
                    data: {},
                    success: function (res) {resolve(res);}
                })
            });
			
            return FLMMobileRomoocListPromise ;
        }
		
        this.FLMMobileScheduleRunningList=function(){
			
            var FLMMobileScheduleRunningListPromise = new Promise(function(resolve, reject){
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileScheduleRunning_List",
                    data: {},
                    success: function (res) {resolve(res);}
                })
            });
			
            return FLMMobileScheduleRunningListPromise ;
        }

        this.FLMMobileDriverCOStationlist = function (masterID) {
            var FLMMobileDriverCOStationlistPromise = new Promise(function (resolve, reject) {
                debugger
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileDriver_COStationlist",
                    data: { masterID: masterID },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileDriverCOStationlistPromise;
        }

        this.FLMMobileDriverStationPass = function (masterID, stationID) {
            var FLMMobileDriverStationPassPromise = new Promise(function (resolve, reject) {
                debugger
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileDriver_StationPass",
                    data: {
                        masterID: masterID,
                        stationID: stationID,

                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
		        
            });
            return FLMMobileDriverStationPassPromise;
        }

        this.FLMMobileStatusSave = function (timesheetID, timedriverID, masterID, locationID, temp) {
            var FLMMobileStatusSavePromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileStatus_Save",
                    data: {
                        timesheetID: timesheetID,
                        timedriverID: timedriverID,
                        masterID: masterID,
                        locationID: locationID,
                        temp: temp
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileStatusSavePromise;
        }

        this.FLMMobileDriverCOStationPass = function (masterID, stationID) {
            var FLMMobileDriverCOStationPassPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileDriver_COStationPass",
                    data: {
                        masterID: masterID,
                        stationID: stationID,
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileDriverCOStationPassPromise;
        }


        this.FLMMobileStatusCOSave = function (timesheetID, masterID, locationID, romoocID) {
            var FLMMobileStatusCOSavePromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileStatus_COSave",
                    data: {
                        timesheetID: timesheetID,
                        masterID: masterID,
                        locationID:locationID,
                        romoocID: romoocID
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileStatusCOSavePromise;
        }

        this.FLMMobileMasterRun = function (id) {
            var FLMMobileMasterRunPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileMaster_Run",
                    data: {
                        timeID: id
                    },
                    success: function (res) {
                        resolve(res);
                    },
                    error: function (res) {
                        reject(res);
                    }
                })
            });
            return FLMMobileMasterRunPromise;
        }


        this.FLMMobileMasterReject = function (timedriverID, timesheetID, reasonID, reasonNote) {
            var FLMMobileMasterRejectPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileMaster_Reject",
                    data: {
                        timesheetID: timesheetID,
                        timedriverID: timedriverID,
                        reasonID: reasonID,
                        reasonNote:reasonNote
                    },
                    success: function (res) {
                        resolve(res);
                    },
                    error: function (res) {
                        reject(res);
                    }
                })
            });
            return FLMMobileMasterRejectPromise;
        }

        this.FLMMobileMasterAccept = function (timedriverID, timesheetID) {
            var FLMMobileMasterAcceptPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileMaster_Accept",
                    data: {
                        timedriverID: timedriverID,
                        timesheetID:timesheetID
                    },
                    success: function (res) {
                        resolve(res);
                    },
                    error: function (res) {
                        reject(res);
                    }
                })
            });
            return FLMMobileMasterAcceptPromise;
        }

        this.FLMMobileMasterReAccept = function (timesheetID) {
            var FLMMobileMasterReAcceptPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileMaster_ReAccept",
                    data: {
                        timesheetID: timesheetID
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileMasterReAcceptPromise;
        }

        //truck-detail
        this.FLMMobileSOList = function (masterID, locationID) {
            var FLMMobileSOListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobile_SOList",
                    data: {
                        masterID: masterID,
                        locationID: locationID
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileSOListPromise;
        }

        this.FLMMobileDriverFileList = function (id,code) {
            var FLMMobileDriverFileListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileDriver_FileList",
                    data: {
                        id: id,
                        code: code
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileDriverFileListPromise;
        }


        this.Reject = function (timeSheetDriverID) {
            var RejectPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "Reject",
                    data: {
                        timeSheetDriverID: timeSheetDriverID
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return RejectPromise;
        }

        this.MobileGOPReturnList = function (masterID, locationID) {
            var MobileGOPReturnListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "Mobile_GOPReturnList",
                    data: {
                        masterID: masterID,
                        locationID: locationID
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return MobileGOPReturnListPromise;
        }

        this.MobileDITOGroupProductList = function (masterID, locationID) {
            var MobileDITOGroupProductListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "Mobile_DITOGroupProductList",
                    data: {
                        masterID: masterID,
                        locationID: locationID
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return MobileDITOGroupProductListPromise;
        }

        this.MobileCUSGOPList = function (masterID) {
            var MobileCUSGOPListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "Mobile_CUSGOPList",
                    data: {
                        masterID: masterID,
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return MobileCUSGOPListPromise;
        }

        this.MobileCUSProductList = function (masterID) {
            var MobileCUSProductListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "Mobile_CUSProductList",
                    data: {
                        masterID: masterID,
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return MobileCUSProductListPromise;
        }

        this.MobileGOPReturnSave = function (item) {
            var MobileGOPReturnSavePromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "Mobile_GOPReturnSave",
                    data: {
                        item: item,
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return MobileGOPReturnSavePromise;
        }

        this.MobileGOPReturnEdit = function (id, quantity) {
            var MobileGOPReturnEditPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "Mobile_GOPReturnEdit",
                    data: {
                        id: id,
                        quantity:quantity
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return MobileGOPReturnEditPromise;
        }

        this.AppFileSave = function (item) {
            var AppFileSavePromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.SYS,
                    method: "App_FileSave",
                    data: {
                        item:item
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return AppFileSavePromise;
        }
        //end:truck-detail

        //Truck-double

        this.FLMMobileDriverTroubleList = function (masterID, isCO) {
            var FLMMobileDriverTroubleListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileDriver_TroubleList",
                    data: {
                        masterID: masterID,
                        isCO: isCO
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileDriverTroubleListPromise;
        }

        this.FLMMobileGroupTroubleList = function (isCO) {
            var FLMMobileGroupTroubleListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobile_GroupTroubleList",
                    data: {
                        isCO: isCO
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileGroupTroubleListPromise;
        }


        this.FLMMobileTroubleSave = function (item) {
            var FLMMobileTroubleSavePromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobile_TroubleSave",
                    data: {
                        item: item
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileTroubleSavePromise;
        }

        //truck station
        this.FLMMobileDriverStationPassed = function (masterID) {
            var strMethod = "FLMMobileDriver_StationPassed";
            if (masterID == "container")
                strMethod = "FLMMobileDriver_COStationPassed";
            var FLMMobileDriverStationPassedPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: strMethod,
                    data: {
                        masterID: masterID
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileDriverStationPassedPromise;
        }

        //#endregion truck	 

        //#region sumary
        this.FLMMobileDriverHistoryList = function (driverID, dtfrom, dtto) {
            var FLMMobileDriverHistoryListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileDriverHistory_List",
                    data: {
                        driverID: driverID,
                        dtfrom: dtfrom,
                        dtto: dtto
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileDriverHistoryListPromise;
        }


        this.FLMMobileDriverSalaryList = function (dtfrom, dtto) {
            var FLMMobileDriverSalaryListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileDriverSalary_List",
                    data: {
                        dtfrom: dtfrom,
                        dtto: dtto
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileDriverSalaryListPromise;
        }


        this.FLMMobileSummarySOList = function (timesheetID) {
            var FLMMobileSummarySOListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobile_SummarySOList",
                    data: {
                        timesheetID: timesheetID
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileSummarySOListPromise;
        }

        this.FLMMobileScheduleGet = function (timeSheetDriverID) {
            var FLMMobileScheduleGetPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileSchedule_Get",
                    data: {
                        timeSheetDriverID: timeSheetDriverID
                    },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileScheduleGetPromise;
        }

        //#problem
        this.FLMMobileDriverProblemTypeList = function () {
            var FLMMobileDriver_ProblemTypeListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileDriver_ProblemTypeList",
                    data: {},
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileDriver_ProblemTypeListPromise;
        }

        this.ProblemList = function () {
            var ProblemListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "ProblemList",
                    data: {},
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return ProblemListPromise;
        }

        this.FLMMobileDriverProblemSave = function (item) {
            var FLMMobileDriver_ProblemSavePromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobileDriver_ProblemSave",
                    data: {item: item},
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileDriver_ProblemSavePromise;
        }

        this.FLMMobileCOList = function (masterID) {
            var FLMMobileCOListPromise = new Promise(function (resolve, reject) {
                Common.Services.Call($http, {
                    url: Common.Services.url.MOBI,
                    method: "FLMMobile_COList",
                    data: { masterID: masterID },
                    success: function (res) {
                        resolve(res);
                    }
                })
            });
            return FLMMobileCOListPromise;
        }

        //#endregion sumary

        }
	
        return new localDb();
    });
