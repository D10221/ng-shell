
import {Visibility} from "../../infrastructure/interfaces";
export enum TableElementRole {
    table, column, row, cell
}

export interface TableElement {
    id: any /*Guid?*/;
    key: string;
    parent: TableElement ;
    elements: TableElement[];
    isSelected: boolean;
    visibility: Visibility;
    index: number;
    role: TableElementRole ;
    isEditing: boolean;
    isDirty: boolean;
}

export interface  Filter {
    visibility: Visibility;
    value: string;
}

export interface iTable extends TableElement {
    header : any ;
    source: any[];
    columns:iColumn [] ;
    
    /***
     * Column.Key
     */
    orderBy? : string;
    reverseOrder?: boolean;
}

export interface iColumn extends TableElement {
    header: any;
    filter: Filter ;
    definition?: ColumnDefinition
}

export interface iRow extends TableElement {
    source: {};
}

export interface iCell extends  TableElement {
    value: any;
}

export interface DataSource {
    key: string;
    items: any[];
    columns?: ColumnDefinition[];
}

export interface TableElementLayout {
    key: string ;
    index: number,
    visibility: Visibility,
    //enabled: boolean,
    selected: boolean,
    elements : TableElementLayout[]
}

export interface ColumnDefinition {
    key: string;
    index?:number;
    header?:any;
    getter?:(cell:iCell) => any;
    setter:(cell:iCell , value:any) => void,
    disabledFeatures?:string[];
    visibility?: Visibility;
    //configureCell?:(cell) => void;
    //commandAction?:(col:Column ,  parameter: any) => void;
    //inputType?: string;
}