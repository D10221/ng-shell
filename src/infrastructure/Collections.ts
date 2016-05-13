export function anyEquals<T>(items:T[], x:T) : boolean {
    for(var i  of items){
        if(i == x){
            return true;
        }
    }
    return false;
}


export function firstEquals<T>(itmsCollection: T[][], x:T) : T[] {
    for(var items of itmsCollection){
        if(anyEquals(items, x)){
            return items;
        }
    }
    return null;
}
