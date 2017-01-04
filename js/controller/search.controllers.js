(function () {
    'use strict';
	
angular.module('pariapp')
.controller('search', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading) {
	$scope.search=function(){
		if(Boolean($scope.search.keyword)){
			//alert($scope.search.keyword);
			window.location="#/app/searchresult/"+$scope.search.keyword;	
		}
	}
})
.controller('searchresult', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading,$stateParams) {
	console.log($stateParams.keyword);
	$ionicLoading.show();
	$http({
		method: 'POST',
		url:$rootScope.path+'Product.asmx/SelectSearchProduct',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: {cSearchString:$stateParams.keyword,		  
			   UserId:$rootScope.UserId,
			   cToken:$rootScope.Token
			  }
		}).success(function (response) {
			console.log(response);
			$scope.productlist=response;
			$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
})

}());	