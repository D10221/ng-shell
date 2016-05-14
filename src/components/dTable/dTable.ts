import {TnxTableCtrl} from "./TableCtrl";
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
    })
    .directive('tnxPager', ()=>{
        return {
            scope: {
                pager: '='
            },
            templateUrl: 'templates/data-table/pager.html',
            //post
        }
    });
