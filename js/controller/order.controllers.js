(function () {
    'use strict';
	
angular.module('pariapp')
.controller('orderlist', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading) {
	$scope.cCurrency=window.localStorage['cCurrency'];	
	$scope.gotonext=function(nOrderId){
		window.plugins.nativepagetransitions.slide({"href" : "#/app/orderdetail/"+nOrderId});
	}
	$ionicLoading.show();
	function callapi(){
		$http({
		method: 'POST',
		url:$rootScope.path+'order.asmx/SelectOrderCustomerwise',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: {CustomerId:window.localStorage['nCustomerId'],
			   UserId:$rootScope.UserId,
			   cType:'Admin Order',
			    cToken:$rootScope.Token
			  }
		}).success(function (response) {
			console.log(response);
			$scope.orderlist=response;
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
	}
	callapi();	
		$scope.doRefresh=function(){
			callapi();
			console.log('doRefresh');
			
		}
		

})
.controller('orderdetail', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading,$stateParams) {
		$scope.cCurrency=window.localStorage['cCurrency'];	
		$ionicLoading.show();
		$scope.subtotal=0;
		function callapi(){
			$http({
			method: 'POST',
			url:$rootScope.path+'order.asmx/SelectRowOrder',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function (obj) {
				var str = [];
				for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
			data: {OrderId:$stateParams.nOrderId,
				   UserId:$rootScope.UserId,
				    cToken:$rootScope.Token
				  }
			}).success(function (response) {
				console.log(response);
				$scope.orderdetail=response[0];
				var item=response[0].Item[0];
				for(var i=0;i<item.length;i++){
					$scope.subtotal+=item[i].fProductPrice * item[i].fQuantity;
				}
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.hide();
			}).error(function (data, status) {
				console.log(status);
				ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
				$ionicLoading.hide();
			})
		}
		callapi();	
		$scope.doRefresh=function(){
			callapi();
			console.log('doRefresh');
			
		}
})


}());	