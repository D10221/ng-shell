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
}

export interface iTable extends TableElement {
    header : any ;
    source: any[];
    columns:iColumn [] ;
}

export interface iColumn extends TableElement {
    header: any;
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
}
