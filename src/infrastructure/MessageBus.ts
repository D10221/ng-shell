import {EventArgs} from "./interfaces";

export class MessageBus {

    private bus = new Rx.Subject<EventArgs>();

    publish(args: EventArgs){

        this.bus.onNext(args);
    }

    get listen () : Rx.Observable<EventArgs> {

        return  this.bus.asObservable();
    }

}
