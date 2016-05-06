'use strict';
import {Guid} from "../infrastructure/Guid";

interface TableElement {
    id:Guid;
    key:string;
    isSelected:boolean;
    elements:TableElement[];
    parent:TableElement;
}

interface Table extends TableElement {
    columns:Column[];

}

interface Column extends TableElement {
    header:any ;
}

interface Cell extends TableElement {
    value:any;
}

interface Row extends TableElement {

}

class View1Ctrl {

    constructor($scope) {

        fetch('data/materials.json')
            .then(r=>r.json())
            .then(data=> {
                this.data = data;
                this.onDataLoaded(data);
                this.loaded = true;
                $scope.$apply();
            });
    }

    header = 'Table';

    data:any[] = [];

    static $inject = ['$scope']; // , '$element'

    loaded = false;

    table: Table ;

    onDataLoaded(data:any[]) {

        var table:Table = {
            id: Guid.newGuid(),
            key: 'table',
            isSelected: false,
            elements: [],
            parent: null, 
            columns: []
        };

        var first = _.first(data);

        for (var key in first) {

            table.columns.push({
                id: Guid.newGuid(),
                key: key,
                header: key,
                isSelected: false,
                elements: [],
                parent: table
            });
        }

        var toCell = (row:Row, col:Column, x:{}):Cell => {
            return {
                id: Guid.newGuid(),
                key: col.key,
                value: x[col.key],
                isSelected: false,
                elements: [],
                parent: row
            }
        };

        var toRow = (table:Table, x:{})=> {

            var row = {
                id: Guid.newGuid(),
                key: '',
                elements: [],
                isSelected: false,
                parent: table
            };

            var cells = table.columns.map(col=> toCell(row, col, x));

            row.elements = cells;
            return row;
        };

        table.elements = data.map(x=> toRow(table, x));
        this.table = table;
    }
}

angular.module('ngShell.view1', ['ngRoute'])

    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider.when('/view1', {
            templateUrl: 'templates/view1/view1.html',
            //controller: 'View1Ctrl as vm'
        });
    }])

    .controller('View1Ctrl', View1Ctrl);