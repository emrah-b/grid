/***********************************************
* grid JavaScript Library
* Authors: Emrah Bayraktaroglu 
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 09/19/2013 18:04
***********************************************/
(function(window, angular) {
'use strict';
var gridModule = angular.module("grid", []);

window.i18n = {};

var defaultGridOptions = {
   searching : true,
   selectable: true,
   sorting: true,
   paging: true,
   pageSize: 10,
   i18n: 'tr'
}
window.i18n['en'] = {
   filter: "Type to search...",
   total: "Total"
};

window.i18n['tr'] = {
   filter: "Aranacak metni giriniz...",
   total: "Toplam"
};
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

angular.module("grid").factory("gridUtils", function() {
   return {
      applyFilters: function(rows, columns, evaluationFn) {
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
      },
      getPageData: function(data, pageSize, pageIndex) {
         if(pageIndex < 1) pageIndex = 1;

         var lowerBound = (pageIndex - 1) * pageSize;
         var upperBound = lowerBound + pageSize;

         var pageData = [];

         if(data.length > 0)
            pageData = data.slice(lowerBound, upperBound);

         return pageData;
      },
      calculateNumberOfPages: function(data, pageSize) {
         if(!data) return 0;

         return Math.max(Math.ceil(data.length / pageSize), 1);
      },
      applyUserOptions: function(userOptions, defaultOptions) {
         var options = defaultOptions;

         if(userOptions) {
            angular.forEach(Object.keys(userOptions), function(option) {
               options[option] = userOptions[option];
            });
         }

         return options;
      }
   }
});
angular.module("grid").run(["$templateCache", function($templateCache) {

  $templateCache.put("grid-template.html",
    "<div class=\"grid\">\n" +
    "   <div class=\"control-group search-box\" ng-show=\"options.searching\">\n" +
    "      <span id=\"grid-total\" class=\"pull-left\">{{i18n.total}}: {{filteredData().length}}</span>\n" +
    "      <span class=\"pull-right\" id=\"search-box\">\n" +
    "         <i class=\"icon-search\" style=\"float: none; margin-right: 10px\" />\n" +
    "         <input type=\"text\" class=\"input-medium search-query search-box\"\n" +
    "         ng-model=\"searchText\" placeholder=\"{{i18n.filter}}\" name=\"filter\" ng-change=\"pageIndex = 1\"/>\n" +
    "      </span>\n" +
    "   </div>\n" +
    "   <table class=\"table table-bordered table-striped\" placeholder=\"{{i18n.filter}}\">\n" +
    "      <thead>\n" +
    "         <tr>\n" +
    "            <th ng-repeat=\"column in columns\" ng-hide=\"column.hidden\" style=\"width: {{column.width}}\">\n" +
    "               <a class=\"header-{{$index}}\" ng-click=\"sort(column)\" ng-show=\"options.sorting\">\n" +
    "                  {{column.title}}\n" +
    "                  <i ng-class=\"{'icon-sort-by-alphabet-alt' : sortExpression==column.field && reverseOrder ,'icon-sort-by-alphabet': sortExpression == column.field && !reverseOrder, 'icon-sort-by-attributes': sortExpression != column.field}\" ></i>\n" +
    "               </a>\n" +
    "               <span class=\"header-{{$index}}\" ng-show=\"!options.sorting\">\n" +
    "                  {{column.title}}\n" +
    "               </a>\n" +
    "            </th>\n" +
    "         </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "         <tr ng-repeat=\"row in pageData()\"\n" +
    "         ng-click=\"onClick(row, $index)\" ng-dblclick=\"onDoubleClick(row)\" ng-class=\"{selected: $index == selectedIndex}\">\n" +
    "            <td ng-repeat=\"column in columns\" ng-hide=\"column.hidden\" style=\"width: {{column.width}}\">\n" +
    "               {{row[column.field]}}\n" +
    "            </td>\n" +
    "         </tr>\n" +
    "      </tbody>\n" +
    "   </table>\n" +
    "   <div ng-show=\"options.paging\" class=\"grid-pagination\">\n" +
    "      <ul class=\"pagination\">\n" +
    "         <li ng-class=\"{disabled: pageIndex == 1}\" ><a ng-click=\"first()\"><i class=\"grid-icon icon-double-angle-left\"></i></a></li>\n" +
    "         <li ng-class=\"{disabled: pageIndex == 1}\"><a ng-click=\"prev()\"><i class=\"grid-icon icon-angle-left\"></i> </a></li>\n" +
    "         <li class=\"pageIndexInput\">\n" +
    "            <span>\n" +
    "               <form ng-submit=\"goToPage(pageIndexInput)\">\n" +
    "                  <input type=\"text\" id=\"pageInput\" ng-model=\"pageIndexInput\"> / {{numberOfPages()}}\n" +
    "               </form> \n" +
    "            </span>\n" +
    "         </li>\n" +
    "         <li ng-class=\"{disabled: pageIndex == numberOfPages()}\"><a ng-click=\"next()\"><i class=\"grid-icon icon-angle-right\"></i> </a></li>\n" +
    "         <li ng-class=\"{disabled: pageIndex == numberOfPages()}\"><a ng-click=\"last()\"><i class=\"grid-icon icon-double-angle-right\"></i></a></li>\n" +
    "      </ul>\n" +
    "   </div>\n" +
    "</div>"
  );

}]);

}(window, window.angular));