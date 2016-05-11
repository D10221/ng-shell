
import { memoize, invalidate } from "../../src/infrastructure/Memoize";

class Randomist{
    
    _value: number = 0 ;

    @memoize
    get value(): number {
        return  this._value++;
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
       var accessCount = 0 ;
        
       var setValue = (value:number, ok: (prev: number, _new: number )=> boolean )=>{

           if(!ok(last,value) && accessCount!=0){
               throw "It Doesn't work";
           }
           accessCount++;
           last = value;
       };
       
       _.range(100).forEach(()=>{
           setValue(r.value, (_last, _next) =>_last == _next);
       });
        
        invalidate(r,"value");
        
        expect(last != r.value).toEqual(true);
        
       
   });
});
