import {SideNav} from "./SideNav";

export class NgShellRoot {

    brand = 'Tini-X';
    
    constructor($scope,public sideNav:SideNav) {
        fetch('data/app_settings.json').then(r=>r.json()).then(data=> {
            this.brand = data.brand;
            $scope.$apply();
        })
    }
}