'use strict';

class View1Ctrl {
  message: string = 'hello...';
  constructor() {
    
  }
}

angular.module('ngShell.view1', ['ngRoute'])

.config(['$routeProvider', ($routeProvider) => {
  $routeProvider.when('/view1', {
    templateUrl: 'templates/view1/view1.html',
    //controller: 'View1Ctrl as vm'
  });
}])

.controller('View1Ctrl', [View1Ctrl]);