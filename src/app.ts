///<reference path="definitions.d.ts"/>
import './view2/view2'
import './view1/view1'
import './components/version/version.ts'
import './components/version/interpolate-filter'
import './components/version/version-directive.ts'
import {SideNavSvc} from "./SideNavSvc";
import {NgShellRoot} from "./NgShellRoot";
import {upgradeElementsDirective} from "./mdlUpgrade";



// Declare app level module which depends on views, and components
angular
    .module('ngShell', [
        //'ngMaterial',
        'ngRoute',
        'ngShell.view1',
        'ngShell.view2',
        'ngShell.version'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }])
    //
    .service('SideNavSvc', SideNavSvc)
    //
    .controller('NgShellRoot', NgShellRoot)
    //
    .directive('mdlUpgrade', upgradeElementsDirective)
    //
    .run(function ($rootScope,$timeout) {
        $rootScope.$on('$viewContentLoaded', ()=> {
            $timeout(() => {
                componentHandler.upgradeAllRegistered();
            })

        })
    });
