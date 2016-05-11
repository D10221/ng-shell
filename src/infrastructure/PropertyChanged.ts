import {IHaveBackingFields, IHaveEvents} from "./interfaces";

export function PropertyChanged(target, name, descriptor){
         
    var notify = (target,value)=> {
        (target as IHaveEvents).pageEvents.onNext({sender: target, args:{ key: name, value: value}});
    };
    var changed = (target,value)=> {
        return (target as IHaveBackingFields).backingFields.get(name) != value;
    };
    
    var setter = (target, value)=> (target as IHaveBackingFields).backingFields.set(name, value);
    var getter = (target)=> (target as IHaveBackingFields).backingFields.get(name);
    
    descriptor.get = function() {
        return getter(this)
    };

    descriptor.set = function(value) {

        if (!changed(this, value)) { 
            return;
        }
        setter(this, value);
        notify(this, value);
    }
}
