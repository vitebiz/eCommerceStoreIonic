(function () {
    'use strict';

    angular.module('pariapp')


        .controller('productlist', function ($scope, $http, $location, $rootScope, utilites, ionicToast, $ionicLoading, $stateParams, $ionicModal) {

            $scope.search = function () {
                if (Boolean($scope.search.keyword)) {
                    //alert($scope.search.keyword);
                    window.location = "#/app/searchresult/" + $scope.search.keyword;
                }
            }

            $ionicModal.fromTemplateUrl('templates/filter.html', {
                scope: $scope,
                animation: 'slide-in-left'
            }).then(function (modal) {
                $scope.filter = modal;
            });

            $scope.gotonext = function (nProductId, cName) {
                window.plugins.nativepagetransitions.slide({"href": "#/productdetail/" + nProductId + "/" + cName});
            }

            $scope.cCurrency = window.localStorage['cCurrency'];
            var filtertemp = 0;
            $ionicLoading.show();
            $scope.strCategoryName = $stateParams.strCategoryName;
            function callapi() {
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/SelectAllProductByCategory',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nCustomerId: window.localStorage['nCustomerId'],
                        nCategoryId: $stateParams.intCategoryId,
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    $scope.productlist = response;
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
            }

            callapi();
            $scope.doRefresh = function () {
                if (filtertemp == 0)
                    callapi();
                else
                    $scope.applyfilter();
            }

            $scope.todaydate = utilites.toDayDate();

            $http({
                method: 'POST',
                url: $rootScope.path + 'Product.asmx/GetAttributevalue',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    UserId: $rootScope.UserId,
                    cToken: $rootScope.Token
                }
            }).success(function (response) {
                console.log(response);
                $scope.filterlist = response[0];

            }).error(function (data, status) {
                console.log(status);
                ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                $ionicLoading.hide();
            })

            /* Filter apply start */
            $scope.applyfilter = function () {
                $ionicLoading.show();
                /* Generate color string start */
                $scope.arrcolor = '';
                if (Boolean($scope.applyfilter.color)) {
                    var keys = Object.keys($scope.applyfilter.color);
                    for (var i = 0; i < keys.length; i++) {
                        if ($scope.applyfilter.color[keys[i]] == true)
                            $scope.arrcolor += i != 0 ? "," + keys[i] : keys[i];
                    }
                }
                /* Generate color string end */

                /* Generate size string start */
                $scope.arrsize = '';
                if (Boolean($scope.applyfilter.size)) {
                    var keys = Object.keys($scope.applyfilter.size);
                    for (var i = 0; i < keys.length; i++) {
                        if ($scope.applyfilter.size[keys[i]] == true)
                            $scope.arrsize += i != 0 ? "," + keys[i] : keys[i];
                    }
                }
                /* Generate size string end */
                filtertemp = 1;
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/FilterProduct',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        UserId: $rootScope.UserId,
                        nCategoryId: $stateParams.intCategoryId,
                        cColor: $scope.arrcolor,
                        cSize: $scope.arrsize,
                        fMRPFrom: document.getElementsByClassName("minvaluespan")[0].innerText,
                        fMRPTo: document.getElementsByClassName("maxvaluespan")[0].innerText,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    console.log(response);
                    $scope.productlist = response;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.filter.hide();
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
            }
            /* Filter apply end */

        })
        .controller('productdetail', function ($scope, $http, $location, $rootScope, utilites, ionicToast, $ionicLoading, $stateParams, $filter, $ionicModal, $ionicSlideBoxDelegate) {

            $ionicModal.fromTemplateUrl('templates/zoomimage.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function (modal) {
                $scope.zoomimage = modal;
            });
            $scope.zoom = function (url) {
                //console.log(url);
                $scope.zoomurl = url; //$scope.product.cImage;
                $scope.zoomimage.show();
            }
            $ionicLoading.show();
            $scope.cName = $stateParams.cName;
            function callapi() {
                $ionicLoading.show();
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/SelectProductAttributeValueForApp',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nProductId: $stateParams.nProductId,
                        cAttributeName: 'Color',
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                        // nCustomerId:window.localStorage['nCustomerId'],
                        // ProductId:$stateParams.nProductId,
                        // UserId:$rootScope.UserId,
                        // cToken:$rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    //$scope.product = response[0];
                    $scope.allproduct = response;
                    $scope.product.nQuantity = 1;
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                    $scope.ParentProductColor = response[0]['cValue'];
                    window.localStorage['ColorName'] = $scope.ParentProductColor;
                    console.log($scope.ParentProductColor);
                    BindSize();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })

                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/GetAllImage',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        ProductId: $stateParams.nProductId,

                        UserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                        // nCustomerId:window.localStorage['nCustomerId'],
                        // ProductId:$stateParams.nProductId,
                        // UserId:$rootScope.UserId,
                        // cToken:$rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    $scope.allproductimage = response;
                    console.log($scope.allproductimage);
                    $ionicSlideBoxDelegate.update();

                }).error(function (data, status) {
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })

                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/SelectAllChildProduct',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nCustomerId: window.localStorage['nCustomerId'],
                        ProductId: $stateParams.nProductId,
                        UserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    $scope.product = response[0];
                    //$scope.allproduct=response;
                    $scope.product.nQuantity = 1;
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
                BindSize();
            }

            $scope.doRefresh = function () {
                callapi();
                console.log('doRefresh');
            }
            $scope.$on('$ionicView.enter', function () {
                callapi();
            })
            function Bindprod(nProductId) {

                /*$http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/SelectProductAttributeValueForApp',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nProductId: nProductId,
                        cAttributeName: 'Color',
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                        // nCustomerId:window.localStorage['nCustomerId'],
                        // ProductId:$stateParams.nProductId,
                        // UserId:$rootScope.UserId,
                        // cToken:$rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    $scope.product = response[0];
                    $scope.product.nQuantity = 1;
                    console.log($scope.product);
                }).error(function (data, status) {
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })*/

                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/GetAllImage',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        ProductId: nProductId,
                        UserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                        // nCustomerId:window.localStorage['nCustomerId'],
                        // ProductId:$stateParams.nProductId,
                        // UserId:$rootScope.UserId,
                        // cToken:$rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    $scope.allproductimage = response;
                    console.log($scope.allproductimage);
                    $ionicSlideBoxDelegate.update();

                }).error(function (data, status) {

                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })

                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/SelectAllChildProduct',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nCustomerId: window.localStorage['nCustomerId'],
                        ProductId: nProductId,
                        UserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    $scope.product = response[0];
                    //$scope.allproduct=response;
                    $scope.product.nQuantity = 1;
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
            }

            $scope.changeproduct = function (nProductId) {
                $ionicLoading.show();
               /* $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/SelectProductAttributeValueForApp',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nProductId: nProductId,
                        cAttributeName: 'Color',
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                        // nCustomerId:window.localStorage['nCustomerId'],
                        // ProductId:$stateParams.nProductId,
                        // UserId:$rootScope.UserId,
                        // cToken:$rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    //$scope.product = response[0];
                    $scope.product.nQuantity = 1;
                   // console.log($scope.product);

                }).error(function (data, status) {
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })*/

                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/GetAllImage',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        ProductId: nProductId,

                        UserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                        // nCustomerId:window.localStorage['nCustomerId'],
                        // ProductId:$stateParams.nProductId,
                        // UserId:$rootScope.UserId,
                        // cToken:$rootScope.Token
                    }
                    }).success(function (response) {
                    //console.log(response);
                    $scope.allproductimage = response;
                    //console.log($scope.allproductimage);
                    $ionicSlideBoxDelegate.update();

                    $http({
                        method: 'POST',
                        url: $rootScope.path + 'Product.asmx/SelectAllChildProduct',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {
                            nCustomerId: window.localStorage['nCustomerId'],
                            ProductId: nProductId,
                            UserId: $rootScope.UserId,
                            cToken: $rootScope.Token
                        }
                    }).success(function (response) {
                        //console.log(response);
                        $scope.product = response[0];
                        //$scope.allproduct=response;
                        $scope.product.nQuantity = 1;
                        $scope.$broadcast('scroll.refreshComplete');
                        $ionicLoading.hide();
                    }).error(function (data, status) {
                        console.log(status);
                        ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                        $ionicLoading.hide();
                    })

                }).error(function (data, status) {

                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
            }

            /* Get current date */
            $scope.todaydate = utilites.toDayDate();

            /* Add product to cart start*/
            $scope.addtocart = function () {
                $ionicLoading.show();
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Cart.asmx/CreateCart',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nCustomerId: window.localStorage['nCustomerId'],
                        nProductId: $scope.product.nProductId,
                        nUserId: $rootScope.UserId,
                        dtCartDate: $scope.todaydate,
                        IsActive: true,
                        IsDisable: false,
                        cRemarks1: '',
                        cRemarks2: '',
                        cRemarks3: '',
                        nQuantity: $scope.product.nQuantity,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    console.log(response);
                    localStorage.setItem('cartcount', +$scope.cartcount + 1);
                    $scope.cartcount = +$scope.cartcount + 1;
                    ionicToast.show('Product added to cart successfully', 'middle', false, 2500);
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })


                /* if(Boolean(window.localStorage['cart'])){
                 //if any product already in cart then push another product
                 var cart = [];
                 cart=JSON.parse(localStorage.getItem('cart'));

                 //if product already in cart then it only add quantity
                 var found = $filter('cartProduct')(cart, $scope.product.nProductId);
                 if(found >= 0){
                 cart[found].nQuantity=cart[found].nQuantity+$scope.product.nQuantity;
                 }else{
                 cart.push(($scope.product));
                 }
                 localStorage.setItem('cart',JSON.stringify(cart));

                 }else{
                 //If no any product in localStorage cart object
                 var cart = [];
                 cart[0]=($scope.product);
                 localStorage.setItem('cart',JSON.stringify(cart));
                 }
                 window.location="#/app/cart"; */
            }
            /* Add product to cart end*/

            /* Product add to favourite start */
            $scope.addtowishlist = function () {
                $ionicLoading.show();
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'WishList.asmx/InsertUserData',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nCustomerId: window.localStorage['nCustomerId'],
                        nProductId: $stateParams.nProductId,
                        cWishList: '',
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    console.log(response);
                    ionicToast.show('WishList added successfully', 'middle', false, 2500);
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
            }
            /* Product add to favourite end */

            /* Share product start */
            $scope.share = function () {
                window.plugins.socialsharing.share($scope.product.cName + ' ' + $scope.product.cShortDescription, null, $rootScope.imagepath + $scope.product.cImage, null);
            }
            $scope.$on('$ionicView.enter', function () {
                $scope.cartcount = window.localStorage['cartcount'];
            })


            //Get Product Size By Product Color


            $scope.GetProductSize = function (cValue, nGetSizeProductId, index) {
                $ionicLoading.show();
                //$scope.GetProduct(nGetSizeProductId,0);
                $scope.colorful = index;
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/GetSizeForApp',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    data: {
                        nProductId: $stateParams.nProductId,
                        cValue: cValue,
                        cAttributeName: 'Size',
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                    },
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    }
                }).success(function (response) {
                    var success = response;
                    Bindprod(nGetSizeProductId);
                    if (success != 0) {
                        $scope.SizeDiv = true;
                        $scope.ProductSizeDetail = response;
                        //Bindprod($scope.ProductSizeDetail[0]['nProductId']);
                        //changeproduct($scope.ProductSizeDetail[0]['nProductId']);
                        //console.log($scope.ProductSizeDetail[0]['nProductId']);

                    }
                });
            }


            //END

            //For Product Size
            function BindSize() {

                var cValue = window.localStorage['ColorName'];
                //alert(cValue);
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/GetSizeForApp',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    data: {

                        nProductId: $stateParams.nProductId,
                        cValue: cValue,
                        cAttributeName: 'Size',
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                    },
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    }

                }).success(function (response) {

                    var success = response;

                    if (success != 0) {

                        $scope.SizeDiv = true;
                        $scope.ProductSizeDetail = response;

                        console.log($scope.ProductSizeDetail[0]['cSize']);

                    }

                });
            }


            //END


        })


        .controller('myfavourite', function ($scope, $http, $location, $rootScope, utilites, ionicToast, $ionicLoading) {
            $scope.$on('$ionicView.enter', function () {
                loaddata();
            })
            $scope.todaydate = utilites.toDayDate();
            $scope.gotonext = function (nProductId, cName) {
                window.plugins.nativepagetransitions.slide({"href": "#/productdetail/" + nProductId + "/" + cName});
            }
            function loaddata() {
                $ionicLoading.show();
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'WishList.asmx/SelectProductDetailByCustomer',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nCustomerId: window.localStorage['nCustomerId'],
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    $scope.productlist = response;
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
            }

            //loaddata();
            $scope.doRefresh = function () {
                loaddata();
                console.log('doRefresh');
            }
            /* Remove product from wishlist start */

            $scope.rmovefromwishlist = function (nProductId) {
                $ionicLoading.show();
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'WishList.asmx/DeleteRowByCustomerIdandProductId',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nCustomerId: window.localStorage['nCustomerId'],
                        nProductId: nProductId,
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    loaddata()
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
            }

            /* Remove product from wishlist end */
        })

        .controller('category', function ($scope, $http, $location, $rootScope, utilites, ionicToast, $ionicLoading, $stateParams, $ionicModal) {
            $ionicModal.fromTemplateUrl('templates/filter.html', {
                scope: $scope,
                animation: 'slide-in-left'
            }).then(function (modal) {
                $scope.filter = modal;
            });

            $scope.gotonext = function (intCategoryId, strCategoryName) {
                window.plugins.nativepagetransitions.slide({"href": "#/app/productlist/" + intCategoryId + "/" + strCategoryName});
            }

            $scope.cCurrency = window.localStorage['cCurrency'];
            var filtertemp = 0;
            $ionicLoading.show();
            $scope.strCategoryName = $stateParams.strCategoryName;
            function callapi() {
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/SelectAllProductByCategory',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        nCustomerId: window.localStorage['nCustomerId'],
                        nCategoryId: $stateParams.intCategoryId,
                        nUserId: $rootScope.UserId,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    //console.log(response);
                    $scope.productlist = response;
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
            }

            callapi();
            $scope.doRefresh = function () {
                if (filtertemp == 0)
                    callapi();
                else
                    $scope.applyfilter();
            }

            $scope.todaydate = utilites.toDayDate();

            $http({
                method: 'POST',
                url: $rootScope.path + 'Product.asmx/GetAttributevalue',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    UserId: $rootScope.UserId,
                    cToken: $rootScope.Token
                }
            }).success(function (response) {
                console.log(response);
                $scope.filterlist = response[0];

            }).error(function (data, status) {
                console.log(status);
                ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                $ionicLoading.hide();
            })

            /* Filter apply start */
            $scope.applyfilter = function () {
                $ionicLoading.show();
                /* Generate color string start */
                $scope.arrcolor = '';
                if (Boolean($scope.applyfilter.color)) {
                    var keys = Object.keys($scope.applyfilter.color);
                    for (var i = 0; i < keys.length; i++) {
                        if ($scope.applyfilter.color[keys[i]] == true)
                            $scope.arrcolor += i != 0 ? "," + keys[i] : keys[i];
                    }
                }
                /* Generate color string end */

                /* Generate size string start */
                $scope.arrsize = '';
                if (Boolean($scope.applyfilter.size)) {
                    var keys = Object.keys($scope.applyfilter.size);
                    for (var i = 0; i < keys.length; i++) {
                        if ($scope.applyfilter.size[keys[i]] == true)
                            $scope.arrsize += i != 0 ? "," + keys[i] : keys[i];
                    }
                }
                /* Generate size string end */
                filtertemp = 1;
                $http({
                    method: 'POST',
                    url: $rootScope.path + 'Product.asmx/FilterProduct',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {
                        UserId: $rootScope.UserId,
                        nCategoryId: $stateParams.intCategoryId,
                        cColor: $scope.arrcolor,
                        cSize: $scope.arrsize,
                        fMRPFrom: document.getElementsByClassName("minvaluespan")[0].innerText,
                        fMRPTo: document.getElementsByClassName("maxvaluespan")[0].innerText,
                        cToken: $rootScope.Token
                    }
                }).success(function (response) {
                    console.log(response);
                    $scope.productlist = response;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.filter.hide();
                    $ionicLoading.hide();
                }).error(function (data, status) {
                    console.log(status);
                    ionicToast.show($rootScope.connectionmsg, 'middle', true, 2500);
                    $ionicLoading.hide();
                })
            }
            /* Filter apply end */

        })
}());	