'use strict';

var categoriesControllers = angular.module('categoriesControllers', []);

categoriesControllers.controller('addCategoryCtrl', ['$scope', '$location', 'socket', 'manager',
  function( $scope, $location, socket, manager ) {
    console.log($scope.currentUser);
    $scope.addedCateogry = {
      "name": ""
    };
    //add category
    $scope.addCategory = function ( cat ) {
      if( manager.find( $scope.categories,
        function ( item ) { return item.name === cat.name} ).length === 0 )
      {
        socket.emit('addCategory', {'user': $scope.AuthUser, 'data':cat});
        $location.path('/user/'+$scope.currentUser);
      }
      else {
        //TODO err - nazwa zajęty
      }
    };

  }]);

categoriesControllers.controller('editCategoryCtrl',
  ['$scope', '$location', '$routeParams', 'socket', 'manager', 'oninit',
  function( $scope, $location, $routeParams, socket, manager, oninit ) {
    console.log($scope.currentUser);
    $scope.editedCateogry = {
      "name": ""
    };

    oninit($scope, function () {
        // console.log("fill data");
        var id = parseInt($routeParams.categoryId);
        // console.log(manager.find( $scope.categories, function( c ){ return (id === c.id); }));
        var cat = manager.find( $scope.categories, function( c ){ return (id === c.id); });
        if(cat.length > 0){
          // console.log(cat[0]);
          $scope.editedCategory = {'name': cat[0].name, 'id': cat[0].id, 'owner': cat[0].owner};
          $scope.$apply();
        }
      });

    //edit category
    $scope.editCategory = function ( cat ) {
      console.log(cat);
      if( manager.find( $scope.categories,
        function ( item ) { return item.id === cat.id; } ).length === 1 )
      {
        socket.emit('editCategory', {'user': $scope.AuthUser, 'data':cat});
        $location.path('/user/'+$scope.currentUser);
      }
      else {
        // err - nie ma takiej kategorii
        $location.path('/user/'+$scope.currentUser);
      }
    };

  }]);

categoriesControllers.controller('rmCategoryCtrl',
  ['$scope', '$location', '$routeParams', 'socket', 'manager', 'oninit',
  function( $scope, $location, $routeParams, socket, manager, oninit ) {
    console.log($scope.currentUser);
    $scope.rmedCateogry = {
      "name": ""
    };

    oninit($scope, function () {
        // console.log("fill data");
        var id = parseInt($routeParams.categoryId);
        // console.log(manager.find( $scope.categories, function( c ){ return (id === c.id); }));
        var cat = manager.find( $scope.categories, function( c ){ return (id === c.id); });
        if(cat.length > 0){
          // console.log(cat[0]);
          $scope.rmedCateogry = {'name': cat[0].name, 'id': cat[0].id, 'owner': cat[0].owner};
          $scope.$apply();
        }
      });

    //edit category
    $scope.rmCategory = function ( cat ) {
      console.log(cat);
      if( manager.find( $scope.categories,
        function ( item ) { return item.name === cat.name; } ).length === 1 )
      {
        socket.emit('rmCategory', {'user': $scope.AuthUser, 'data':cat});
        $location.path('/user/'+$scope.currentUser);
      }
      else {
        // err - kategoria już usunięta
        $location.path('/user/'+$scope.currentUser);
      }
    };

  }]);

categoriesControllers.controller('userCtrl',
  ['$scope', '$routeParams', '$location', 'socket', 'manager', 'oninit',
  function( $scope, $routeParams, $location, socket, manager, oninit ) {
    $scope.query = "";
    $scope.orderProp = "-id";

    oninit($scope, function () {
        // console.log("fill data");
        var id;
        if( isNaN(parseInt($routeParams.userId)) ){
          // console.log(manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.login); }));
          id = manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.login); });
        }
        else{
          // console.log(manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.id.toString()); }));
          id = manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.id.toString()); });
        }
        if(id.length > 0){
          // console.log(id[0].id);
          $scope.user = { 'id': id[0].id, 'login': id[0].login };
          // console.log($scope.user);
          $scope.$apply();
        }
      });
  }]);
