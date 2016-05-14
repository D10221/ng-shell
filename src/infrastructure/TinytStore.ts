export class TinytStore<T> {

    /*
     interface Storage {
     length: number;
     clear(): void;
     getItem(key: string): any;
     key(index: number): string;
     removeItem(key: string): void;
     setItem(key: string, data: string): void;
     [key: string]: any;
     [index: number]: string;
     }
     */

    prefix = "tinyx";

    private storage:Storage ; 
    
    constructor(private key:string, storage?:Storage) {

        this.storage = storage || localStorage;

        this.getItem = ()=> {

            try {
                return <T>JSON.parse(storage[`${this.prefix}.${this.key}`]);
            } catch (e) {
                return null;
            }
        };

        this.setItem = (item)=> {
            storage[`${this.prefix}.${key}`] = JSON.stringify(item);
        };

    }

    getItem:()=> T;

    setItem:(item:T) => void;

    deleteItem: (item:T) => void = (item ) =>  {
        this.storage.removeItem(`${this.prefix}.${this.key}`);
    }
}
