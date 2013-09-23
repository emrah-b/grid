angular.module("grid").factory("gridUtils", function() {
   return {
      applyFilters: function(rows, columns, evaluationFn) {
         var transformedData = [];
         angular.forEach(rows, function(row) {
            var transformedRow = {};
            
            angular.forEach(columns, function (column){
               var displayValue =  row[column.field];

               if(column.filter) {
                  displayValue = evaluationFn("\"" + displayValue + "\" | " + column.filter);
               }  

               if(column.renderFn) {
                  displayValue = column.renderFn(displayValue);
               }

               if(!column.width) {
                  column.width = "auto";
               }

               transformedRow[column.field] = displayValue;   
            });

            transformedData.push(transformedRow);
         });
         return transformedData;   
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