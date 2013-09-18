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
      first: "İlk sayfa",
      last: "Son sayfa",
      next: "Sonraki",
      previous: "Önceki",
      total: "Toplam"
   }

   var defaultGridOptions = {
      deepLinking: true,
      searching : true,
      selectable: true,
      sorting: true,
      paging: true,
      pageSize: 3
   }

   // ng-repeat does not accept ranges as of now, need to provide a collection
   var generateNumberArray = function(numberOfItems) {
      var numberArray = [];
      for(i = 1; i <= numberOfItems ; i++) {
         numberArray.push(i);
      }

      return numberArray;
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
            scope.pageIndex = 1;

            scope.sort = function(column) {
               scope.reverseOrder = scope.sortExpression == column.field && !scope.reverseOrder;
               scope.sortExpression = column.field;
            };

            scope.onClick = function(row) {
               scope.toggleRow(row);
               scope.rowClick();
            };

            scope.onDoubleClick = function(row) {
               scope.rowDoubleClick();
            };

            scope.toggleRow = function(row) {
               scope.selectedRow = row;
            };

            scope.numberOfPages = function() {
               if(!scope.filteredData()) return 0;

               return Math.ceil(scope.filteredData().length / scope.options.pageSize);
            };

            scope.filteredData = function() {
               return scope.$eval("transformedData | orderBy:sortExpression:reverseOrder | filter:searchText");
            }

            scope.pageData = function(pageNumber) {
               if(pageNumber < 1) pageNumber = 1;

               var lowerBound = (pageNumber - 1) * scope.options.pageSize;
               var upperBound = lowerBound + scope.options.pageSize;

               var pageData = [];

               if(scope.filteredData().length > 0)
                  pageData = scope.filteredData().slice(lowerBound, upperBound);

               return pageData;
            }

            scope.first = function(){
               scope.pageIndex = 1;
            };

            scope.prev = function(){
               scope.pageIndex = Math.max(scope.pageIndex - 1, 1);
            };

            scope.last = function(){
               scope.pageIndex = scope.numberOfPages();
            };

            scope.next = function(){
               scope.pageIndex = Math.min(scope.pageIndex + 1, scope.numberOfPages());
            };
         }  
      }
   });
})(window.angular);