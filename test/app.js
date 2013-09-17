var app = angular.module("test-app", ['grid']);

app.controller("TestGridCtrl", function($scope) {
   $scope.employees = [
      {employeeId: 1, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123},
      {employeeId: 2, firstName: "Ali", lastName: "Veli", department: "Muhasebe", birthday: 450997200000, salary: 123123},
      {employeeId: 2, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123},
      {employeeId: 4, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123},
      {employeeId: 5, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123},
      {employeeId: 6, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123},
      {employeeId: 1, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123},
      {employeeId: 2, firstName: "Ali", lastName: "Veli", department: "Muhasebe", birthday: 450997200000, salary: 123123},
      {employeeId: 3, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123},
      {employeeId: 4, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123},
      {employeeId: 5, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123},
      {employeeId: 6, firstName: "John", lastName: "Smith", department: "Legal", birthday: 450997200000, salary: 123123}
   ];

   $scope.columns = [
      {title:"Employee Id", field: "employeeId"},
      {title:"First Name", field: "firstName"},
      {title:"Last Name", field: "lastName"},
      {title:"Department", field: "department"},
      {title: "Birthday", field: "birthday", filter: "date:'dd.MM.yyyy'"},
      {title: "Salary", field: "salary", filter: "currency:'$'"}
   ];
});