
import {Pager} from "../../../src/components/dTable/Pager";

describe('Pager', ()=>{
   //
    it('Works', ()=>{

        var collection = _.range(100);
        var pager = new Pager(collection);
        expect(pager.nOfPages).toEqual(10);
        expect(pager.currentPage).toEqual(0);
        expect(pager.pageEnd).toEqual(10);
        expect(pager.pageStart).toEqual(0);
        //Bullets
        expect(pager.pageBullets.length).toEqual(5);
        //
        expect(_.join(pager.pageBullets, '')).toEqual('01234');

        var currentPage = 0 ;
        var pageChanged =
        pager.pageEvents.asObservable()
            .where(e=>e.args.key == 'next' || e.args.key == 'prev' )
            .subscribe(e=>{
             currentPage  = e.args.value;
            //console.log(`${e.args.key} : currentPage: ${currentPage}`)
        });

        pager.nextPage();

        expect(pager.nOfPages).toEqual(10);
        expect(pager.currentPage).toEqual(1);
        expect(pager.pageStart).toEqual(10);
        expect(pager.pageEnd).toEqual(20);
        expect(currentPage).toEqual(1);

        pager.prevPage();

        expect(pager.nOfPages).toEqual(10);
        expect(pager.currentPage).toEqual(0);
        expect(pager.pageStart).toEqual(0);
        expect(pager.pageEnd).toEqual(10);
        expect(currentPage).toEqual(0);

        //Should do Nothing
        pager.prevPage();
+
        expect(pager.nOfPages).toEqual(10);
        expect(pager.currentPage).toEqual(0);
        expect(pager.pageStart).toEqual(0);
        expect(pager.pageEnd).toEqual(10);
        expect(currentPage).toEqual(0);

        //Exceed Upper Limit
        _.range(20).forEach(n=>{
//            console.log('next');
            pager.nextPage();
        });
        //Never Changes: 1 based , targets foreach
        expect(pager.nOfPages).toEqual(10);
        //Last Page: Zero Based, holds last segment
        expect(pager.currentPage).toEqual(9);
        //Last Page Start
        expect(pager.pageStart).toEqual(90);
        // Last Segment : upto last item
        expect(pager.pageEnd).toEqual(100);
        //
        expect(currentPage).toEqual(9);
        //
        expect(pager.pageBullets.length).toEqual(5);
        expect(_.join(pager.pageBullets, '')).toEqual('56789');

        pageChanged.dispose();


   }); 
});

