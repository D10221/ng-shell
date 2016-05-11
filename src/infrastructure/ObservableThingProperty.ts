import { IObservableThing} from "./interfaces";

export function ObservableThingProperty(target, key){
    
    var notify = (target,value)=> {
        if(_.isUndefined(target['xEvents'])){
            throw 'target does not implement IObservableThing';
        }
        (target as IObservableThing)
            .xEvents
            .onNext({sender: target, args:{ key: key, value: value}});
    };

    var getter = (target)=> {
        return (target)[`_${key}`];
    };

    var isChanged = (target,value)=> {
        return getter(target) != value;
    };

    var setter = (target, value)=> {
        var fieldKey = `_${key}`;
        (target)[fieldKey] = value;
    };
    
    Object.defineProperty(target, key, {
        get: function() { 
            return getter(this)
        },
        set:  function(value) {
            if (!isChanged(this, value)) {
                return;
            }
            setter(this, value);
            notify(this, value);
        },
        enumerable: true,
        configurable: true
    });
}


