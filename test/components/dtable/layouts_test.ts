///<reference path="../../../typings/lodash/lodash.d.ts"/>
///<reference path="../../../typings/karma/karma.d.ts"/>
///<reference path="../../../typings/jasmine/jasmine.d.ts"/>

import {Guid} from "../../../src/infrastructure/Guid";
import {Visibility, TableElementRole, TableElement} from "../../../src/components/dTable/definitions";
import {Layouts} from "../../../src/components/dTable/Layout";
import {FakeStorage} from "../../support/FakeStorage";

/*interface Storage {
    length: number;
    clear(): void;
    getItem(key: string): any;
    key(index: number): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
    [key: string]: any;
    [index: number]: string;
}*/


describe('layouts', function () {
    
    it('works', function(){

        var layouts = new Layouts(/*prefix:*/ 'tnxTest');
        
        layouts.store = new FakeStorage();
        
        var e : TableElement = {
            id: Guid.newGuid(),
            key: 'testKey',
            parent: null, 
            elements: [],
            isSelected: false,
            visibility: Visibility.visible,
            index: 0 ,
            role: TableElementRole.table,
            isEditing: false,
            isDirty: false
        };

        var elementKey = 'tnxTest_table_testKey';
        
        expect(layouts.elementKey(e)).toEqual(elementKey);
        
        expect(Layouts.toLayout(e).visibility ).toEqual(Visibility.visible);
        
        layouts.save(e);
        
        var layout = layouts.getLayout(e);
        
        expect(layout.key).toEqual(e.key);
        expect(layout.visibility).toEqual(e.visibility);
        
        e.visibility = Visibility.hidden;
        
        layouts.restore(e);
        
        expect(e.visibility).toEqual(Visibility.visible);
        
        
    })
    
});
