///<reference path="../../../node_modules/rx/ts/rx.all.d.ts"/>

import {Pager} from "../../../src/components/dTable/Pager";
import {Visibility} from "../../../src/infrastructure/interfaces";


describe('Pager', ()=> {
    //
    it('DefaultValues', ()=> {
        var pager = new Pager();
        expect(pager.nOfPages).toEqual(0, 'NoOfPages');
        expect(pager.currentPage).toEqual(0);
        expect(pager.pageStart).toEqual(0);
        expect(pager.pageEnd).toEqual(0);
        expect(pager.visibility).toEqual(Visibility.hidden)
    });

    it('Visibility', ()=> {
        var pager = new Pager();
        pager.collectionLength = 9;
        pager.pageLen = 3;
        expect(pager.visibility).toEqual(Visibility.visible);
        pager.collectionLength = 3;
        pager.pageLen = 9;
        expect(pager.visibility).toEqual(Visibility.hidden);
        pager.collectionLength = 1;
        pager.pageLen = 1;
        expect(pager.visibility).toEqual(Visibility.hidden);
        pager.collectionLength = 10;
        pager.pageLen = 1;
        expect(pager.visibility).toEqual(Visibility.visible);
    });

    it('PageStarts-Ends', ()=> {
        var pager = new Pager();
        expect(pager.pageStart).toEqual(0);
        expect(pager.pageEnd).toEqual(0);
        pager.collectionLength = 3;
        expect(pager.pageStart).toEqual(0);
        expect(pager.pageEnd).toEqual(3);
        pager.collectionLength = 11;
        expect(pager.pageStart).toEqual(0);
        expect(pager.pageEnd).toEqual(/*default value*/10);
        pager.nextPage();
        expect(pager.currentPage).toEqual(1);
        expect(pager.pageStart).toEqual(10);
        expect(pager.pageEnd).toEqual(11);

        pager.prevPage();
        expect(pager.currentPage).toEqual(0);
        expect(pager.pageStart).toEqual(0);
        expect(pager.pageEnd).toEqual(10);

    });

    it("VisibleIndex", ()=> {
        var pager = new Pager(/*pageLen*/3);
        pager.collectionLength = 3;
        expect(pager.isIndexVisible(0, null)).toEqual(true);
        expect(pager.isIndexVisible(1, null)).toEqual(true);
        expect(pager.isIndexVisible(2, null)).toEqual(true);
        expect(pager.isIndexVisible(3, null)).toEqual(true);
        expect(pager.isIndexVisible(4, null)).toEqual(false);

        expect(pager.isIndexVisible(3, 0)).toEqual(false);
        expect(pager.isIndexVisible(/*index*/3, /*collectionLength*/1))
            .toEqual(false);
        expect(pager.isIndexVisible(3, 2)).toEqual(false);
    });
    
    it('Bullets', ()=> {
        var pager = new Pager();
        pager.collectionLength = 1;
        expect(pager.pageBullets.length ).toEqual(5);
        var expected = _.range(5).map(x=> 'true').join('');
        expect(pager.pageBullets.map(x=> x.visible).join(''))
            .toEqual(expected);

    })
});

