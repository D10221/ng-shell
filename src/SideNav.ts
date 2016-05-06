
export class SideNav {

    isOpen:boolean;

    toggleOpen:()=> void = ()=> this.isOpen = !this.isOpen;

    navItems:any[];

    constructor() {

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
}
