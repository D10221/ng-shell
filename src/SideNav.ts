
export class SideNav {

    isOpen:boolean;

    toggleOpen:()=> void = ()=> this.isOpen = !this.isOpen;

    navItems:any[];

    home = '#/';

    constructor(private $location) {

        this.navItems = [
            {
                icon: 'checked',
                href: '#/view1',
                label: 'view 1'
            },
            {
                icon: 'checked',
                href: '#/view2',
                label: 'view 2'
            }
        ];
    }
    
    go(path){
        this.$location.path(path);
    }
}
