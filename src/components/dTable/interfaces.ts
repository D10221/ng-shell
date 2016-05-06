import {Guid} from "../../infrastructure/Guid";
export interface TableElement {
    id: Guid;
    key: string;
    parent: TableElement ;
    elements: TableElement[];
    isSelected: boolean;
    index: number;
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
