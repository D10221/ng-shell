export

class SideNavSvc {

    isOpen:boolean = true;

    toggleOpen:()=> void = ()=> {
        this.isOpen = !this.isOpen;
    };

    navItems = [
        {
            href: '#/view1',
            label: 'view 1',
            icon: 'checked'
        },
        {
            href: '#/view2',
            label: 'view 2',
            icon: 'checked'
        }]
}
