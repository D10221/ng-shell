import {TableElement, Visibility, iTable, TableElementRole} from "./definitions";

export function isVisible(e: TableElement) :boolean{
    return e.visibility == Visibility.visible;
}

export enum Direction {
    left,right,up,down
}

export function nextVisible(elements: TableElement[],source:TableElement, direction: Direction ) : TableElement {
    
    var order = direction == Direction.left ? 'desc' : 'asc';

    var collection = _.chain(elements).filter(c=> isVisible(c)).orderBy(c=>c.index, order ).value();
    
    return _.find( collection,
        column=> direction == Direction.left
            ? c=> c.index < source.index
            : c=> c.index > source.index);
}

export function moveElement(
    
    elements: TableElement[],
    source:TableElement, 
    direction: Direction , 
    onSuccess: (source: TableElement, destination: TableElement)=> void ){
    
    var found = nextVisible(elements,source, direction);

    if(found) {

        var next  = found.index;
        found.index = source.index;
        source.index = next;

        onSuccess(source, found);
    }    
}
