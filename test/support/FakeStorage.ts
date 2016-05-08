///<reference path="../../node_modules/rx/ts/core/es6-iterable.d.ts"/>


export class FakeStorage  implements  Storage {

    get length(): number {
        return this.inner.size;
    };

    clear(){
        this.inner.clear();
    }

    getItem: (key: string) => any = (key)=> {
        return this.inner.get(key);
    };

    key: (index: number)=> string = (index)=> {
        return "";
    };

    removeItem:(key: string)=> void = (key)=>{
        this.inner.delete(key);
    };

    setItem: (key: string, data: string)=> void = (key, data)=>{
        this.inner.set(key, data);
    };

    [key: string]: any ;

    [index: number]: string;

    constructor(private inner?: Map<string,any>){
        this.inner = inner || new Map<string,any>();
    }
}