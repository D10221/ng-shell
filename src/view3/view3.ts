'use strict';

import {View3Ctrl} from "./View3Ctrl";

angular.module('ngShell.view3', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'src/view3/view3.html',
            controller: 'View3Ctrl',
            controllerAs: 'vm'
        });
    }])

.controller('View3Ctrl',View3Ctrl);