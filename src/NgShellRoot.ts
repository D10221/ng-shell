import {SideNav} from "./SideNav";
import {EventArgs} from "./infrastructure/interfaces";
import {MessageBus} from "./infrastructure/MessageBus";

export class NgShellRoot {

    brand = 'Tini-X';

    static $inject = ['$scope', 'SideNav', 'MessageBus'];

    messageBus: MessageBus;

    sideNav:SideNav;
    
    constructor($scope, sideNav:SideNav, messageBus: MessageBus) {

        this.sideNav = sideNav;
        this.messageBus = messageBus;
        
        fetch('data/app_settings.json', {
            credentials: 'same-origin'
        })
            .then(r=>r.json()).then(data=> {
            this.brand = data.brand;
            $scope.$apply();
        });

        this.showLoginDialog = ()=> {
            this.messageBus.publish({
                sender: this,
                args: {
                    key: 'login-dialog-show', 
                    value: true
                }
            });
        };
    }

    Nada(){
        console.log('nada');
    }

    showLoginDialog() {

    }
}