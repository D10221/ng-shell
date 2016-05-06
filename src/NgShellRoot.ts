import {SideNavSvc} from "./SideNavSvc";

export class NgShellRoot {

    static $inject = ['SideNavSvc'];

    brand = 'Tiny-x';

    constructor(public  sideNav:SideNavSvc) {

    }
}