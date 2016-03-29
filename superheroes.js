//Define angular modules for our app
var MarvelApp = angular.module('MarvelApp',
    [
       'characters',
       'ngRoute',
       'comics',
       'about',
       'importer'
    ]
);
 
MarvelApp
  .config(
    ['$routeProvider',
      function($routeProvider,$locationProvider,$route) {
        $routeProvider
          .when('/Characters', {
            templateUrl: 'characters.html',
            action: 'characters.CharacterController'
          })
          .when('/Comics/:characterId', {
            templateUrl: 'comics.html',
            action: 'comics.ComicsController'
          })
          .when('/Import', {
            templateUrl: 'import.html',
            action: 'import.ImportController'
          })
          .when('/', {
            templateUrl: 'about.html',
            action: 'about.AboutController'
          })
          .otherwise( {
            redirectTo: '/'
          });
      }
     ]
  );


 MarvelApp.controller('MarvelController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
 });
  
 
 $(".nav a").on("click", function(){
   $(".nav").find(".active").removeClass("active");
   $(this).parent().addClass("active");
});
	