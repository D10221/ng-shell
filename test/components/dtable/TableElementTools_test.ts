import {
    nextVisible, findNextAsc, findNextDesc, Direction,
    isVisible
} from '../../../src/components/dTable/TableElementTools';

import {TableElement, Visibility, TableElementRole} from "../../../src/components/dTable/definitions";

import 'lodash';

describe('TableElementTools', ()=> {

    describe('nextVisible', ()=> {

        it('works', ()=>{
            
            var elements: TableElement[] = _.range(10).map(n=> {
                return {
                    id: `${n}`,
                    key: `${n}`,
                    parent: null,
                    elements: [],
                    isSelected: false,
                    visibility: Visibility.visible,
                    index: n,
                    role: TableElementRole.column,
                    isEditing: false,
                    isDirty: false
                }
            });

            // var visibles = _.chain(elements)
            //     .filter(isVisible)
            //     .orderBy(x=> x.index, 'asc')
            //     .value() as TableElement[];
            //
            // var f = _.find(visibles, x => x.index >  0 );
            //
            // expect(f.index).toEqual(1);
            
            var found = findNextAsc(elements, 0);
            expect(found).toBeDefined();
            expect(found.index).toEqual(1);
            
            found = findNextDesc(elements, 1);
            expect(found).toBeDefined();
            expect(found.index).toEqual(0);
            
            found = nextVisible(elements, elements[0], Direction.asc);
            expect(found).toBeDefined();
            expect(found.index).toEqual(1);

            found = nextVisible(elements, elements[1], Direction.desc);
            expect(found).toBeDefined();
            expect(found.index).toEqual(0);
            
        })
    })

});
