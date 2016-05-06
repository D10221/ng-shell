import {TnxTableCtrl} from "./TnxTableCtrl";

angular.module('tinyx.dTable', [])
    .controller('TnxTableCtrl', TnxTableCtrl)
    .directive('tnxTable', (/*injector Dependencies*/)=> {
        return {
            restrict: 'E',
            scope: {
                source: '='
            },
            templateUrl: 'templates/data-table/data-table.html',
            transclude: true
        }
    });
