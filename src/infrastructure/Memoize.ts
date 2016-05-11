export function memoize(memoized: WeakMap<string,any>){

    return (target, name, descriptor) => {

        let getter = descriptor.get, setter = descriptor.set;

        descriptor.get = function() {
            let table = memoizationFor(memoized, this);
            if (name in table) { return table[name]; }
            return table[name] = getter.call(this);
        };

        descriptor.set = function(val) {
            let table = memoizationFor(memoized, this);
            setter.call(this, val);
            table[name] = val;
        }
    }
}

function memoizationFor(memoized: WeakMap<string,any>, obj) {
    let table = memoized.get(obj);
    if (!table) {
        table = Object.create(null);
        memoized.set(obj, table); 
    }
    return table;
}


