///<reference path="definitions.d.ts"/>

import './components/version/version';
import './components/version/interpolate-filter';
import './components/version/version-directive';
import './view1/view1';
import './view2/view2';
import './components/dTable/dTable';
import {SideNav} from "./SideNav";
import {NgShellRoot} from "./NgShellRoot";

// Declare app level module which depends on views, and components
angular.module('ngShell', [     
        'ngRoute',
        'tinyx.dTable',
        'ngShell.view1',
        'ngShell.view2',
        'ngShell.version'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }])
    .service('sideNav', SideNav)
    .controller('NgShellRoot', NgShellRoot)
    // https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.5l06m0phb
    // .config(['$compileProvider', function ($compileProvider) {
    //     $compileProvider.debugInfoEnabled(false);
    // }])
    // Material Design Lite (mdl)
    .run(($rootScope,$timeout)=> {
        $rootScope.$on('$viewContentLoaded', ()=>{
            $timeout(()=>{
                componentHandler.upgradeAllRegistered();
            })
        })
    });

