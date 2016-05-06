'use strict';

angular.module('ngShell.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'templates/view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', [function() {

    }]);