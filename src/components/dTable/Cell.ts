import {iCell, iRow, TableElementRole, iColumn} from "./definitions";
import {Guid} from "../../infrastructure/Guid";

export class Cell implements iCell {

    constructor(
        public row: iRow,
        public column :iColumn) {
        
        if(column.definition && column.definition.getter){
            this.getter = column.definition.getter;
        }
        
        this._value = this.getter(this);
    }
    
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
    
    setter(cell:iCell,value: any) : void{
        (cell.parent as iRow).source[cell.key] = value; 
    }

    commit(): void {
        this.setter(this, this.value);
        this.isDirty = false;
    }

    undo(){
        this.value = this.getter(this);
    }

    _isDirty:boolean;
    
    get isDirty(): boolean {
        return this._isDirty ;
    }
    
    set isDirty(value: boolean){
        this._isDirty = value;
        this.parent.isDirty = _.some(this.parent.elements, e=>e.isDirty);
    }
    
    parent =  this.row;
    elements =  [];
    isSelected =  false ;
    visibility =  this.column.visibility;
    role = TableElementRole.cell;
    
    isEditing: boolean = false;
}
