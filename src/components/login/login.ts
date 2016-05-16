import {LoginDialogViewModel} from "./LoginDialogViewModel";
import {Dialog} from "../../infrastructure/interfaces";

angular.module('tinyx.login',[])
.controller('LoginDialogViewModel', LoginDialogViewModel)
.directive('loginDialog',()=>{
    return {
        templateUrl: 'templates/login/login-dialog.html',
        controller: 'LoginDialogViewModel',
        controllerAs: 'loginVm',
        compile:()=>{
            return {
                pre: (scope, element, attrs) => {
                    var vm = ((scope as any).loginVm as LoginDialogViewModel);
                    if(vm){
                        vm.dialog = element.find('dialog')[0] as Dialog;
                        if(vm.dialog){
                            componentHandler.upgradeElements(vm.dialog);
                        }
                    }

                }
            }
        } 
    }
});