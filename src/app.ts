///<reference path="definitions.d.ts"/>

class SideNavSvc {

    isOpen:boolean = true;

    toggleOpen:()=> void = ()=> {
        this.isOpen = !this.isOpen;
    };

    navItems = [
        {
            href: '#/view1',
            label: 'view 1',
            icon: 'checked'
        },
        {
            href: '#/view2',
            label: 'view 2',
            icon: 'checked'
        }]
}

class NgShellRoot {

    static $inject = ['SideNavSvc'];

    brand = 'Tiny-x';

    constructor(public  sideNav:SideNavSvc) {

    }
}

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
    .service('SideNavSvc', SideNavSvc)
    .controller('NgShellRoot', NgShellRoot)
    .directive('mdlUpgrade', function($timeout:ng.ITimeoutService) {

        return {
            restrict: 'A',
            compile: function() {
                return {
                    pre: function postLink(scope, element) {
                        $timeout(() => {
                            componentHandler.upgradeElements(element[0]);
                        }, 0);
                    },
                    post: function postLink(scope, element) {
                        $timeout(() => {
                            componentHandler.upgradeElements(element[0]);
                        }, 0);
                    }
                };
            },
        };

    })
    .run(function ($rootScope,$timeout) {
        $rootScope.$on('$viewContentLoaded', ()=> {

            $timeout(() => {
                componentHandler.upgradeAllRegistered();
            })

        })
    });
