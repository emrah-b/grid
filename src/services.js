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