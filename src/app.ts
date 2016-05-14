///<reference path="definitions.d.ts"/>

import './components/version/version';
import './components/version/interpolate-filter';
import './components/version/version-directive';
import './components/login/login';
import './components/drop-down-menu/DropDownMenu'
import './view1/view1';
import './view2/view2';
import './components/dTable/dTable';
import {SideNav} from "./SideNav";
import {NgShellRoot} from "./NgShellRoot";
import {MessageBus} from "./infrastructure/MessageBus";

// Declare app level module which depends on views, and components
angular.module('ngShell', [     
        'ngRoute',
        'tinyx.dTable',
        'tinyx.login',
        'tinyx.dropDownMenu',
        'ngShell.view1',
        'ngShell.view2',
        'ngShell.version'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }])
    .service('MessageBus', MessageBus)
    .service('SideNav', SideNav)
    .controller('NgShellRoot', NgShellRoot)
    .directive('onEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.onEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    // https://tech.small-improvements.com/2013/09/10/angularjs-performance-with-large-lists/
    // .directive('postRenderDirective',
    // ['$timeout', '$log',
    //     function($timeout, $log) {
    //         var ref = moment();
    //         return function(scope, element, attrs) {
    //             if (scope.$last){
    //                 $timeout(function(){
    //                     var end = moment();
    //                     $log.debug(`## DOM rendering time: ${end.millisecond()- ref.millisecond()} ms`);
    //                 });
    //             }
    //         };
    //     }
    // ])
    // https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.5l06m0phb
    // .config(['$compileProvider', function ($compileProvider) {
    //     $compileProvider.debugInfoEnabled(false);
    // }])
    // Material Design Lite (mdl)
    // https://github.com/jadjoubran/angular-material-design-lite/blob/master/src/angular-material-design-lite.js
    .directive('mdlUpgrade', function($timeout) {

        return {
            restrict: 'A',
            compile: function() {
                return {
                    post: function postLink(scope, element) {
                        $timeout(function() {
                            try {
                                componentHandler.upgradeAllRegistered();
                            } catch (e) {
                                // ??
                            }
                        }, 0);
                    }
                };
            },
        };

    })
    // Material Design Lite (mdl)
    .run(($rootScope,$timeout)=> {
        $rootScope.$on('$viewContentLoaded', ()=>{
            $timeout(()=>{
                componentHandler.upgradeAllRegistered();
            })
        })
    });

