angular.module("grid").filter("sliceByPage", function(gridUtils) {
  return function(data, pageSize, pageIndex) {
    if(pageIndex < 1) pageIndex = 1;

    if(!data) return [];

    var lowerBound = (pageIndex - 1) * pageSize;
    var upperBound = lowerBound + pageSize;

    var pageData = [];

    if(data.length > 0)
      pageData = data.slice(lowerBound, upperBound);

    return pageData;
  }  
})