

import {EventArgs, IObservableThing, Visibility} from "../../infrastructure/interfaces";
import {memoize, invalidate } from "../../infrastructure/Memoize";
import {ObservableThingProperty} from "../../infrastructure/ObservableThingProperty";

import {firstEquals} from "../../infrastructure/Collections";

interface PageBullet {
    index: number;
    visible: boolean;
}

/***
 * direction : [ 'asc' , 'desc ]
 */
interface iPager {
    nextPage();
    nextPage(n?: number, fast?:boolean );
    nextPage(direction?: string, n?: number, fast?:boolean );
}

var isString = _.isString;

export class Pager implements iPager, IObservableThing, Rx.Disposable  {
    
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

    /***
     * desired max bullets count 
     * @type {number}
     */
    @ObservableThingProperty
    bulletsLen = 5;

    @ObservableThingProperty
    collectionLength :number = 0 ;
    
    constructor(pageLen?: number ) {

        this.id = _.uniqueId('pager_');

        this.pageLen = _.isNumber(pageLen)? pageLen : 10 ;
        
        this.nextPage = this.nextPage.bind(this);
        
        var makeBullets = ()=>{
            var bullets = this.build({
                bulletsLen: this.bulletsLen,
                collectionLen: this.collectionLength
            });
            this.pageBullets =  firstEquals(bullets, this.currentPage)
        };
        
        this.disposables.add(
            this.xEvents.asObservable()
                .where (e=> e.sender == this )
                .where (e=> {
                    return _.includes(['pageLen','currentPage', 'bulletsLen', 'collectionLength'], e.args.key);
                })
                .subscribe( () => {
                   makeBullets()
                })
        );
        
        makeBullets();
    }
     
    disposables = new Rx.CompositeDisposable();
    
    dispose(){
        this.disposables.dispose();
    }

    id :any /*unique*/;


    private build(data: {  bulletsLen: number,  collectionLen: number} ){
        return _.chain(_.range(data.collectionLen))
        //.chunk(data.pageLen)
            .chunk(data.bulletsLen)
            .value();
    }
    
    /***
     * replesents '< [0] [1] [3] ... >' page bullets
     * has to be emoized, or angular crashes , too many changes 
     * @returns {PageBullet[]}
     */
     pageBullets : number[]; 

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
    nextPage(n?: number, fast?:boolean );
    nextPage(direction?: string, n?: number, fast?:boolean );
    nextPage(...params:any[]) {
        
        var pageNo = _.find(params, p=> _.isNumber(p)) ;
        var direction  = _.find(params, p=> isString(p)) || 'asc';
        var fast = _.find(params, p => _.isBoolean(p)) || false;
        
        var multiplier = ((fast==true) ? this.bulletsLen : 1);
        
        var nextPagge =  _.isNumber(pageNo) ? pageNo 
            : direction == 'asc'
                ? this.currentPage + multiplier  
                : this.currentPage - multiplier ;

        var ok = direction == 'asc'
            ? nextPagge * this.pageLen  <= this.collectionLength
            : nextPagge >= 0;
        
        if( !ok )  {
            return;
        }
        
        this.currentPage = nextPagge;
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
