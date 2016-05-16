import {EventArgs, IObservableThing} from "./interfaces";
export class ObservableThing implements IObservableThing, Rx.Disposable{

    xEvents = new Rx.Subject<EventArgs>();

    disposables = new Rx.CompositeDisposable();

    dispose(){
        this.disposables.dispose();
    }

    raiseEvent(key:string, value?: any){
        this.xEvents.onNext({
            sender: this,
            args: { key: key, value: value }
        })
    }
}