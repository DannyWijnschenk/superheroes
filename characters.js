var characters = angular.module('characters', ['ngResource', 'ui.bootstrap']);

 HostURL = function() {
    return "http://localhost:57780/";
 };

 characters.factory('restDocDMCollectionQ', function ($resource) {
    return $resource(
		HostURL() + "api/document/v1/:namespace/:collectionname?action=query", {collectionname: '@collectionname', namespace:'@namespace'}, {
		query: { method: "POST",
		         isArray: false,
		         headers:{'accept':'application/json'} }
		});	
   });
   
 characters.factory('restDocDMDocument', function ($resource) {
    return $resource(
		HostURL() + "api/document/v1/:namespace/:collectionname/:key", null, {
		update: { method: "PUT", isArray: false, headers:{'accept':'application/json'} },
	    insert: { method: "POST", isArray: false, headers:{'accept':'application/json'} },
		remove: { method: "DELETE", isArray: false, headers:{'accept':'application/json'} }
		});	
   });
   
characters.controller('CharactersController', ['$scope', '$resource', '$routeParams', '$modal','restDocDMCollectionQ', 'restDocDMDocument',
                                        function(  $scope,   $resource,   $routeParams,   $modal,  restDocDMCollectionQ,   restDocDMDocument) {
  
  console.log("characters ready")
  var DocDM = { 
                 "namespace"  : "USER",
                 "collection" : "superheroes"
              }
                                            
  $scope.getCharacters = function() {
      restDocDMCollectionQ.query({namespace:DocDM.namespace,
                                 collectionname:DocDM.collection,
                                limit:1000,
                                 columns:[],
	                             restriction:''
                                },function(data) {
   	     $scope.characters = data.content;
      }); 
   };
  
  $scope.getCharacters();
      
  $scope.showModalCharacter = function(character) {
    $modal.open({
       'templateUrl':'modalCharacter.html',
       'controller':['$scope','$modalInstance',function($scope, $modalInstance){
           $scope.character = character;
           $scope.save = function() {
	           $modalInstance.close({character:$scope.character, action:'save'});
	       };
           $scope.remove = function() {
	           $modalInstance.close({character:$scope.character, action:'remove'});
	       };
           $scope.cancel = function() {
	           $modalInstance.dismiss({action:'cancel'});
	       };
       }]
    }).result.then(function(data) {
 	     if (data.action=='save') {
             if (data.character._sourceID == undefined) {
               restDocDMDocument.insert({namespace:DocDM.namespace,
                                         collectionname:DocDM.collection},
                                         data.character.content,function(dataRest) {
		       })     
             } else {
 	      	   restDocDMDocument.update({namespace:DocDM.namespace,
                                         collectionname:DocDM.collection,
                                         key:data.character._sourceID},
                                         data.character.content,function(dataRest) {
 		       });
             }
 	     } else if (data.action=='remove') {
			restDocDMDocument.remove({namespace:DocDM.namespace,
			                          collectionname:DocDM.collection,
			                          key:data.character._sourceID},function(dataRest) {
  				var index = $scope.characters.indexOf(data.character);
  				$scope.characters.splice(index, 1);    
			});
 	     };   
        },
        function(msg) {});  
    };                              
}]);
                                        