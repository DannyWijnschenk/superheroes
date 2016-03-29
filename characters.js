var characters = angular.module('characters', ['ngResource', 'ui.bootstrap']);

 HostURL = function() {
    return "http://localhost:57780/";
 };

 characters.factory('restCollection', function ($resource) {
    return $resource(
		HostURL() + "api/document/v1/:namespace/:collectionname?action=query", {collectionname: '@collectionname', namespace:'@namespace'}, {
		query: { method: "POST",
		         isArray: false,
		         headers:{'accept':'application/json'} }
		});	
   });
   
 characters.factory('restDocument', function ($resource) {
    return $resource(
		HostURL() + "api/document/v1/:namespace/:collectionname/:key", null, {
		update: { method: "PUT", isArray: false, headers:{'accept':'application/json'} },
	    insert: { method: "POST", isArray: false, headers:{'accept':'application/json'} },
		remove: { method: "DELETE", isArray: false, headers:{'accept':'application/json'} }
		});	
   });
   
characters.controller('CharactersController', ['$scope', '$resource', '$routeParams', '$modal','restCollection', 'restDocument',
                                        function(  $scope,   $resource,   $routeParams,   $modal,  restCollection,   restDocument) {
  
  console.log("characters ready")
  $scope.getCharacters = function() {
      restCollection.query({namespace:'SUMMIT2016',
                            collectionname:'test',
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
           console.log("modal",character);
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
	      	console.log('setting',data.character);
             if (data.character._sourceID == undefined) {
               restDocument.insert({namespace:'SUMMIT2016',
                                    collectionname:'test'},
                                    data.character.content,function(dataRest) {
		       })     
             } else {
 	      	   restDocument.update({namespace:'SUMMIT2016',
                                    collectionname:'test',
                                    key:data.character._sourceID},
                                    data.character.content,function(dataRest) {
 		       });
             }
 	     } else if (data.action=='remove') {
			restDocument.remove({namespace:'SUMMIT2016',
			                     collectionname:'test',
			                     key:data.character._sourceID},function(dataRest) {
  				var index = $scope.characters.indexOf(data.character);
  				$scope.characters.splice(index, 1);    
			});
 	     };   
        },
        function(msg) {});  
    };                              
}]);
                                        