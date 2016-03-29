var comics = angular.module('comics', ['ngResource', 'ui.bootstrap']);

 HostURL = function() {
    return "http://localhost:57780/";
 };
   
 comics.factory('restDocument', function ($resource) {
    return $resource(
		HostURL() + "api/document/v1/:namespace/:collectionname/:key", null, {
		update: { method: "PUT", isArray: false, headers:{'accept':'application/json'} },
	    insert: { method: "POST", isArray: false, headers:{'accept':'application/json'} },
		remove: { method: "DELETE", isArray: false, headers:{'accept':'application/json'} },
		query : { method: "GET", isArray: false, headers:{'accept':'application/json'} }
		});	
   });

comics.controller('ComicsController', ['$scope', '$resource', '$routeParams', '$modal', 'restDocument',
                                  function($scope,   $resource,   $routeParams,$modal,restDocument) {
                                        
  console.log('comics ready');    
  $scope.name = $scope.$routeParams.characterId;
  restDocument.query({namespace:'SUMMIT2016',collectionname:'test',key:$scope.$routeParams.characterId},function(data) {
      $scope.characterName = data.content.name;
      $scope.characterComics = data.content.comics.available;
      $scope.comics = data.content.comics.items;
    console.log(data);  
  })     
                                    
}]);
