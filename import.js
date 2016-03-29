var importer = angular.module('importer', ['ngResource', 'ui.bootstrap']);


 HostURL = function() {
    return "http://localhost:57780/";
 };

importer.factory('restMarvelCharacters', function ($resource) {
    return $resource(
		"http://gateway.marvel.com/v1/public/characters", {}, {
		query: {method: 'GET', isArray: false, params:{apikey:'@apikey', hash:'@hash', ts:'@ts', offset:'@offset', limit:'@limit'} },
		});
 });

importer.factory('restDocDBCollection', function ($resource) {
    return $resource(
		HostURL() + "api/document/v1/SUMMIT2016/test", {}, {
		update: { method: "POST",
		         isArray: false,
		         headers:{'accept':'application/json'} }
		});	
   });

// Download a file form a url.
function saveFile(url) {
  // Get file name from url.
  var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename; // Set the file name.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
  };
  xhr.open('GET', url);
  xhr.send();
}


importer.controller('ImportController', ['$scope', '$resource', '$routeParams', '$modal', 'restMarvelCharacters', 'restDocDBCollection',
                                        function($scope,   $resource,   $routeParams,   $modal, restMarvelCharacters, restDocDBCollection) {

  $scope.privateKey = '51e4873bff9cac515f618841fa3483282686dfc6';
  $scope.publicKey = '6e2cefb9ea64eb8adfd4554a23013b66';     
  $scope.api       = '';                                          
  console.log("importer ready"); 
  $scope.limit = 100;
  $scope.offset = 1;
  
  $scope.import = function() {
  	console.log(" importing ...");
  	var publicKey = $scope.publicKey;
  	var privateKey = $scope.privateKey;
  	var ts = Date.now();
  	var hash = calcMD5(ts+privateKey+publicKey);
  	var limit = $scope.limit;
  	var offset = $scope.offset;
    
  	temp = restMarvelCharacters.query({apikey:publicKey, hash:hash, ts:ts, offset:offset, limit:limit}, function(data) {
	   $scope.response = temp.data.results;
	   console.log(temp);
	   $scope.images = [];
	   for (var i=0; i < temp.data.results.length; i++) {
	   	 $scope.images.push({'Url':temp.data.results[i].thumbnail.path+'.'+temp.data.results[i].thumbnail.extension});
		 saveFile(temp.data.results[i].thumbnail.path+'.'+temp.data.results[i].thumbnail.extension);
         temp2 = restDocDBCollection.update(temp.data.results[i], function(data) {
			console.log(temp2);
         });
	   }
 	});
    console.log("url" , "http://gateway.marvel.com/v1/public/characters?ts="+ts+"&apikey="+publicKey+"&hash="+hash);
    console.log($scope.images);
  };

                                           
}]);
