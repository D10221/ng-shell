'use strict';
class NgShellRoot {
  menuOpen: boolean ;
  toggleMenuOpen : ()=> void;

  constructor($mdSidenav) {
    this.menuOpen = true;
    this.toggleMenuOpen = ()=>{
        $mdSidenav('leftSideNav').togg;
    }
  }
}
// Declare app level module which depends on views, and components
angular.module('ngShell', [
  'ngMaterial',
  'ngRoute',
  'ngShell.view1',
  'ngShell.view2',
  'ngShell.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}])
    .controller('NgShellRoot', NgShellRoot);
