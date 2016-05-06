interface ComponentHandler {
    upgradeAllRegistered();
    upgradeElements(x:any);
    upgradeDom();
}

declare var componentHandler :  ComponentHandler ;