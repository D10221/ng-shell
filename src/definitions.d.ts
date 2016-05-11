///<reference path="../node_modules/typescript/lib/lib.es7.d.ts"/>

interface ComponentHandler {
    upgradeAllRegistered();
    upgradeElements(x:any);
    upgradeDom();
}

declare var componentHandler :  ComponentHandler ;