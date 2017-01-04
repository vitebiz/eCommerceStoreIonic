(function () {
    'use strict';
	
angular.module('pariapp')

/*.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
})*/

.controller('categorylists', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading,$ionicSlideBoxDelegate,$ionicPopup,$stateParams) {
    	
	$ionicLoading.show();
	$scope.strCategoryName=window.localStorage['strCategoryName'];
	$scope.gotonext=function(intCategoryId,strCategoryName){
		window.plugins.nativepagetransitions.slide({"href" : "#/app/categorylists/"+intCategoryId+"/"+strCategoryName});	
		//#/app/productlist/{{subcategory.intCategoryId}}/{{subcategory.strCategoryName}}
	}
	/* $scope.popup=function(){
		$ionicPopup.confirm({
			title: '',
			template: 'Are you sure you want to exit?'
		  }).then(function(res) {
			if (res) {
			  ionic.Platform.exitApp();
			}
		  })	
	} */
	$scope.search=function(){
		if(Boolean($scope.search.keyword)){
			//alert($scope.search.keyword);
			window.location="#/app/searchresult/"+$scope.search.keyword;	
		}
		}
	
	
	$ionicLoading.show();
	$scope.strCategoryName=$stateParams.strCategoryName;
	function callapi(){
	$http({
		method: 'POST',
		url:$rootScope.path+'Category.asmx/SelectAllSubCategoryCategoryWise',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: {
			CategoryId:$stateParams.intCategoryId,
			   UserId:$rootScope.UserId
				//cToken:$rootScope.Token
				
			  }
		}).success(function (response) {
			//console.log(response);
			$scope.categorylist=response;
			$ionicSlideBoxDelegate.update();
			$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
		}
	callapi();	
		
		
			
		$http({
			method: 'POST',
			url:$rootScope.path+'Offer.asmx/SelectRowCustomerWise',
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
			//console.log(response);
			var offer=response;
			if(response[0].Success!=0)
				$scope.count=offer.length;
			else
				$scope.count=0;
			//$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			//$ionicLoading.hide();
		})
		
})

}());	