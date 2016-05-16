



import {Guid} from "../../infrastructure/Guid";
import {UserData} from "./definitions";
import {TinytStore} from "../../infrastructure/TinytStore";
import {RelayCommand} from "../../infrastructure/Command";
import {EventArgs, Dialog} from "../../infrastructure/interfaces";
import {MessageBus} from "../../infrastructure/MessageBus";

export class LoginDialogViewModel {

    idx = Guid.newGuid();

    store = new TinytStore<UserData>("user");

    showCmd = new RelayCommand(()=> this.show());

    closeCmd =new RelayCommand(()=> {
        if(this.signedIn){
            this.close();
        }
    });

    loginCmd = new RelayCommand(()=> this.login());

    show:()=> void;

    close:()=> void;

    login:()=> void;

    label = "Sign In";

    rememberme = false;

    username = "";

    private userData: UserData;

    isBusy =  false;

    error = "?";

    getPassword():string {
        var dialog = this.dialog;
        if(dialog){
            var inputElement = (<HTMLInputElement>dialog.getElementsByClassName("password")[0]);
            return inputElement ? inputElement.value : "";
        }
    }

    signedIn =  false;

    private _dialog: Dialog ;
    
    dialog:Dialog;

    static $inject = ['$scope', 'MessageBus'];
    
    constructor($scope, private messageBus: MessageBus) {
        
        this.messageBus.listen
            .where(e=>e.sender != this)
            .where(e=>e.args.key == 'login-dialog-show')
            .subscribe( () => {
                this.show();
            });

        var loadUser = () => {

            var user:UserData = this.store.getItem();
            if (user && user.username && user.username != '') {

                this.userData = user;
                this.username = user.username ;
                this.rememberme = true ;
                this.signedIn = true;
                this.label = "Sign out";

                this.notifyLogginChanged();
            }
        };

        loadUser();

        this.show = () => {
            if(this.dialog){
                this.dialog.showModal();
            }
        };

        this.close = ()=> {
            if(this.dialog){
                this.dialog.close();
            }
        };

        this.login = ()=> {

            this.error = "";

            this.isBusy = true;

            // Signing out
            if(this.signedIn){

                //Simulate delay
                Rx.Observable.timer(1000,0).take(1).subscribe( () =>{

                    this.isBusy = true; 

                    this.username = "";
                    this.signedIn = false; 
                    this.label = "Sign In";
                    this.userData = null;
                    this.updateStore();

                    this.notifyLogginChanged();

                    this.isBusy = false;

                    this.updateStore();
                });

                return;
            }

            var password = this.getPassword();
            //Simulate delay: call to authenticate , gets token and roles
            Rx.Observable.timer(1000, 0).take(1).subscribe(()=> {

                if ( this.username != "admin" || password != "password" ) {
                    //FAIL
                    this.userData = null;
                    this.error = "BAD username || password";
                    this.notifyLogginChanged();

                } else {

                    this.label = "Sign out";

                    this.signedIn = true ; 

                    this.userData = {username: this.username, token: "0123456789ABCDEF", roles: ["admin"]};

                    this.updateStore();

                    this.notifyLogginChanged();

                    this.close();
                }

                this.isBusy = false;
            });

        };

        if(!this.signedIn){
            this.show();
        }
    }

    private notifyLogginChanged() {
        this.messageBus.publish({
            sender: this, args:{ key: "tinyx.user.login", value: this.userData }
        });
    }

    private updateStore:() => void = () => {
        
        if (this.rememberme) {
            console.log(`updating ${this.userData ? this.userData.toString(): "{}"}`);
            this.store.setItem(this.userData);
        } else {
            console.log(`removing ${this.userData ? this.userData.toString(): "{}"}`);
            this.store.deleteItem(this.userData);
        }
    }


}


