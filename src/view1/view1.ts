'use strict';
import {EventArgs} from "../infrastructure/interfaces";

class View1Ctrl implements Rx.Disposable {
     
    eBus = new Rx.Subject<EventArgs>();
    
    data: any ; 
    
    disposables = new Rx.CompositeDisposable();
    
    constructor($scope, $timeout: ng.ITimeoutService) {

        this.eBus.asObservable()
            .where(e=> e.sender != this)
            .where(e=> e.args.key == "loaded")
            .take(1) // No Need to Dispose 
            .subscribe( x => {
                this.eBus.onNext({ sender: this,  args: { key : 'data', value: this.data }});
            });

        this.disposables.add(
            this.eBus.asObservable()
                .where(e=>e.sender!=this)
                .where(e=> e.args.key == 'reload')
                .subscribe(()=>{
                    //this.data.key += '.';
                    this.eBus.onNext({ sender: this,  args: { key : 'data', value: this.data }});
                })
        );
        
        fetch('data/stock.json')
            .then(r=>r.json())
            .then(data=> {
                
                this.data = {
                    key: "Stock",
                    items: data,
                    columns: [
                        {
                            key: 'Description_1',
                            header: 'Description'
                        }
                    ]
                };
                
                this.eBus.onNext({ sender: this,  args: { key : 'data', value: this.data }});
            });
        
        // $timeout(()=>{
        //     this.eBus.onNext({ sender: this,  args: { key : 'data', value: this.data }});
        // }, 500);

        $scope.$on('$destroy', () => {
            console.log('View1Ctrl disposing');
            // watcherDispose();
            this.dispose();
        });
    }
    
    dispose : ()=> void = ()=> {
      this.disposables.dispose();  
    };
}

angular.module('ngShell.view1', ['ngRoute'])

    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider.when('/view1', {
            templateUrl: 'templates/view1/view1.html',
            //controller: 'View1Ctrl as vm'
        });
    }])

    .controller('View1Ctrl', View1Ctrl);