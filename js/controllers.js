(function () {
    'use strict';
	
angular.module('pariapp')
.controller('menu', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading) {
	//console.log("Hello");
	$http({
		method: 'POST',
		url:$rootScope.path+'Login.asmx/UserInformation',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: {
			   nUserId:$rootScope.UserId,
			   cToken: $rootScope.Token
			  }
		}).success(function (response) {
			console.log(response[0]);
			$scope.cLogo=response[0].cLogo;
			localStorage.setItem('cStoreName',response[0].cStoreName);
			localStorage.setItem('cLogo',response[0].cLogo);
			localStorage.setItem('cCurrency',response[0].cCurrency);
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
		
		/* Cart count start */
		$http({
			method: 'POST',
			url:$rootScope.path+'Cart.asmx/SelectAllCartProductByCustomer',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function (obj) {
				var str = [];
				for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
			data: {nCustomerId:window.localStorage['nCustomerId'],
				   nUserId:$rootScope.UserId,
				     cToken:$rootScope.Token
				  }
			}).success(function (response) {
				console.log(response.length);
				if(response[0].Success!=0){
					localStorage.setItem('cartcount',response.length);
					$scope.cartcount=response.length;
				}else{
					localStorage.setItem('cartcount',0);
					$scope.cartcount=0;
				}
			})
			$scope.$on("$ionicView.enter", function(event, data){
			   // handle event
			   $scope.cartcount=window.localStorage['cartcount'];
			});
			
})

}());	