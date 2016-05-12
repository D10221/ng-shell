
import {ObservableThingProperty} from "../../src/infrastructure/ObservableThingProperty";
import {EventArgs, IObservableThing} from "../../src/infrastructure/interfaces";

class WithProperties implements IObservableThing{

    /***
     * IObservableThing implementation
     * @type {Subject<EventArgs>}
     */
    xEvents = new  Rx.Subject<EventArgs>();
    
    @ObservableThingProperty
    prop:any ;
}

describe('ObservableThingProperty',()=>{
    
    it('works',()=>{

        var target = new WithProperties();

        var eventValue = null;

        target.xEvents.asObservable()
            .where(e=> e.args.key == 'prop')
            .subscribe(e=>{
               // console.log(e);
               eventValue = e.args.value;
            });

        target.prop = 'x';
        
        expect(target.prop).toEqual('x');
        expect(target['_prop']).toEqual('x');
        expect(eventValue).toEqual('x');
    });
    
});
