

import {EventArgs, IObservableThing, Visibility} from "../../infrastructure/interfaces";
import {memoize, invalidate } from "../../infrastructure/Memoize";
import {ObservableThingProperty} from "../../infrastructure/ObservableThingProperty";

interface PageBullet {
    index: number;
    visible: boolean;
}

export class Pager implements IObservableThing, Rx.Disposable  {
    
    /***
     * IObservableThing implementation
     * @type {Subject<EventArgs>}
     */
    xEvents = new Rx.Subject<EventArgs>();
    
    /*pageLen*/
    @ObservableThingProperty
    pageLen: number = 0 ;

    @ObservableThingProperty
    currentPage: number = 0 ;

    @ObservableThingProperty
    bulletsLen = 5;

    @ObservableThingProperty
    collectionLength :number = 0 ;
    
    constructor(pageLen?: number ) {

        this.id = _.uniqueId('pager_');

        this.pageLen = _.isNumber(pageLen)? pageLen : 10 ;
        
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        
        this.disposables.add(
            this.xEvents.asObservable()
                .where (e=> e.sender == this )
                .where (e=> {
                    return _.includes(['pageLen','currentPage', 'bulletsLen', 'collectionLength'], e.args.key);
                })
                .subscribe( () => {
                    invalidate(this, 'pageBullets');
                    console.log(this.pageBullets)
                })
        );
    }
    
    disposables = new Rx.CompositeDisposable();
    
    dispose(){
        this.disposables.dispose();
    }

    id :any /*unique*/;

    /***
     * replesents '< [0] [1] [3] ... >' page bullets
     * has to be emoized, or angular crashes , too many changes 
     * @returns {PageBullet[]}
     */
    @memoize
    get pageBullets () : PageBullet[] {
        return _.chain(_.range(this.pageLen))
            .map(x=> { return {
                index: x,
                visible: true
            }})
            .chunk(this.bulletsLen)
            .value()[ this.currentPage * this.bulletsLen ];
    }

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
        return segment;
    };

    get pageEnd(): number{
        var value = (this.currentPage + 1)  * this.pageLen;
        return this.collectionLength < value  ? this.collectionLength : value ;
    };

    nextPage();
    nextPage(n?: number);
    nextPage(n?: number, fast?:boolean );
    nextPage(x?:any){

        var n = arguments[0];
        var fast = arguments.length > 0  ? arguments[1] : null;
        
        var nextPagge =  _.isNumber(n) ? n : this.currentPage + ((fast==true) ? this.bulletsLen : 1) ;

        var ok = nextPagge * this.pageLen  < this.collectionLength;
        console.log(`nextPagge: ${nextPagge} * pageLen:${this.pageLen } >=  collectionLength:${this.collectionLength} = ok: ${ok}`);
        if( !ok )  {
            return;
        }

        this.currentPage = nextPagge;
        console.log(`currentPage: ${this.currentPage}, starts:${this.pageStart}, ends:=${this.pageEnd}`);
    }

    prevPage () ;
    prevPage(fast:boolean);
    prevPage(fast?:any) {
        var nextPagge = this.currentPage - ( fast == true?  this.bulletsLen : 1 ) ;
        
        if( nextPagge < 0 ){
            return;
        }
        this.currentPage= nextPagge;
        console.log(`currentPage: ${this.currentPage}, starts:${this.pageStart}, ends:=${this.pageEnd}`);
    };

    /***
     * Must be Visible Index
     * to do not affect filtering   
     * @param index
     * @returns {boolean}
     */
    isIndexVisible : (index:number, collectionLength: number) => boolean = (index, collectionLength) => {
        if(_.isNumber(collectionLength)){
            this.collectionLength = collectionLength;
        }
        var result = index >= this.pageStart && index <= this.pageEnd;
        return result;
    };
    
    get visibility(): Visibility {
        var isVisible = this.nOfPages > 1 ? Visibility.visible : Visibility.hidden;
        return isVisible ; 
    }

    get isVisible(): boolean {
        return this. visibility == Visibility.visible;
    }
}
