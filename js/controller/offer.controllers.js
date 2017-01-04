(function () {
    'use strict';
	
angular.module('pariapp')
.controller('offer', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading,$ionicModal) {
	
	$ionicLoading.show();
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
			$scope.offerlist=response;
			$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
		
		$ionicModal.fromTemplateUrl('templates/offerdetail.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			console.log(modal);
			$scope.offerdetail = modal;
		});
		
		/* Get offer detail start */
		$scope.viewofferdetail=function(nOfferId){
			//alert("Hello");
			$ionicLoading.show();
			$http({
				method: 'POST',
				url:$rootScope.path+'Offer.asmx/SelectRowForDetails',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
				data: {nOfferId:nOfferId,
					   nUserId:$rootScope.UserId,
					     cToken:$rootScope.Token
					  }
			}).success(function (response) {
				//console.log(response);
				$scope.data=response[0];
				$scope.offerdetail.show();
				$ionicLoading.hide();
			}).error(function (data, status) {
				console.log(status);
				ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
				$ionicLoading.hide();
			})
			
			$ionicModal.fromTemplateUrl('templates/offerdetail.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				console.log(modal);
				$scope.offerdetail = modal;
			});
		}
		/* Get offer detail end */
})


}());	