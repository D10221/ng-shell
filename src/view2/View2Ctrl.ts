
import {RelayCommand} from "../infrastructure/Command";

import {DropDownMenuConfig} from "../components/drop-down-menu/DropDownMenuCtrl";

export class View2Ctrl {

    id = _.uniqueId('tnxView2Ctrl_');

    static $inject = ['$scope'];

    constructor($scope) {

        console.log(`${typeof this}  instanciated!`);

        this.options = {

            header: 'Options',

            icon: 'more_vert', //Menu Icon

            menuItems: [{
                // id: '', // optional
                header: 'run',
                //
                icon: 'motorcycle',

                command: new RelayCommand((item)=> {
                    alert(`Hello from :${item.id}`)
                }),
            }]
        }
    }

    options:DropDownMenuConfig;

}
