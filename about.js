var about = angular.module('about', ['ngResource', 'ui.bootstrap']);

about.controller('AboutController', ['$scope', '$resource', '$routeParams', '$modal',
                                        function($scope,   $resource,   $routeParams,   $modal) {

  console.log('about ready');                                 
                                        
}]);