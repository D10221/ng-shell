import {Guid} from "../../infrastructure/Guid";

export enum TableElementRole {
    table, column, row, cell
}

export enum Visibility {
    visible, hidden 
}

export interface TableElement {
    id: Guid;
    key: string;
    parent: TableElement ;
    elements: TableElement[];
    isSelected: boolean;
    visibility: Visibility;
    index: number;
    role: TableElementRole ;
    isEditing: boolean;
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
    getter?:(item:{}) => any;
    disabledFeatures?:string[];
    visibility?: Visibility;
    //configureCell?:(cell) => void;
    //commandAction?:(col:Column ,  parameter: any) => void;
    //inputType?: string;
}