import {TableElement, Visibility, iTable, TableElementRole} from "./definitions";

export function isVisible(e: TableElement) :boolean{
    return e.visibility == Visibility.visible;
}

export enum Direction {
    //left,right,up,down
    desc, asc
}

export function nextVisible(elements: TableElement[],source:TableElement, direction: Direction ) : TableElement {
    
    if(direction == Direction.desc) {
        return findNextDesc(elements, source.index);
    }
    
    if(direction == Direction.asc){
        return findNextAsc(elements, source.index);
    }
    
    return null;
}

export function findNextDesc(elements: TableElement[] ,n: number) {
    var visible = _.chain(elements)
        .filter(isVisible)
        .orderBy(x=> x.index, 'desc')
        .value();
    
    return _.find(visible, (x:TableElement) => x.index <  n);
}

export function findNextAsc(elements: TableElement[],n: number) {
    var visible = _.chain(elements)
        .filter(isVisible)
        .orderBy(x=>x.index, 'asc')
        .value();
    
    return _.find(visible, (x:TableElement)=>  x.index > n );
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
