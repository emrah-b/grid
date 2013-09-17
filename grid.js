(function(angular) {
   var gridModule = angular.module("grid", []);

   var applyFilters = function(rows, columns, evaluationFn) {
      var transformedData = [];
      angular.forEach(rows, function(row) {
         var transformedRow = {};
         angular.forEach(columns, function (column){
            var displayValue =  row[column.field];

            if(column.filter) {
               displayValue = evaluationFn(displayValue + " | " + column.filter);
            }  

            transformedRow[column.field] = displayValue;   
         });
         transformedData.push(transformedRow);
      });
      return transformedData;   
   }

   var i18n = {
      filter: "Aranacak metni giriniz...",
      total: "Toplam",
      prev: "Önceki",
      next: "Sonraki"
   }

   var defaultGridOptions = {
      searching : true,
      selectable: true,
      sorting: true,
      paging: true
   }

   gridModule.directive("grid", function($filter) {
      return {
         restrict: "E",
         replace: true,
         templateUrl: "grid-template.html",
         scope: {
            columns: "=",
            data: "=",
            gridOptions: "=",
            rowClick:"&",
            rowDoubleClick:"&",
            sortExpression: "@"
         },
         link: function(scope, element, attrs, ctrl) {
            // apply display filters
            scope.transformedData = applyFilters(scope.data, scope.columns, scope.$eval);
            scope.i18n = i18n;
            
            scope.options = defaultGridOptions;

            scope.sort = function(column) {
               scope.reverseOrder = scope.sortExpression == column.field && !scope.reverseOrder;
               
               scope.sortExpression = column.field;
            }

            scope.onClick = function(row) {
               scope.toggleRow(row);
               scope.rowClick();
            }

            scope.onDoubleClick = function(row) {
               scope.rowDoubleClick();
            }

            scope.toggleRow = function(row) {
               scope.selectedRow = row;
            }
         }  
      }
   });

})(window.angular);