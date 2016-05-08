import {iCell, iRow, TableElementRole, iColumn} from "./definitions";
import {Guid} from "../../infrastructure/Guid";

export class Cell implements iCell {

    index  =  this.column.index ;
    id = Guid.newGuid() ;
    key =  this.column.key ;

    private _value: any ;

    get value() : any {
        return this._value;
    }

    set value(val: any) {
        if(this._value == val ) return ;
        this._value= val;
        this.isDirty = this.getter(this) != val ;
    }

    getter (cell:iCell) : any {
        var value = (cell.parent as iRow).source[this.key];
        return value;
    }

    commit(): void {
        (this.parent as iRow).source[this.key] = this.value;
    }

    undo(){
        this.value = this.getter(this);
    }

    isDirty: boolean = false ;
    parent =  this.row;
    elements =  [];
    isSelected =  false ;
    visibility =  this.column.visibility;
    role = TableElementRole.cell;

    constructor(
        public row: iRow,
        public column :iColumn) {
        this._value = this.row.source[this.column.key];

    }

    isEditing: boolean = false;
}
