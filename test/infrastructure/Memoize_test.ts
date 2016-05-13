
import { memoize, invalidate } from "../../src/infrastructure/Memoize";

class Randomist{
    
    _value: number = 0 ;

    @memoize
    get value(): number {
        return  this._value+= 1 ;
    }
    
    @memoize
    get other(): any {
        return null;
    }
}

describe('Memoize', ()=>{
   
    it('Works',()=>{
      var r = new Randomist();
       
       var last : number = null ;
       _.range(100).forEach((n)=>{
           
           if(n >= 99) {
               invalidate(r,"value");
               last = r.value;
               return;
           }
           
           if( r.value != last && last != null){
               throw "It Doesn't work";
           }
           last = r.value;
       });
        
       expect(r.value).toEqual(1);

    });
});
