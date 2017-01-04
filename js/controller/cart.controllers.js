(function () {
    'use strict';
	
angular.module('pariapp')
.controller('cart', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading) {
	$scope.cCurrency=window.localStorage['cCurrency'];	
	/* Get current date */
		$scope.todaydate = utilites.toDayDate();
		$scope.isCoupon=0;
		$scope.discount=0;
		$scope.tax=0;
		$scope.shipping=0;
	
		/* if(Boolean(window.localStorage['cart'])){
			$scope.cartlist=JSON.parse(localStorage.getItem('cart'));
			//cart.push(JSON.stringify($scope.product));
			//localStorage.setItem('cart',JSON.stringify(cart));
			//console.log(cart);
		} */
		
		function loadcart(){
			$ionicLoading.show();
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
				console.log(response);
				$scope.cartlist=response;
				$scope.total=0;
				localStorage.setItem('cartarray',JSON.stringify($scope.cartlist));
				if($scope.isCoupon==1)
					$scope.promoapply();
				for(var i=0;i<response.length;i++){
					if($scope.todaydate <= response[i].dtSpecialPriceTo && $scope.todaydate >= response[i].dtSpecialPriceFrom){
						$scope.total+=response[i].nSpecialPrice * response[i].nQuantity;
						
					}else{
						$scope.total+=response[i].fPrice * response[i].nQuantity;
					}
					$scope.grandtotal=$scope.total - $scope.discount + $scope.tax + $scope.shipping;
					localStorage.setItem('grandtotal',$scope.grandtotal);
				}
				
				$ionicLoading.hide();
			}).error(function (data, status) {
				console.log(status);
				ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
				$ionicLoading.hide();
			})
		}
		$scope.$on("$ionicView.enter", function(event, data){
			loadcart();
		})
		
	
	
	//increase quantity of product
	$scope.incqty=function(nCartId,nProductId,qty){
		/* var cart = [];
		cart=JSON.parse(localStorage.getItem('cart'));
		cart[index].nQuantity=qty;
		localStorage.setItem('cart',JSON.stringify(cart)); */
		if(qty>0){
			$ionicLoading.show();
			$http({
			method: 'POST',
			url:$rootScope.path+'Cart.asmx/EditCart',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function (obj) {
				var str = [];
				for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
			data: {nCustomerId:window.localStorage['nCustomerId'],
				   nUserId:$rootScope.UserId,
				   nCartId:nCartId,
				   nProductId:nProductId,
				   dtCartDate:$scope.todaydate,
				   IsActive:true,
				   IsDisable:false,
				   cRemarks1:'',
				   cRemarks2:'',
				   cRemarks3:'',
				   nQuantity:qty,
				     cToken:$rootScope.Token
				  }
			}).success(function (response) {
				console.log(response);
				$ionicLoading.hide();
				loadcart();
			}).error(function (data, status) {
				console.log(status);
				ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
				$ionicLoading.hide();
			})
		}	
	}
	
	//delete product from cart
	$scope.deletefromcart=function(nCartId){
		//alert(nProductId);
		$ionicLoading.show();
		$http({
		method: 'POST',
		url:$rootScope.path+'Cart.asmx/DeleteCartRecord',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: {nCartId:nCartId,
			   nUserId:$rootScope.UserId,
			     cToken:$rootScope.Token
			  }
		}).success(function (response) {
			console.log(response);
			$ionicLoading.hide();
			localStorage.setItem('cartcount',+$scope.cartcount - 1);
			$scope.$parent.cartcount=+$scope.cartcount-1;
			
			loadcart();
			
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
	}
	
	
	$scope.promoapply=function(){
		//alert($scope.promoapply.promo);
		
		$ionicLoading.show();
		$http({
		method: 'POST',
		url:$rootScope.path+'offer.asmx/CheckCouponCode',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: {cCouponCode:$scope.promoapply.promo,
			   nCustomerId:window.localStorage['nCustomerId'],	
			   nUserId:$rootScope.UserId,
			   dtdate:$scope.todaydate,
			   cJsonCartData:JSON.stringify($scope.cartlist),
			    cToken:$rootScope.Token
			  }
		}).success(function (response) {
			//console.log(response);
			if(response[0].Success==0){
				$scope.promocodeerror=true;
				$scope.promoapply.promocode=true;
				$scope.promolink=false;
				$scope.promocodesuccess=false;
				$scope.message=response[0].Message;
				$scope.discount=0;
			}else{
				$scope.promoapply.promocode=false;
				$scope.promocodesuccess=true;
				$scope.promolink=true;
				$scope.promocodeerror=false;
				$scope.promocode=$scope.promoapply.promo;
				localStorage.setItem('procode',$scope.promoapply.promo);
				
				$scope.discount=Boolean(response[0].FixAmount)? response[0].FixAmount :response[0].PercentageAmount;
				//$scope.isCoupon=1;
				loadcart();
			}
			$ionicLoading.hide();
			
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})

		
	}
	$scope.removepromo=function(){
		$scope.promocodesuccess=false;
		$scope.promocode1=false;
		$scope.promolink=false;
		$scope.discount=0;
		//$scope.isCoupon=0
		localStorage.setItem('procode','');
		loadcart();
	}

})


}());	