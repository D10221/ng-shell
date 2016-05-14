
import {DropDownMenuCtrl, DropDownMenuScope} from "./DropDownMenuCtrl";


angular.module('tinyx.dropDownMenu',[])
.controller('DropDownMenuCtrl', DropDownMenuCtrl)
.directive('tnxDropDownMenu', ()=> {
    return {
        restrict:'E',
        controller: 'DropDownMenuCtrl',
        controllerAs: 'vm',
        templateUrl: function(element, attr) {
            console.log(attr.config);
            return attr.templateUrl ? attr.templateUrl : 'templates/drop-down-menu/dropdown.html'
        },
        scope:{
            config: "="
        },
        compile:()=> {
            return {
                pre:(scope: DropDownMenuScope,element: ng.IAugmentedJQuery, attr: ng.IAttributes) => {
                    if(scope.vm){
                        scope.vm.element = element;
                    }
                    var mdlElement = element.find('drop-down-menu-container')[0];
                    if(mdlElement){
                        componentHandler.upgradeElements(mdlElement);
                    }
                }
            }
        }
    }
});
