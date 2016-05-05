
declare interface  ComponentHandler {
    upgradeAllRegistered();
    upgradeElement(e:any);
    upgradeElements(x:any);
}

declare var componentHandler : ComponentHandler ; 

    