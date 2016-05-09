
import {TableElement, TableElementLayout, TableElementRole, iTable} from "./definitions";


export class Layouts {
    
    constructor(private prefix?: string) {
        this.prefix = this.prefix || 'tnx';
    }
    
    store : Storage = localStorage;

    static roleName(e:TableElement) : string {
        
        if(e.role == TableElementRole.table) {
            return 'table';
        } 
        
        if(e.role == TableElementRole.column) {
            return 'column';
        }
        
        if(e.role == TableElementRole.row) {
            return 'row';
        }
        
        if(e.role == TableElementRole.cell) {
            return 'cell';
        }
        
        throw 'role not found';
    }
    
    elementKey(e:TableElement): string {
        
        if(e.role == TableElementRole.table){
            return `${this.prefix}_${Layouts.roleName(e)}_${e.key}`;
        }
        if(e.role == TableElementRole.column){
            return `${this.prefix}_table_${e.parent.key}_${Layouts.roleName(e)}_${e.key}`;
        }
        if(e.role == TableElementRole.row){
            return `${this.prefix}_table_${e.parent.key}_${Layouts.roleName(e)}_${e.key}`;
        }
        if(e.role == TableElementRole.cell){
            return `${this.prefix}_table_${e.parent.parent.key}_row_${e.parent.key}_${Layouts.roleName(e)}_${e.key}`;
        }
        
    }
    
    getLayout(e:TableElement) : TableElementLayout {
        return JSON.parse(this.store.getItem(layouts.elementKey(e)));
    }
    
    restore(e:TableElement) {
        var x = this.getLayout(e);
        if(x){
            return Layouts.applyLayout(e, x);
        }
    }

    save: (e:TableElement) => void = (e)=> {

        // if(e.role == TableElementRole.column) {
        //
        //     var table = e.parent as iTable;
        //
        //     table.columns.forEach(c=>{
        //         layouts.save(c)
        //     });
        //
        //     layouts.save(table);
        // }
        
        var layout = Layouts.toLayout(e);
        this.store.setItem(layouts.elementKey(e), JSON.stringify(layout));
    };

    drop :(e: TableElement)=> void = (e)=> {
        if(e.role == TableElementRole.table){
            (e as iTable).columns.forEach(this.drop);
        }
        this.store.removeItem(this.elementKey(e));
    };

    
    fromJson(json:string) : TableElementLayout {

        var element = JSON.parse(json);
        // if(!element || !element.elements) return element ;
        // element.elements = element.elements.map(e=> this.fromJson(e));
        return element
    }
    
    static toLayout(e:TableElement):TableElementLayout {
        
        return {
            key: e.key,
            index: e.index,
            visibility: e.visibility,
            // enabled: e.enabled,
            selected: e.isSelected,
            elements : _.chain(e.elements)
                //not serializing cells
                .filter(e=>e.role != TableElementRole.cell)
                .map(x=> Layouts.toLayout(x))
                .value()
        };
    }

    static applyLayout(e:TableElement, layout: TableElementLayout) {

        if(!layout) {
            return ;
        }

        e.key = layout.key;
        e.index = layout.index;
        e.visibility = layout.visibility;
        //e.enabled(layout.enabled);
        e.isSelected = layout.selected;
        for(var element of e.elements){
            Layouts.applyLayout(element, _.find(layout.elements, l=>l.key == element.key));
        }
    }
}

export var layouts = new Layouts();
