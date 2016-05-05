'use strict';

interface Column {
  header: any ; 
}

class View1Ctrl {
  
  data: any[] = [] ;
  
  static $inject = [ '$scope' ]; // , '$element'

  loaded = false;

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

  columns: Column[] = [];
  
  onDataLoaded(data: any[]){
    
    var first = _.first(data);
      
    for(var key in first){
        this.columns.push( {
        header: key
      })
    }
    

  }
}

angular.module('ngShell.view1', ['ngRoute'])

.config(['$routeProvider', ($routeProvider) => {
  $routeProvider.when('/view1', {
    templateUrl: 'templates/view1/view1.html',
    //controller: 'View1Ctrl as vm'
  });
}])

.controller('View1Ctrl', View1Ctrl );