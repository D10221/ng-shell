import {TnxTableCtrl} from "./TnxTableCtrl";
import {isVisible} from "./TableElementTools";

angular.module('tinyx.dTable', [])
    .filter('isVisible',()=> isVisible )
    .controller('TnxTableCtrl', TnxTableCtrl)
    .directive('tnxTable', (/*injector Dependencies*/)=> {
        return {
            restrict: 'E',
            scope: {
                source: '='
            },
            templateUrl: 'templates/data-table/data-table.html',
           // transclude: true
        }
    });
