

import {EventArgs, IObservableThing} from "../../infrastructure/interfaces";
import {Visibility} from "./definitions";
import {memoize} from "../../infrastructure/Memoize";
import {ObservableThingProperty} from "../../infrastructure/ObservableThingProperty";


export class Pager implements IObservableThing {
    /***
     * IObservableThing implementation
     * @type {Subject<EventArgs>}
     */
    xEvents = new Rx.Subject<EventArgs>();
    
    /*pageLen*/
    @ObservableThingProperty
    pageLen: number = 0 ;
    
    constructor(pageLen?: number ) {

        this.id = _.uniqueId('pager_');

        this.pageLen = _.isNumber(pageLen)? pageLen : 10 ;
        
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
    }


    
    currentPage: number = 0 ;
    bulletsLen = 5;
    
    id :any /*unique*/;

    static memoized = new WeakMap<string,any>();
    
    @memoize(Pager.memoized)
    get pageBullets () : {index: number, visible: boolean }[] {
        return _.chain(_.range(this.pageLen))
            .map(x=> { return { index: x, visible: true}})
            .chunk(this.bulletsLen)
            .value()[_.floor( this.currentPage / this.bulletsLen )];
    }
     
    collectionLength :number = 0 ;

    

    raiseNextEvent(key:string, value:any){
        this.xEvents.onNext({
            sender:this,
            args: {
                key: key,
                value: value
            }
        });
    }

    get nOfPages() :number {
        return _.floor(this.collectionLength / this.pageLen );
    }

    get pageStart (): number {
        var segment = this.pageLen*(this.currentPage);
        //var value = segment - this.pageEnd ;
        return segment;
    };

    get pageEnd(): number{
        var value = (this.currentPage + 1)  * this.pageLen;
        return this.collectionLength < value  ? this.collectionLength : value ;
    };

    nextPage();
    nextPage(n?: number, fast?:boolean ){
        var nextPagge =  _.isNumber(n) ? n : this.currentPage + ((fast==true) ? this.bulletsLen : 1) ;
        
        if( nextPagge * this.pageLen  >  this.pageEnd )  {
            return;
        }
        this.currentPage = nextPagge;
        this.raiseNextEvent('next', this.currentPage);
    };

    prevPage () ;
    prevPage(fast:boolean);
    prevPage(fast?:any) {
        var nextPagge = this.currentPage - ( fast == true?  this.bulletsLen : 1 ) ;
        
        if( nextPagge < 0 ){
            return;
        }
        this.currentPage= nextPagge;
        this.raiseNextEvent('prev', this.currentPage);
    };

    /***
     * TODO: Must be Visible Index
     * or better:  filter collection nto hide rows. but it will be slower  
     * @param index
     * @returns {boolean}
     */
    isVisible : (index:number, collectionLength: number) => boolean = (index, collectionLength) => {
        if(_.isNumber(collectionLength)){
            this.collectionLength = collectionLength;
        }
        var result = index >= this.pageStart && index <= this.pageEnd;
        return result;
    };
    
    get visible(): Visibility { return this.nOfPages > 1 ? Visibility.visible : Visibility.hidden ; }
}
