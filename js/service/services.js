angular.module('pariapp.services', [])
.service('utilites',function($http,$ionicLoading,$rootScope){
	this.callApi=function(method,url,datastring){
		$ionicLoading.show({ template: 'Loading...' })
		$http({
				method: method,
				url: $rootScope.path+url,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: datastring
			}).success(function (response) {
				$ionicLoading.hide();
				return response;
			})
	}
	this.toDayDate=function(){
		var date = new Date();
		return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	}
})
.factory('Chats', function($http,$ionicLoading,$rootScope) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
	webserviceCallPost:function(url,data){
		var responsedata={};
		$http({
		method: 'POST',
		url:$rootScope.path+url,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		transformRequest: function (obj) {
			var str = [];
			for (var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		data: data
		}).success(function (response) {
			//console.log(response);
			//$scope.orderlist=response;
			responsedata=response;
		});
		return responsedata;
	}
  };
});


