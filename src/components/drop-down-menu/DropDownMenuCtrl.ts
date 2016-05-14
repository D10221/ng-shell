import {Command, RelayCommand} from "../../infrastructure/Command";

export interface DropDownMenuItem {
    id?:any;
    header: any;
    icon: any;
    command: Command
}

export interface DropDownMenuConfig{
    header?: any;
    icon?: any;
    menuItems?: DropDownMenuItem[];
}


export interface DropDownMenuScope extends ng.IScope {
    vm: DropDownMenuCtrl;
}

export class DropDownMenuCtrl {

    constructor($scope) {

        var config = $scope.config as DropDownMenuConfig;

        if(config && config.icon ){
            this.icon = config.icon;
        }
        if(config && config.header){
            this.header = config.header;
        }

        //No Config found ...
        this.menuItems = config && config.menuItems ? config.menuItems.map(i=> {
            if(!i.id){
                i.id =_.uniqueId('tnx_drop_down_menu_item_')
            }
            return i;
        }) : [{
            id: _.uniqueId('tnx_drop_down_menu_item_'),
            header: 'Item',
            icon: 'alarm',
            command: new RelayCommand((self:DropDownMenuItem)=> {
                alert(`DropDownMenuItem.action:command:execute: ${self.id}`)
            })
        }];


        console.log(`DropDownMenuCtrl: ${this.id}`);
        console.log(JSON.stringify(this.menuItems));
    }

    header ;

    id = _.uniqueId('tnx_drop_down_menu_');

    element: ng.IAugmentedJQuery;

    static  $inject =['$scope'];


    icon = 'menu';

    menuItems: DropDownMenuItem[];

}
