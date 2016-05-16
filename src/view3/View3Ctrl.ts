import {ObservableController} from "../infrastructure/ObservableController";

import {DialogOptions, IDialogCommand} from "../components/dialog/dialog";
import {ObservableThingProperty} from "../infrastructure/ObservableThingProperty";
import {IObservableThing} from "../infrastructure/interfaces";
import {ObservableThing} from "../infrastructure/ObservableThing";


enum UniverseState {
    ok, destroyed
}

enum UniverseDestructorState{
    ready, inProgress, cancelled, completed
}


interface Universe extends IObservableThing{
    state: UniverseState ;
}

class SomeUniverse extends ObservableThing implements  Universe {
    
    @ObservableThingProperty
    state= UniverseState.ok; 
}

export class View3Ctrl extends ObservableController {

    destroyer = new UniverseDestroyer() ;

    universe =  new SomeUniverse();

    constructor($scope) {
        
        super($scope);
        
        this.disposables.add(
            this.destroyer.xEvents
                .asObservable()
                .where( e=> e.args.key == "state"
                    && e.args.value == UniverseDestructorState.completed
                )
                .subscribe(()=>{
                    this.universe.state = UniverseState.destroyed;
                })
        );
    }


    destroyTheUniverse() {

        if(this.universe.state == UniverseState.destroyed){
            this.raiseEvent('show', {
                idx: 'universe-destroy-dialog',
                header: 'Sorry'
            });
            return;
        }

        this.raiseEvent('show',
            <DialogOptions>{
                idx: 'universe-destroy-dialog',
                header: 'confim',
                commands: <IDialogCommand[]> [
                    this.destroyCommand,
                    this.cancelDestructionCommand
                ]
            });
    }

    destroyCommand =  {
        text: 'ok',
        exec: x => {
            this.destroyer.destroy();
            //return close
            return true;
        },
        canExec: x=> this.universe.state != UniverseState.destroyed
    };

    cancelDestructionCommand  = {
        text: 'cancel',
        exec: x => {
            this.destroyer.cancel();
            //let know dialog can close
            return true;
        }
    };

}

class UniverseDestroyer extends ObservableThing{

    @ObservableThingProperty
    state: UniverseDestructorState = UniverseDestructorState.ready;

    @ObservableThingProperty
    countDown ;

    constructor() {
        super();
       
        this.disposables.add(
            this.xEvents.asObservable()
                .where(e=>e.args.key == 'state'
                    && e.args.value == UniverseDestructorState.inProgress
                )
                .subscribe(()=>{
                    var count = 9;
                    Rx.Observable
                        .interval(1000)
                        .takeWhile(e=> this.state != UniverseDestructorState.cancelled)
                        .take(10)
                        .subscribe(()=>{
                            this.countDown = count--;
                        })
                })
        );
        
        this.disposables.add(
            this.xEvents.asObservable()
                .where(e=>
                        e.args.key == 'countDown'
                        && e.args.value == 0 )
                //.take(1)
                .subscribe(()=>{
                    this.state = UniverseDestructorState.completed
                })
        );
    }

    destroy(){
        this.state = UniverseDestructorState.inProgress;
    }
    
    cancel(){
        this.state = UniverseDestructorState.cancelled
    }
}

