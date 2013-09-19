angular.module("grid").directive("grid", function($filter, $location, gridUtils, $templateCache) {
   return {
      restrict: "E",
      replace: true,
      template: $templateCache.get("grid-template.html"),
      scope: {
         columns: "=",
         data: "=",
         gridOptions: "=",
         clickCallback:"=",
         doubleClickCallback:"=",
         sortExpression: "@"
      },
      link: function(scope, element, attrs, ctrl) {
         // apply display filters
         scope.transformedData = gridUtils.applyFilters(scope.data, scope.columns, scope.$eval);

         scope.$watch('pageIndex', function(newValue) {
            scope.pageIndexInput = scope.pageIndex;
         })

         scope.options = gridUtils.applyUserOptions(scope.gridOptions, defaultGridOptions);

         scope.i18n = window.i18n[scope.options.i18n];

         scope.pageIndex = 1;

         scope.sort = function(column) {
            scope.reverseOrder = scope.sortExpression == column.field && !scope.reverseOrder;
            scope.sortExpression = column.field;
         };

         scope.onClick = function(row, index) {
            if(scope.options.selectable)
               scope.selectedIndex = index;
            
            if(scope.clickCallback)
               scope.clickCallBack(row);
         };

         scope.onDoubleClick = function(row) {
            if(scope.doubleClickCallback)
               scope.doubleClickCallback(row);
         };

         scope.numberOfPages = function() {
            return gridUtils.calculateNumberOfPages(scope.filteredData(), scope.options.pageSize);
         }

         scope.filteredData = function() {
            return scope.$eval("transformedData | orderBy:sortExpression:reverseOrder | filter:searchText");
         }

         scope.pageData = function() {
            return gridUtils.getPageData(scope.filteredData(), scope.options.pageSize, scope.pageIndex);
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

         scope.goToPage = function(pageIndex){
            if(pageIndex < 1) pageIndex = 1;

            if(pageIndex > scope.numberOfPages()) pageIndex = scope.numberOfPages();

            scope.pageIndex = pageIndex;
         };
      }  
   }
});
