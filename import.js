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

importer.factory('restDocDMCollection', function ($resource) {
    return $resource(
		HostURL() + "api/document/v1/:namespace/:collectionname", {collectionname: '@collectionname', namespace:'@namespace'}, {
				query: { method: "POST",
		         isArray: false,
		         headers:{'accept':'application/json'} },
                update: { method: "POST",
		         isArray: false,
		         headers:{'accept':'application/json'} }
		});	
   });

importer.controller('ImportController', ['$scope', '$resource', '$routeParams', '$modal', 'restMarvelCharacters', 'restDocDMCollection',
                                        function($scope,   $resource,   $routeParams,   $modal, restMarvelCharacters, restDocDMCollection) {

  $scope.privateKey = 'enter your private key here !!!';
  $scope.publicKey = '6e2cefb9ea64eb8adfd4554a23013b66';     
  $scope.api       = '';                                          
  console.log("importer ready"); 
  var DocDM = { 
                 "namespace"  : "USER",
                 "collection" : "superheroes"
              }
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
	   $scope.images = [];
	   for (var i=0; i < temp.data.results.length; i++) {
	   	 $scope.images.push({'Url':temp.data.results[i].thumbnail.path+'.'+temp.data.results[i].thumbnail.extension});
         temp2 = restDocDMCollection.update({namespace:DocDM.namespace,collectionname:DocDM.collection},temp.data.results[i], function(data) {
			//
         });
	   }
 	});
    console.log("url" , "http://gateway.marvel.com/v1/public/characters?ts="+ts+"&apikey="+publicKey+"&hash="+hash);
    console.log($scope.images);
  };

                                           
}]);
