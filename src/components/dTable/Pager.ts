import {EventArgs} from "../../infrastructure/interfaces";

export class Pager {

    id :any /*unique*/;

    bulletsLen = 5;

    get pageBullets () : number[] {
        return _.chain(_.range(this.pageLen))
            .chunk(this.bulletsLen)
            .value()[_.floor( this.currentPage / this.bulletsLen )]
    }

    constructor(collection:any[], pageLen?: number ) {
        this.id = _.uniqueId('pager_');
        this.pageLen = pageLen || 10 ;
        //***
        this.collection = collection;
    }

    private _collection: any[] ;

    get collection():any[] {
        return this._collection;
    }

    set collection(value: any[]){
        this._collection = value || [] ;
        this.onCollectionChanged();
    }

    onCollectionChanged:()=> void = ()=> {
        this.currentPage = 0 ;
        this.pageLen = this.pageLen || 10 ;
    };

    pageEvents = new Rx.Subject<EventArgs>();

    nextPageEvent(key:string, value:any){
        this.pageEvents.onNext({
            sender:this,
            args: {
                key: key,
                value: value
            }
        });
    }

    pageLen: number;

    get nOfPages() :number {
        var collectionLen = this.getCollectionLen();
        return collectionLen > 1 ? collectionLen / this.pageLen : 1 ;
    }

    get pageStart (): number {
        return this.pageEnd - this.pageLen;
    };

    get pageEnd(): number{
        return (this.currentPage +1 /*Zero vs One*/)  * this.pageLen;
    };

    currentPage: number;

    getCollectionLen : () => number = () => {
        if(this.collection && this.collection.length )
        return this.collection.length ;
        return 1;
    };
    
    nextPage:(n?: number, fast?:boolean ) => void =(n,fast)=> {

        var nextPagge =  n || n==0 ? n : this.currentPage + ((fast==true) ? this.bulletsLen : 1) ;
        
        if( nextPagge * this.pageLen  >  this.getCollectionLen() - this.pageLen )  {
            return;
        }
        
        this.currentPage = nextPagge;
        this.nextPageEvent('next', this.currentPage);
    };

    prevPage: (fast?:boolean) => void = (fast ) => {
        var nextPagge = this.currentPage - ( fast == true?  this.bulletsLen : 1 ) ;
        if( nextPagge < 0  ){
            return;
        }
        this.currentPage= nextPagge;
        this.nextPageEvent('prev', this.currentPage);
    };

    /***
     * TODO: Must be Visible Index
     * or better:  filter collection nto hide rows. but it will be slower  
     * @param index
     * @returns {boolean}
     */
    isVisible : (index:number) => boolean = (index) => {
        return index >= this.pageStart && index <= this.pageEnd;
    }
}
