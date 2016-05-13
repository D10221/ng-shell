
declare interface ComponentHandler {
    upgradeAllRegistered();
    upgradeElements(x:any);
    upgradeDom();
}

declare var componentHandler :  ComponentHandler ;

declare interface SnackBarMessageData {
    message : string;
    timeout: number ;
    actionHandler: ()=> void;
    actionText
}

declare interface MaterialSnackbar {
    showSnackbar ( data: SnackBarMessageData) ;
}

declare interface MaterialSnackBarContainer extends HTMLElement{
    MaterialSnackbar: MaterialSnackbar
}
