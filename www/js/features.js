var featuresV = '?v=0.1';
var featuresA = '';
var features = [];

features.push({ name: 'driver', url: '^/driver', templateUrl: featuresA + 'features/driver/index.html' + featuresV, controller: 'driverController', cache: false });
features.push({ name: 'driver.truck', url: '^/driver/truck', templateUrl: featuresA + 'features/driver/truck.html' + featuresV, controller: 'driver_truckController', cache: false });
features.push({ name: 'driver.truck_detail', url: '^/driver_truck_detail/{masterID}&{locationID}&{statusID}&{sheetDriverID}&{sheetID}', templateUrl: featuresA + 'features/driver/truck_detail.html' + featuresV, controller: 'driver_truckDetailController', cache: false });
features.push({ name: 'driver.truck_trouble', url: '^/driver_truck_trouble/:masterID', templateUrl: featuresA + 'features/driver/truck_trouble.html' + featuresV, controller: 'driver_trucktroubleController', cache: false });
features.push({ name: 'driver.info', url: '^/driver/driver_info', templateUrl: featuresA + 'features/driver/info.html' + featuresV, controller: 'driver_infoController', cache: false });
features.push({ name: 'driver.summary', url: '^/driver_summary', templateUrl: featuresA + 'features/driver/summary.html' + featuresV, controller: 'driver_summaryController', cache: false });
 
//features.push({ name: 'vendor', url: '^/vendor', templateUrl: featuresA + 'features/vendor/index.html' + featuresV, controller: 'vendorController', cache: false });
//features.push({ name: 'vendor.home', url: '^/vendor/home', templateUrl: featuresA + 'features/vendor/home.html' + featuresV, controller: 'vendor_homeController', cache: false });
//features.push({ name: 'vendor.home_detail', url: '^/vendor/detail/{id}&{venid}', templateUrl: featuresA + 'features/vendor/home_detail.html' + featuresV, controller: 'vendor_homeDetailController', cache: false });
//features.push({ name: 'vendor.home_acceptDetail', url: '^/vendor/accept/{id}', templateUrl: featuresA + 'features/vendor/home_acceptDetail.html' + featuresV, controller: 'vendor_homeAcceptDetailController', cache: false });
//features.push({ name: 'vendor.home_SODetail', url: '^/vendor/SO/{id}', templateUrl: featuresA + 'features/vendor/home_SODetail.html' + featuresV, controller: 'vendor_homeSODetailController', cache: false });
//features.push({ name: 'vendor.home_trouble', url: '^/vendor/trouble/{id}', templateUrl: featuresA + 'features/vendor/home_trouble.html' + featuresV, controller: 'vendor_homeTroubleController', cache: false });
//features.push({ name: 'vendor.info', url: '^/vendor/info', templateUrl: featuresA + 'features/vendor/info.html' + featuresV, controller: 'vendor_infoCtrl', cache: false });

//features.push({ name: 'manage', url: '^/manage', templateUrl: featuresA + 'features/manager/index.html' + featuresV, controller: 'manageController', cache: false });
//features.push({ name: 'manage.dashboard', url: '^/manage_dashboard', templateUrl: featuresA + 'features/manager/dashboard.html' + featuresV, controller: 'manage_dashboardController', cache: false });
