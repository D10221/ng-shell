
import {TableElement, TableElementLayout} from "./definitions";


class Layouts {

    restore(table:TableElement) {
        var x = localStorage.getItem(`tnx_table_${table.key}`);
        if(x){
            return Layouts.setLayout(table, x);
        }
    }

    save(table:TableElement){
        var layout = Layouts.getLayout(table);
        localStorage.setItem(`tnx_table_${table.key}`, JSON.stringify(layout));
    }

    drop(table: TableElement){
        localStorage.removeItem(`tnx_table_${table.key}`);
    }

    getTable(key:string) : TableElementLayout  {
        return this.fromJson(localStorage.getItem(`tnx_table_${key}`));
    }

    fromJson(json:string) : TableElementLayout {

        var element = JSON.parse(json);
        // if(!element || !element.elements) return element ;
        // element.elements = element.elements.map(e=> this.fromJson(e));
        return element
    }

    getColumn : (dataSourceKey:string, columnKey : string) => any = (dataSourceKey,columnKey) => {

        var table = this.getTable(dataSourceKey);
        if(!table || ! table.elements) return null;

        var found = _.find(table.elements, row =>  _.some(row.elements, cell=> cell.key == columnKey) != null );
        return found ?
            _.find(found.elements, x=>x.key == columnKey )
            : null ;
    };

    static getLayout(e:TableElement):TableElementLayout {
        
        return {
            key: e.key,
            index: e.index,
            visibility: e.visibility,
           // enabled: e.enabled,
            selected: e.isSelected,
            elements : e.elements.map(x=> Layouts.getLayout(x))
        };
    }

    static setLayout(e:TableElement,layout: TableElementLayout) {

        if(!layout) {
            return ;
        }

        e.key = layout.key;
        e.index = layout.index;
        e.visibility = layout.visibility;
        //e.enabled(layout.enabled);
        e.isSelected = layout.selected;
        for(var element of e.elements){
            Layouts.setLayout(element, _.find(layout.elements, l=>l.key == element.key));
        }
    }
}

export var layouts = new Layouts();
