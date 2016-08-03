angular.module('myapp').factory('localDb', function ($http) {
	
	var localDb = function (){	
		
		this.FLMMobileScheduleOpen_List =function(){
			
			var FLMMobileScheduleOpen_ListPromise= new Promise(function(resolve, reject) {
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
			
			var FLMMobileRomoocListPromise = new Promise(function(resolve, reject){
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
		
	} 
	
	return new localDb();
});