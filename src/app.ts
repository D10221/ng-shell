'use strict';

// Declare app level module which depends on views, and components
angular.module('ngShell', [
  'ngRoute',
  'ngShell.view1',
  'ngShell.view2',
  'ngShell.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
