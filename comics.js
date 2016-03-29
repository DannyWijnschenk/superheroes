var comics = angular.module('comics', ['ngResource', 'ui.bootstrap']);

 HostURL = function() {
    return "http://localhost:57780/";
 };
   
 comics.factory('restDocDMDocument', function ($resource) {
    return $resource(
		HostURL() + "api/document/v1/:namespace/:collectionname/:key", null, {
		query : { method: "GET", isArray: false, headers:{'accept':'application/json'} },
        update: { method: "PUT", isArray: false, headers:{'accept':'application/json'} },
	    insert: { method: "POST", isArray: false, headers:{'accept':'application/json'} },
		remove: { method: "DELETE", isArray: false, headers:{'accept':'application/json'} }
	});	
   });

comics.controller('ComicsController', ['$scope', '$resource', '$routeParams', '$modal', 'restDocDMDocument',
                                  function($scope,   $resource,   $routeParams,$modal,   restDocDMDocument) {
                                        
  console.log('comics ready');    
  var DocDM = { 
                 "namespace"  : "USER",
                 "collection" : "superheroes"
              }
 $scope.name = $scope.$routeParams.characterId;
  restDocDMDocument.query({namespace:DocDM.namespace,collectionname:DocDM.collection,key:$scope.$routeParams.characterId},function(data) {
      $scope.characterName = data.content.name;
      $scope.characterComics = data.content.comics.available;
      $scope.comics = data.content.comics.items;
  })     
                                    
}]);
