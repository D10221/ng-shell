'use strict';
import {View2Ctrl} from "./View2Ctrl";

angular.module('ngShell.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'templates/view2/view2.html',
            controller: 'View2Ctrl',
            controllerAs: 'vm'
        });
    }])

    .controller('View2Ctrl',View2Ctrl);