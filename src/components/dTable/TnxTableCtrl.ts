
import {EventArgs} from "../../infrastructure/interfaces";
import {Guid} from "../../infrastructure/Guid";
import {
    DataSource, iTable, iColumn, iRow, iCell, TableElement, TableElementRole, Visibility,
    Filter
} from "./definitions";


export class TnxTableCtrl {
    
    data: DataSource; 
    
    table: iTable ;
    
    noData () :boolean { return !this.table || _.isEmpty( this.table.elements) }
    
    constructor(private $scope) {
        
        var vm = $scope.source;

        var eBus = (vm.eBus as Rx.Subject<EventArgs>);
        
        eBus.asObservable()
            .where(e=>e.sender!=this)
            .where(e=>e.args.key=='data')
            .subscribe(e=>{
                this.data = e.args.value  as DataSource;
                this.table  = this.toTable(this.data);
            });

        eBus.onNext( {
            sender: this, 
            args: { 
                key: 'loaded',
                value: true 
            }});
    }

    toTable(data: DataSource ) : iTable {
        
        if(!data || !data.key || ! data.items ||  data.items.length < 1 ){
            return null;
        }
        
        var table : iTable = {
            index:  0  , 
            key: data.key ,
            header: data.key,
            id: Guid.newGuid(),
            parent: null, 
            elements : [],
            isSelected: false,
            visibility: Visibility.visible,
            columns: [],
            source: data.items,
            role: TableElementRole.table
        };
        
        table.columns = this
            .makeColumns(table);     
        
        table.elements = this
            .makeRows(table);
        
        return table;
    }
    
    makeColumns(table:iTable): iColumn[] {
        
        var columns = [] ;

        var first = _.first(table.source);
        
        var i = 0 ; 
        for(var key in first ){
            columns.push( {
                index: i++,
                key: key ,
                header: key,
                id: Guid.newGuid(),
                parent: table,
                elements : [],
                isSelected: false,
                visibility: Visibility.visible,
                role: TableElementRole.column,
                filter:{
                    visibility: Visibility.hidden,
                    value: ""
                }
            })
        }
        
        return columns;
    }
    
    makeRows(table:iTable){
        
        var index = 0 ;
        
        var rows = [] ;
        
        for(var x of table.source){
            
            var row : iRow = {
                source: x,
                index : index ,
                key: `${table.key}_row_${index++}`,
                id: Guid.newGuid(),
                parent: table,
                elements: [] ,
                isSelected: false,
                visibility: Visibility.visible,
                role: TableElementRole.row
            };
            
            row.elements = this.makeCell(row);
            
            rows.push(row)
        }
        
        return rows;
    }
    
    makeCell(row:iRow) : iCell[]{
        
        var cells : iCell[] = [];
        
        for(var column of (row.parent as iTable).columns){
            // 
            cells.push( {
                index : column.index,
                id:Guid.newGuid(),
                key: column.key,
                value: row.source[column.key],
                parent: row,
                elements: [],
                isSelected: false,
                visibility: Visibility.visible,
                role: TableElementRole.cell
            });
        }
        
        return cells;
    }

    toggleSelected(e:TableElement[]):void;
    toggleSelected(e:TableElement):void;
    toggleSelected(e:any): void {

        if(TnxTableCtrl.isTableElement(e)){
            e.isSelected = !e.isSelected;
            return;
        }

        if(_.isArray(e)){
            _.forEach(e, this.toggleSelected )
        }
    }
    
    static isTableElement(x:any) : boolean {
        return x && (x as TableElement).role in [
                TableElementRole.table,
                TableElementRole.column,
                TableElementRole.row,
                TableElementRole.cell
            ];         
    }
    
    toggleVisibility(e: TableElement){

        TnxTableCtrl.toggleVisibilityInternal(e);

        if(e.role == TableElementRole.column) {
            
            var table = e.parent as iTable;
            
            (table.elements as iRow[]).forEach(
                
                row => {
                    
                    (row.elements as iCell[]).forEach(
                        
                        cell=> {
                            if(cell.key == e.key){
                                cell.visibility = e.visibility;
                            }
                        }
                    )
                }
            );
        }


    }

    static toggleVisibilityInternal(e:TableElement) {
        if(e.visibility || e.visibility == 0 ){
            e.visibility = e.visibility == Visibility.visible
                ? Visibility.hidden
                : Visibility.visible;
        }
    }

    isVisible(e:Filter) : boolean;
    isVisible(e:TableElement) : boolean ;
    isVisible(e:any) : boolean {
        return e.visibility == Visibility.visible;
    }


    filterBy(x){
        var column = (x as iColumn);
        var regex = new RegExp(column.filter.value);
        
        var isMatch =(cell:iCell) : boolean => {
            var ok = cell && ! _.isUndefined(cell.value) && regex.test(cell.value.toString());
            return ok;
        };         
        
        if(column && column.filter ){
            ((column.parent as iTable).elements as iRow[])
                .forEach( row => {
                    // it coul dalso be regex.test(row.source[column.key] ) 
                    // but against source value not cell valeu , cell value coul've changed
                    // Not commited yet
                    var cell = _.find((row.elements as iCell[]), cell=> cell.key == column.key );
                    row.visibility = isMatch(cell)? Visibility.visible : Visibility.hidden;
                    
                });
        }
    }

    orderByColumnKey (column:iColumn ) {
        var table = (column.parent as iTable);
        table.reverseOrder = _.isUndefined(table.reverseOrder) ? false : table.reverseOrder;
        table.reverseOrder = table.orderBy == column.key ? !table.reverseOrder : false;
        table.orderBy = column.key;
    }

}
