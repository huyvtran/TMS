angular.module('myapp').factory('localDb', function ($http) {
	
	var localDb = function (){	
		
        //region truck

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

	    //endregion truck

	    //region driver_summary		
	    //endregion driver_summary
		
	} 
	
	return new localDb();
});