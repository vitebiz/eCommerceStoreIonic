(function () {
    'use strict';
	
angular.module('pariapp')

.controller('login', function ($scope, $http,$location,$rootScope,$ionicLoading,utilites,ionicToast,googleLogin) {
	
	/*window.localStorage['UserId']=4;
	window.localStorage['path']="http://www.vite.biz/ecp/webservices/";
	window.localStorage['imgpath']="http://www.vite.biz/ecp/";
	
	var path = window.localStorage['path'];
	var UserId = window.localStorage['UserId'];
	
	$scope.imgpath = window.localStorage['imgpath'];*/
	if(Boolean(window.localStorage['nCustomerId'])){
		window.location="#/app/home";
	}
	
	/*var UserLogo = path+"Login.asmx/UserInformation?nUserId="+UserId+"&cToken="+Token;
	$http.get(UserLogo).then(function (respUser) {
	
		$scope.Logo= respUser.data[0].cLogo;
		$scope.cStoreName= respUser.data[0].cStoreName;
		$scope.cCurrency= respUser.data[0].cCurrency;
	    window.localStorage['StoreName']=$scope.cStoreName;
		window.localStorage['store'] = JSON.stringify(respUser.data[0]);
		$ionicLoading.hide();
		
	}, function (err) {
		console.error('ERR', err);
		$ionicLoading.hide();
	})*/
	
	
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
			   cToken:$rootScope.Token
			  }
		}).success(function (response) {
			console.log(response[0]);	
			//alert(response[0].cLogo);
			$scope.cLogo=response[0].cLogo;
			//$scope.imgpath=$rootScope.imagepath;
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
	$scope.login = {};
	
	$scope.loginUser=function(){
		$ionicLoading.show();
		var cUserName=$scope.login.cUserName
		var cPassword=$scope.login.cPassword;
		if(Boolean(cUserName) & Boolean(cPassword) ){
			$http({
				method: 'POST',
				url:$rootScope.path+'Login.asmx/LogIn_User',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function (obj) {
				            var str = [];
				            for (var p in obj)
					            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					            return str.join("&");
				            },
				data: {cUserName:cUserName,cPassword:cPassword,UserId:$rootScope.UserId,cToken:$rootScope.Token}
				}).success(function (response) {
					//console.log(response[0].Success);
					$ionicLoading.hide();
					if(response[0].Success==0){
						ionicToast.show(response[0].Message,'middle', false, 2500);
					}else{
						localStorage.setItem('cStoreName',response[0].cStoreName);
						localStorage.setItem('cUserName',response[0].cUserName);
						localStorage.setItem('cRoleType',response[0].cRoleType);
						localStorage.setItem('nLoginId',response[0].nLoginId);
						localStorage.setItem('nCustomerId',response[0].nCustomerId);
						localStorage.setItem('CompanyLogo',response[0].CompanyLogo);
					/* 	window.plugins.nativepagetransitions.slide({
						// the defaults for direction, duration, etc are all fine
						"href" : "#/app/home"
						}); */
						window.location="#/app/home";
					}
				}).error(function (data, status) {
					console.log(status);
					ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
					$ionicLoading.hide();
				})
		}else{
			ionicToast.show("Enter valid username & password",'middle', false, 2500);
			$ionicLoading.hide();
		}	
	}
	
	/*Login with google start*/
    $scope.googlelogin = function () {
				$ionicLoading.show();
                var promise = googleLogin.startLogin();
                promise.then(function (data) {
                    //alert(JSON.stringify(data.name));
                    window.localStorage['googleLogin']=JSON.stringify(data);
                    //alert(JSON.stringify(window.localStorage['googleLogin']))
						$ionicLoading.hide();
						window.location = "#/sociallogin/google";
                   // $scope.google_data = data;
                }, function (data) {
                    $scope.google_data = data;
                    //alert(JSON.stringify(data));
                });
     }
    /*Login with google end*/
})


.controller('sociallogin', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading,$stateParams) {
	if(Boolean(window.localStorage['nCustomerId'])){
		window.location="#/app/home";
	}
	/*Sign up with fb start*/
    if(window.localStorage['accessToken'] != null && $stateParams.type=='facebook') {
		$ionicLoading.show();
        $http.get("https://graph.facebook.com/me?fields=id,name,link,gender,birthday,email,first_name,last_name,locale,age_range&access_token="+window.localStorage['accessToken']).then(function(result) {
              // alert(JSON.stringify(result)); 
            /* var email=result.data.email; */ 
            var fbemail = result.data.email;
            var fbfirstname = result.data.first_name;
			var fblastname = result.data.last_name;
			var fbname = result.data.name;
			var fbid = result.data.id;
			var fbgender = result.data.gender;
			var fbprofilepicture = "http://graph.facebook.com/" + fbid + "/picture?type=large";
			//alert(JSON.stringify(result)); 	
			register(fbfirstname,fblastname,fbemail,fbid,fbgender);
        })
    }
    /*sign up with fb end*/
	/* Login google */
	if($stateParams.type=='google'){
		
  	    var email=JSON.parse(window.localStorage['googleLogin']).email;
   	    var cFirstName=JSON.parse(window.localStorage['googleLogin']).name; 
        var cProfileImage=JSON.parse(window.localStorage['googleLogin']).picture; 
        var google_id=JSON.parse(window.localStorage['googleLogin']).google_id; 
		var fbfirstname='';
		var fbgender='';
		
		register(fbfirstname,fblastname,email,google_id,fbgender);
	}
	
	function register(fbfirstname,fblastname,fbemail,fbid,fbgender){
		$http({
				method: 'POST',
				url:$rootScope.path+'Customer.asmx/AddCustomer',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
				data: {cCustomerFirstName:fbfirstname,
					   cCustomerLastName:fblastname,
					   cCustomerContactNo:'',
					   cCustomerEmailId:fbemail,
					   cPassword:fbid,
					   cGender:fbgender,
					   nUserId:$rootScope.UserId,
					   cToken:$rootScope.Token
					  }
				}).success(function (response) {
					$ionicLoading.hide();
					//console.log(response);
					if(response.Success==0){
						ionicToast.show(response.Message,'middle', false, 2500);
					}else if(response.Success==3){
						ionicToast.show(response.Message,'middle', false, 2500);
						
					}else{
						localStorage.setItem('cStoreName',response[0].cStoreName);
						localStorage.setItem('cUserName',response[0].cUserName);
						localStorage.setItem('cRoleType',response[0].cRoleType);
						localStorage.setItem('nLoginId',response[0].nLoginId);
						localStorage.setItem('nCustomerId',response[0].nCustomerId);
						localStorage.setItem('CompanyLogo',response[0].CompanyLogo);
						window.location="#/app/home";
					}
				}).error(function (data, status) {
					console.log(status);
					ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
					$ionicLoading.hide();
				})
	}
})


.controller('register', function ($scope, $http,$location,$rootScope,$ionicLoading,utilites,ionicToast) {
	if(Boolean(window.localStorage['nCustomerId'])){
		window.location="#/app/home";
	}
	
	
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
			   cToken:$rootScope.Token
			  }
		}).success(function (response) {
			console.log(response[0]);	
			//alert(response[0].cLogo);
			$scope.cLogo=response[0].cLogo;
			//$scope.imgpath=$rootScope.imagepath;
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
	$scope.register={};
	 $scope.doSignup = function () {
		$ionicLoading.show();
		var cCustomerFirstName=$scope.register.firstname
		var cCustomerLastName=$scope.register.lastname;
		var cCustomerContactNo=$scope.register.mobile
		var cCustomerEmailId=$scope.register.email;
		var password=$scope.register.password
		var cPassword=$scope.register.cpassword;
		if(Boolean(cCustomerFirstName) & Boolean(cCustomerContactNo) &  Boolean(cCustomerEmailId) & Boolean(password)){
			if(password==cPassword){	
				$http({
					method: 'POST',
					url:$rootScope.path+'Customer.asmx/AddCustomer',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					transformRequest: function (obj) {
						var str = [];
						for (var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							return str.join("&");
						},
					data: {cCustomerFirstName:cCustomerFirstName,
						   cCustomerLastName:cCustomerLastName,
						   cCustomerContactNo:cCustomerContactNo,
						   cCustomerEmailId:cCustomerEmailId,
						   cPassword:password,
						   cGender:'',
						   nUserId:$rootScope.UserId,
						   cToken:$rootScope.Token
						  }
					}).success(function (response) {
						$ionicLoading.hide();
						//console.log(response);
						if(response.Success==0){
							ionicToast.show(response.Message,'middle', false, 2500);
						}else if(response.Success==3){
							ionicToast.show(response.Message,'middle', false, 2500);
						}else{
							localStorage.setItem('cStoreName',response[0].cStoreName);
							localStorage.setItem('cUserName',response[0].cUserName);
							localStorage.setItem('cRoleType',response[0].cRoleType);
							localStorage.setItem('nLoginId',response[0].nLoginId);
							localStorage.setItem('nCustomerId',response[0].nCustomerId);
							localStorage.setItem('CompanyLogo',response[0].CompanyLogo);
							window.location="#/app/home";
						}
					}).error(function (data, status) {
						console.log(status);
						ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
						$ionicLoading.hide();
					})
			}else{
				ionicToast.show("Password does not match",'middle', false, 2500);
				$ionicLoading.hide();
			}
		}else{
			ionicToast.show("Enter all field with *",'middle', false, 2500);
			$ionicLoading.hide();
		}	
	}
	
})

.controller('ForgotPassword', function ($scope, $http,$location,$rootScope,$ionicLoading,ionicToast) {	

$scope.loginData = {};
	$scope.SendMail = function (Username) {
		  
		  var username = $scope.loginData.cUserName;
		  if(username !='undefined')
		  {
			 
		    var UserDataurl = $rootScope.path+"Login.asmx/SelectUserData?cUserName=" + username+"&nUserId="+ $rootScope.UserId+"&cToken="+$rootScope.Token;

            $http.get(UserDataurl).then(function (resp) {
     
                $scope.UserData= resp.data;
		        
		        if(resp.data[0].Success!=0)
		        {
					 //console.log(nLoginId);
			        $scope.nLoginId=resp.data[0].nLoginId;
		            var LoginId=$scope.nLoginId;
		         //console.log(LoginId);
		            $http({
			                method: 'POST',
			                url:$rootScope.path+'Login.asmx/SendMailForForgotPassword',
			                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			                transformRequest: function (obj) {
				                var str = [];
				                for (var p in obj)
					                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					                return str.join("&");
				                },
				                data: { nLoginId: LoginId	}
		          }).success(function (response) {
			                
			                console.log(response.Success);
			                if(response.Success == 0) {
				                ionicToast.show('Please Enter Valid User Name', 'middle', false, 2500);

				                $ionicLoading.hide();
			                }
			                else
			                {
				                ionicToast.show('E-Mail Sent Successfully', 'middle', false, 2500);
				                window.location = "#/app/main_page";
				                $ionicLoading.hide();
			                }
                			
		         }).error(function(err){
                			
			        console.log("err",err);	
		        })
		
		            $ionicLoading.hide();	
		        }
		        else
		        {
			        ionicToast.show('Please Check Your E-Mail', 'middle', false, 2500);	
		        }
		}, function (err) {

			console.error('ERR', err);
			
		})
		  }
		  else{
			  ionicToast.show('Please Enter Your E-Mail', 'middle', false, 2500);
			  $ionicLoading.hide();
		  }
		}	
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
			   cToken:$rootScope.Token
			  }
		}).success(function (response) {
			console.log(response[0]);	
			//alert(response[0].cLogo);
			$scope.cLogo=response[0].cLogo;
			//$scope.imgpath=$rootScope.imagepath;
			$scope.$broadcast('scroll.refreshComplete');
			$ionicLoading.hide();
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
})

.controller('profile', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading) {
		$ionicLoading.show();
		$http({
			method: 'POST',
			url:$rootScope.path+'Customer.asmx/SelectRow',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function (obj) {
				var str = [];
				for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
			data: {
				   nCustomerId:window.localStorage['nCustomerId'],
				   UserId:$rootScope.UserId,
				    cToken:$rootScope.Token
				  }
			}).success(function (response) {
				$ionicLoading.hide();
				
					$scope.cCustomerFirstName=response.mstCustomer[0].cCustomerFirstName;
				$scope.cCustomerLastName=response.mstCustomer[0].cCustomerLastName;
				
				console.log(response);
				$ionicLoading.hide();
				
					console.log(response);
					$ionicLoading.hide();
					
				
			}).error(function (data, status) {
				console.log(status);
				ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
				$ionicLoading.hide();
			})
			
			$scope.logout=function(){
				window.localStorage.clear();
				window.location="#/login";
				location.reload();		
			}
})

.controller('updateprofile', function ($scope, $http,$location,$rootScope,utilites,ionicToast,$ionicLoading,$ionicModal) {
	$ionicModal.fromTemplateUrl('templates/editprofile.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.editprofile = modal;
	  });
	  
	  $ionicModal.fromTemplateUrl('templates/changepassword.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.changepassword = modal;
	  });
	  
	  $ionicModal.fromTemplateUrl('templates/addaddress.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.addaddress = modal;
	  });
	  $scope.updateprofile={};
	  $scope.updateaddress={};
	  $ionicLoading.show();
	  $http({
		method: 'POST',
		url:$rootScope.path+'Customer.asmx/SelectRow',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: {
			   nCustomerId:window.localStorage['nCustomerId'],
			   UserId:$rootScope.UserId,
			   cToken:$rootScope.Token
			  }
		}).success(function (response) {
			$ionicLoading.hide();

			$scope.updateprofile.cCustomerFirstName=response.mstCustomer[0].cCustomerFirstName;
			$scope.updateprofile.cCustomerLastName=response.mstCustomer[0].cCustomerLastName;
			$scope.updateprofile.cCustomerContactNo=response.mstCustomer[0].cCustomerContactNo;
			$scope.updateprofile.cCustomerEmailId=response.mstCustomer[0].cCustomerEmailId;
			$scope.updateaddress.cCustomerAddress=response.mstCustomer[0].cCustomerAddress;
			$scope.updateaddress.cCity=response.mstCustomer[0].cCity;
			$scope.updateaddress.cZipCode=response.mstCustomer[0].cZipCode;
			
			
				console.log(response);
				$ionicLoading.hide();
					
			
		
		}).error(function (data, status) {
			console.log(status);
			ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
			$ionicLoading.hide();
		})
		
		/* Update profile */
		$scope.updateprofile=function(){
			//alert($scope.updateprofile.cCustomerFirstName);
			if(Boolean($scope.updateprofile.cCustomerFirstName) && Boolean($scope.updateprofile.cCustomerEmailId) && Boolean($scope.updateprofile.cCustomerContactNo)){
			 $ionicLoading.show();
			  $http({
				method: 'POST',
				url:$rootScope.path+'Customer.asmx/UpdateCustomerProfile',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
				data: {cCustomerFirstName:$scope.updateprofile.cCustomerFirstName,
					   cCustomerLastName:$scope.updateprofile.cCustomerLastName,
					   cCustomerContactNo:$scope.updateprofile.cCustomerContactNo,
					   cCustomerEmailId:$scope.updateprofile.cCustomerEmailId,
					   cGender:'',
					    nCustomerId:window.localStorage['nCustomerId'],
					    nUserId:$rootScope.UserId,
						cToken:$rootScope.Token
					  }
				}).success(function (response) {
					//console.log(response);
					if(response.Success==0){
						ionicToast.show(response.Message,'middle', false, 2500);
					}else{
						ionicToast.show(response.Message,'middle', false, 2500);
						$scope.editprofile.hide();
					}
					
					$ionicLoading.hide();
				}).error(function (data, status) {
					console.log(status);
					ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
					$ionicLoading.hide();
				})
			}
			else{
				ionicToast.show('All field are required','middle', false, 2500);
			}	
		}
		
		/* Update password */
		$scope.updatepassword=function(){
			//$scope.oldpassword
			//alert($scope.updatepassword.oldpassword);
			if($scope.updatepassword.newpassword==$scope.updatepassword.confpassword){
			 $ionicLoading.show();
			  $http({
				method: 'POST',
				url:$rootScope.path+'Customer.asmx/UpdateCustomerPassword',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
				data: {
					   nCustomerId:window.localStorage['nCustomerId'],
					   cNewPassword:$scope.updatepassword.newpassword,
					   cOldPassword:$scope.updatepassword.oldpassword,
					   nUserId:$rootScope.UserId,
					   cToken:$rootScope.Token
					  }
				}).success(function (response) {
					//console.log(response);
					if(response.Success==0){
						ionicToast.show(response.Message,'middle', false, 2500);
					}else{
						ionicToast.show(response.Message,'middle', false, 2500);
						$scope.changepassword.hide();
					}
					
					$ionicLoading.hide();
				}).error(function (data, status) {
					console.log(status);
					ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
					$ionicLoading.hide();
				})
			}
			else{
				ionicToast.show('Password not match','middle', false, 2500);
			}	
		}
		
		/* Update Address start */
		$scope.updateaddress=function(){
			var cZipcode=Boolean($scope.updateaddress.cZipCode) ? $scope.updateaddress.cZipCode : '';
			var cCity=Boolean($scope.updateaddress.cCity) ? $scope.updateaddress.cCity : '';
			var cAddress=Boolean($scope.updateaddress.cCustomerAddress) ? $scope.updateaddress.cCustomerAddress : '';			
			 $ionicLoading.show();
			  $http({
				method: 'POST',
				url:$rootScope.path+'Customer.asmx/UpdateCustomerAddress',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
				data: {
					   nCustomerId:window.localStorage['nCustomerId'],
					   nUserId:$rootScope.UserId,
					   cAddress:cAddress,
					   cCity:cCity,
					   cZipcode:cZipcode,
					   cToken:$rootScope.Token
					  }
				}).success(function (response) {
					//console.log(response);
					if(response.Success==0){
						ionicToast.show(response.Message,'middle', false, 2500);
					}else{
						ionicToast.show(response.Message,'middle', false, 2500);
						$scope.addaddress.hide();
					}
					
					$ionicLoading.hide();
				}).error(function (data, status) {
					console.log(status);
					ionicToast.show($rootScope.connectionmsg,'middle', true, 2500);
					$ionicLoading.hide();
				})
				
		}
		/* Update Address end */

})
}());