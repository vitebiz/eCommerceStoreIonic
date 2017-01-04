(function () {
    'use strict';
	
angular.module('pariapp')

.controller('orderplace', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading) {
		$scope.todaydate = utilites.toDayDate();
		$scope.placeorder={};
		
		$ionicLoading.show();
		$http({
		method: 'POST',
		url:$rootScope.path+'store.asmx/SelectAllStore',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: {UserId:$rootScope.UserId,
		      cToken:$rootScope.Token
			  }
		}).success(function (response) {
			//console.log(response);
			$scope.storelist=response;
			$ionicLoading.hide();
			
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})

		$scope.placeorder=function(){
			//console.log($scope.placeorder.choice);
			//console.log($scope.placeorder.store);
			if($scope.placeorder.choice=='delivery'){
				if(Boolean($scope.placeorder.cCustomerAddress) && Boolean($scope.placeorder.cCity) && Boolean($scope.placeorder.cZipCode)){
				var address=$scope.placeorder.cCustomerAddress+" "+$scope.placeorder.cCity+" "+$scope.placeorder.cZipCode;
				localStorage.setItem('address',address);
				localStorage.setItem('intStoreId','delivery');
				//ordertest(address);
				window.location="#/app/paymentmethod";
				}else{
					ionicToast.show('Fill all fields','middle', false, 2500);
				}
			}else{
				var address='Pick up';
				localStorage.setItem('intStoreId',$scope.placeorder.store);
				localStorage.setItem('address',address);
				//ordertest(address);
				window.location="#/app/paymentmethod";
			}
		
		}	
		
})

.controller('paymentmethod', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading){
		$scope.todaydate = utilites.toDayDate();
		$ionicLoading.show();
		$http({
		method: 'POST',
		url:$rootScope.path+'paymentmode.asmx/SelectAllPaymentMode',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: {UserId:$rootScope.UserId,
		  cToken:$rootScope.Token
			  }
		}).success(function (response) {
			//console.log(response);
			$scope.paymentlist=response.mstPaymentMode;
			$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
		
		$scope.placeorder=function(){
			//console.log($scope.placeorder.method);
			var promo=Boolean(window.localStorage['procode'])?window.localStorage['procode'] :'';
			
			 $ionicLoading.show();
				$http({
				method: 'POST',
				url:$rootScope.path+'order.asmx/CreateOrderWithJsonData',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
				data: {nSupplier:0,
					   nUserId:$rootScope.UserId,
					   nCustId:window.localStorage['nCustomerId'],
					   cQuatationType:'Admin Order',
					   fTotal:window.localStorage['grandtotal'],
					   cPaymentTerms:$scope.placeorder.method,
					   dtDelivaryDate:$scope.todaydate,
					   dtPaymentDueDate:$scope.todaydate,
					   dtValidityDate:$scope.todaydate,
					   cQuatationCode:'',
					   cQuatationTitle:'',
					   cCurrentStatus:'pending',
					   nEmpId:0,
					   cBranchAddress:window.localStorage['address'],
					   cRemarks:window.localStorage['intStoreId'],
					   cRemarks1:promo,
					   cJsonData:window.localStorage['cartarray'],
					     cToken:$rootScope.Token
					  }
				}).success(function (response) {
					console.log(response);
					if(response.Success==1){
						window.location="#/thankyoupage/"+response.ID;
					}else{
						ionicToast.show(response.Message,'middle', false, 2500);
					}
					$ionicLoading.hide();
					
				}).error(function (data, status) {
					console.log(status);
					ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
					$ionicLoading.hide();
				})
		}
})
.controller('thankyoupage', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading,$stateParams){
	$scope.nOrderId=$stateParams.nOrderId
	localStorage.setItem('cartcount',0);
	$scope.cartcount=0;
})

}());	