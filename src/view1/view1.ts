'use strict';
import {EventArgs} from "../infrastructure/interfaces";

class View1Ctrl {

        
    eBus = new Rx.Subject<EventArgs>();
    
    data: any ; 
    
    constructor($scope, $timeout: ng.ITimeoutService) {

        this.eBus.asObservable()
            .where(e=> e.sender != this)
            .where(e=> e.args.key == "loaded")
            .take(1)
            .subscribe( x => {
                this.eBus.onNext({ sender: this,  args: { key : 'data', value: this.data }});
            });

        this.eBus.asObservable()
            .where(e=>e.sender!=this)
            .where(e=> e.args.key == 'reload')
            .subscribe(()=>{
                //this.data.key += '.';
                this.eBus.onNext({ sender: this,  args: { key : 'data', value: this.data }});
            });
        
        fetch('data/stock.json')
            .then(r=>r.json())
            .then(data=> {
                
                this.data = {
                    key: "Stock",
                    items: data
                };
                this.eBus.onNext({ sender: this,  args: { key : 'data', value: this.data }});
            });
        
        // $timeout(()=>{
        //     this.eBus.onNext({ sender: this,  args: { key : 'data', value: this.data }});
        // }, 500);
    }
    
}

angular.module('ngShell.view1', ['ngRoute'])

    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider.when('/view1', {
            templateUrl: 'templates/view1/view1.html',
            //controller: 'View1Ctrl as vm'
        });
    }])

    .controller('View1Ctrl', View1Ctrl);