
import {EventArgs} from "../../infrastructure/interfaces";

import {
    DataSource, iTable, iColumn, iRow, iCell, TableElement, TableElementRole, Visibility,
    Filter, ColumnDefinition
} from "./definitions";

import {layouts} from "./Layout";

import {isVisible, moveElement, Direction}  from './TableElementTools';
import {Cell} from "./Cell";
import {Pager} from "./Pager";

export class TnxTableCtrl implements Rx.Disposable {
    
    data: DataSource; 
    
    table: iTable ;
    
    noData () :boolean { return !this.table || _.isEmpty( this.table.elements) }

    disposables = new Rx.CompositeDisposable();

    pager = new Pager(null);
    
    constructor(private $scope,private $timeout) {
        
        var vm = $scope.source;

        var eBus = (vm.eBus as Rx.Subject<EventArgs>);
        
        this.disposables.add(
            eBus.asObservable()
                .where(e=>e.sender!=this)
                .where(e=>e.args.key=='data')
                .subscribe(e=>{
                    this.rebuild(e);
                })
        );

        eBus.onNext( {
            sender: this, 
            args: { 
                key: 'loaded',
                value: true 
            }});
        
        this.request = (key)=> {

            switch (key) {
                case 'reload':
                    eBus.onNext( { sender: this, args: { key: 'reload', value : 0 /*Page Number?*/ } } );
                    break;
            }
        };
        
        // var watcherDispose = $scope.$watchCollection('table.columns', (newValue, oldValue, scope )=> {
        //     console.log('changed');
        // });

        $scope.$on('$destroy', () => {
            console.log('Table Ctrl disposing');
            // watcherDispose();
            this.dispose();
        });
    }

    rebuild: (e?:EventArgs) => void = (e) => {
        this.data = e? e.args.value  as DataSource: this.data;
        this.table = this.toTable(this.data);
        this.pager.collectionLength = (this.table && this.table.elements && this.table.elements.length) || 0  ;
    };

    dispose: ()=> void = ()=> {
        if(this.disposables){
            this.disposables.dispose();
        }
    };
    
    request(key: string): void {};

    toTable(data: DataSource ) : iTable {
        
        if(!data || !data.key || ! data.items ||  data.items.length < 1 ){
            return null;
        }
        
        var table : iTable = {
            index:  0  , 
            key: data.key ,
            header: data.key,
            id: `table_${data.key}`,
            parent: null, 
            elements : [],
            isSelected: false,
            visibility: Visibility.visible,
            columns: [],
            source: data.items,
            role: TableElementRole.table,
            isEditing: false,
            isDirty: false
        };
        
        table.columns = this
            .makeColumns(table, data.columns);     
        
        table.elements = this
            .makeRows(table);

        return table;
    }
    
    makeColumns(table:iTable, definitions: ColumnDefinition[]): iColumn[] {
        
        var columns = [] ;

        var first = _.first(table.source);
        
        var i = 0 ; 
        
        for(var key in first ){
                         
            var definition = _.find(definitions, d => d.key == key );

            var column = {
                index:  i,
                key: key ,
                header: definition ? definition.header : key,
                id: `${table.id}_column_${key}` /*Guid.newGuid()*/,
                parent: table,
                elements : [],
                isSelected: false,
                visibility: this.ifDefined(
                    definition,
                    'visibility',
                    d=> definition.visibility ,
                    Visibility.visible
                ),
                role: TableElementRole.column,
                filter: {
                    visibility: Visibility.hidden,
                    value: ""
                },
                isEditing: false,
                isDirty: false,
                definition: definition
            };

            layouts.restore(column);

            columns.push( column);
            
            i++;
        }
        
        return _.orderBy(columns, c => c.index );
    }

    ifDefined<T,TR>(x:T , key:string, value : (t:T) => TR , defaultValue?: TR) : TR {
        if(x !=null  && x.hasOwnProperty(key)){
            return value(x)
        }
        return defaultValue /*?? null*/ ;
    };
    
    makeRows(table:iTable){
        
        var index = 0 ;
        
        var rows = [] ;
        
        for(var x of table.source){
            
            var row : iRow = {
                source: x,
                index : index ,
                key: `table_${table.key}_row_${index++}`,
                id: `table_${table.key}_row_${index++}`,//Guid.newGuid(),
                parent: table,
                elements: [] ,
                isSelected: false,
                visibility: Visibility.visible,
                role: TableElementRole.row,
                isEditing: false,
                isDirty: false
            };
            
            row.elements = this.makeCell(row);
            
            rows.push(row)
        }
        
        return rows;
    }
    
    makeCell(row:iRow) : iCell[]{
        
        var cells : iCell[] = [];
        
        for(var column of (row.parent as iTable).columns){
            
            // cells.push( {
            //     index : column.index,
            //     id: `${row.key}_cell_${column.key}`,//Guid.newGuid(),
            //     key: column.key,
            //     value: row.source[column.key],
            //     parent: row,
            //     elements: [],
            //     isSelected: false,
            //     visibility: column.visibility,
            //     role: TableElementRole.cell,
            //     isEditing: false
            // });
            // Class Based its slower , 
            cells.push(new Cell(row, column))
        }
        
        return _.orderBy(cells, cell=>cell.index);
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
        this.$timeout(()=> layouts.save(e));         
        
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
    
    get VisibleElements() : TableElement[] {
        return _.filter(this.table.elements, x=> this.isVisible(x));
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
                    // it could also be ...regex.test(row.source[column.key] ) 
                    // but against source value not cell value , cell value could've been changed
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
    
    dropLayout(e:TableElement){
        layouts.drop(e);
        this.$timeout(this.rebuild(null));
    }

    toggleEditing(x: TableElement, state?: boolean ){
        
        var editingOff = cell=> {
            if(cell.id!= x.id){
                cell.isEditing = false;
            }
        };
        
        var rowEditingOff = row=> (row.elements as iCell[]).forEach(editingOff); 
        
        if(x.role == TableElementRole.cell){
            ((x.parent.parent as iTable).elements as iRow[]).forEach(rowEditingOff);
        }
        
        x.isEditing = _.isUndefined(state) ? !x.isEditing : state == true;
    }
    
    move(e:TableElement, direction: string){
        
        if(e.role == TableElementRole.column){

            moveElement(e.parent.elements, e, direction == 'asc' ? Direction.asc : Direction.desc  ,(source, dest )=> {
                
                this.$timeout(()=>{
                    
                    layouts.save(source);
                    layouts.save(dest);
                    this.rebuild(null);
                })
                 
            });           
                        
        }
    }
}


