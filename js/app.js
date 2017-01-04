(function () {
    'use strict';
angular.module('pariapp', ['ionic', 'pariapp.services','ionic-ratings', 'tabSlideBox','ionic-toast','GoogleLoginService'])

.run(function($ionicPlatform,$rootScope,$ionicPopup,$state) {
	
  $rootScope.path="http://www.vitebiz.com/StoreAdmin/webservices/"; 
  $rootScope.imagepath="http://www.vitebiz.com/StoreAdmin/";  
  $rootScope.UserId=1124;
  $rootScope.Token='rbPCXgaW';
  $rootScope.connectionmsg='Something went wrong with your connection please try again';
  
  $ionicPlatform.ready(function() {
	window.plugins.nativepagetransitions.globalOptions.duration = 400;
	window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
	window.plugins.nativepagetransitions.globalOptions.androiddelay = 350;
	window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
	window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
	// these are used for slide left/right only currently
	window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
	window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  
    // Disable BACK button on home
  $ionicPlatform.registerBackButtonAction(function(event) {
	// alert($state.current.name); 
    if ($state.current.name=='app.home') { // your check here
      $ionicPopup.confirm({
        title: '',
        template: 'Are you sure you want to exit?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      })
    }
  }, 100);
  
})
/* .directive('salelist', function() {
  return {
    template: `<a href="#/saleview/{{sale.nPromotionId}}"><div class="salelist">
				<img src='{{imgpath}}{{sale.cPromotionHorizonralImage}}'></img>
				<div class="offer_tagline">
				<h5>{{sale.cPromotionName}}<span><img class="celender" src="img/calender.png"></img></span></h5>
				<p class="month">{{sale.dtPromotionEndDate | date:'MMM'}}</p><p class="date">{{sale.dtPromotionEndDate | date:'dd'}}</p>
				<p>{{sale.cRetailerName}} </p>
				</div>
				</div></a>`

  };
}) */

.filter('cartProduct', function() {
  return function(cart, nProductId) {
    for(var i=0; i<cart.length;i++){
		if(cart[i].nProductId==nProductId){
			//cart[i].nQuantity=cart[i].nQuantity+$scope.product.nQuantity;
			return i;
		}
	}
    return -1;
  }
})

.config(function($stateProvider, $urlRouterProvider) {

 // $ionicConfigProvider.tabs.position('bottom');
  $stateProvider

  // setup an abstract state for the tabs directive
   .state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'menu'
   })

  // Each tab has its own nav history stack:
	.state('login', {
        url: "/login",
		templateUrl: "templates/login.html",
		controller: 'login'
    })
	.state('sociallogin', {
        url: "/sociallogin/:type",
		templateUrl: "templates/sociallogin.html",
		controller: 'sociallogin'
    })
	
	.state('ForgotPassword', {
            url: "/ForgotPassword",
            templateUrl: "templates/ForgotPassword.html",
            controller: 'ForgotPassword'
    })
	.state('register', {
            url: "/register",
            templateUrl: "templates/register.html",
            controller: 'register'
    })
	.state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "templates/home.html",
                controller: 'home'
            }
        }
		
    })
	.state('app.categorylists', {
        url: "/categorylists/:intCategoryId/:strCategoryName",
        views: {
            'menuContent': {
                templateUrl: "templates/categorylists.html",
                controller: 'categorylists'
            }
        }
    })
	.state('app.productlist', {
        url: "/productlist/:intCategoryId/:strCategoryName",
        views: {
            'menuContent': {
                templateUrl: "templates/productlist.html",
                controller: 'productlist'
            }
        }
    })
	.state('productdetail', {
        url: "/productdetail/:nProductId/:cName",

		templateUrl: "templates/productdetail.html",
		controller: 'productdetail'
            
    })
	.state('app.myfavourite', {
        url: "/myfavourite",
        views: {
            'menuContent': {
                templateUrl: "templates/myfavourite.html",
                controller: 'myfavourite'
            }
        }
    })
	.state('app.offer', {
        url: "/offer",
        views: {
            'menuContent': {
                templateUrl: "templates/offer.html",
                controller: 'offer'
            }
        }
    })
	.state('app.search', {
        url: "/search",
		views: {
            'menuContent': {
				templateUrl: "templates/search.html",
				controller: 'search'
			}
		}
    })
	.state('app.searchresult', {
        url: "/searchresult/:keyword",
        views: {
            'menuContent': {
                templateUrl: "templates/searchresult.html",
                controller: 'searchresult'
            }
        }
    })
	
	.state('app.cart', {
        url: "/cart",
        views: {
            'menuContent': {
                templateUrl: "templates/cart.html",
                controller: 'cart'
            }
        }
    })
	.state('app.profile', {
        url: "/profile",
        views: {
            'menuContent': {
                templateUrl: "templates/profile.html",
                controller: 'profile'
            }
        }
    })
	.state('app.updateprofile', {
        url: "/updateprofile",
        views: {
            'menuContent': {
                templateUrl: "templates/updateprofile.html",
                controller: 'updateprofile'
            }
        }
    })
	.state('app.orderplace', {
        url: "/orderplace",
        views: {
            'menuContent': {
                templateUrl: "templates/orderplace.html",
                controller: 'orderplace'
            }
        }
    })
	.state('app.paymentmethod', {
        url: "/paymentmethod",
        views: {
            'menuContent': {
                templateUrl: "templates/paymentmethod.html",
                controller: 'paymentmethod'
            }
        }
    })
	.state('thankyoupage', {
        url: "/thankyoupage/:nOrderId",
        templateUrl: "templates/thankyoupage.html",
        controller: 'thankyoupage'
    })
	
	.state('app.orderlist', {
        url: "/orderlist",
        views: {
            'menuContent': {
                templateUrl: "templates/orderlist.html",
                controller: 'orderlist'
            }
        }
    })
	.state('app.orderdetail', {
        url: "/orderdetail/:nOrderId",
        views: {
            'menuContent': {
                templateUrl: "templates/orderdetail.html",
                controller: 'orderdetail'
            }
        }
    })
	
	
  // if none of the above states are matched, use this as the fallback
  //alert(window.localStorage['nCustomerId']);
  if(Boolean(window.localStorage['nCustomerId'])){
	  $urlRouterProvider.otherwise('/app/home');
  }else{
	  $urlRouterProvider.otherwise('/login');
  }	
})

}());