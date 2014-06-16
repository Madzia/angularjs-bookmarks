'use strict';

var categoriesControllers = angular.module('categoriesControllers', []);

categoriesControllers.controller('addCategoryCtrl', ['$scope', '$location', 'DataService', 'manager',
  function( $scope, $location, DataService, manager ) {
    $scope.addCategoryFailed = false;
    $scope.addedCateogry = {
      "name": ""
    };
    //add category
    $scope.addCategory = function ( category ) {
      if( manager.find( $scope.categories,
        function ( item ) { return item.name === category.name} ).length === 0 )
      {
        DataService.addCategory( category );
        $scope.addCategoryFailed = false;
        $location.path( '/user/' + $scope.currentUser );
      }
      else {
        $scope.addCategoryFailed = true;
      }
    };

  }]);

categoriesControllers.controller('editCategoryCtrl',
  ['$scope', '$location', '$routeParams', 'DataService', 'manager', 'oninit',
  function( $scope, $location, $routeParams, DataService, manager, oninit ) {
    console.log($scope.currentUser);
    $scope.editCategoryFailed = false;
    $scope.editedCateogry = {
      "name": ""
    };

    oninit($scope, function () {
        var id = parseInt($routeParams.categoryId);
        // console.log(manager.find( $scope.categories, function( c ){ return (id === c.id); }));
        var cat = manager.find( $scope.categories, function( c ){ return (id === c.id); });
        if(cat.length > 0){
          // console.log(cat[0]);
          $scope.editedCategory = {'name': cat[0].name, 'id': cat[0].id, 'owner': cat[0].owner};

        }
      });

    //edit category
    $scope.editCategory = function ( category ) {
      if( manager.find( $scope.categories,
        function ( item ) { return item.id === category.id; } ).length === 1 )
      {
        if( manager.find( $scope.categories,
          function ( item ) { return item.name === category.name && item.id !== category.id; } ).length === 0 )
        {
          DataService.editCategory( category );
          $scope.editCategoryFailed = false;
          $location.path( '/user/' + $scope.currentUser );
        }
        else {
          // err - nazwa zajęta
          $scope.editCategoryFailed = true;
        }
      }
      else {
        // err - nie ma takiej kategorii
        $location.path( '/user/' + $scope.currentUser );
      }
    };

  }]);

categoriesControllers.controller('rmCategoryCtrl',
  ['$scope', '$location', '$routeParams', 'DataService', 'manager', 'oninit',
  function( $scope, $location, $routeParams, DataService, manager, oninit ) {
    console.log($scope.currentUser);
    $scope.rmedCateogry = {
      "name": ""
    };

    oninit($scope, function () {
        var id = parseInt($routeParams.categoryId);
        // console.log(manager.find( $scope.categories, function( c ){ return (id === c.id); }));
        var cat = manager.find( $scope.categories, function( c ){ return (id === c.id); });
        if(cat.length > 0){
          // console.log(cat[0]);
          $scope.rmedCateogry = {'name': cat[0].name, 'id': cat[0].id, 'owner': cat[0].owner};

        }
      });

    //edit category
    $scope.rmCategory = function ( category ) {
      if( manager.find( $scope.categories,
        function ( item ) { return item.name === category.name; } ).length === 1 )
      {
        DataService.rmCategory( category );
        $location.path( '/user/' + $scope.currentUser );
      }
      else {
        // err - kategoria już usunięta
        $location.path( '/user/' + $scope.currentUser );
      }
    };

  }]);

categoriesControllers.controller('userCtrl',
  ['$scope', '$routeParams', '$location', 'DataService', 'oninit',
  function( $scope, $routeParams, $location, DataService, oninit ) {
    $scope.query = "";
    $scope.orderProp = "-id";

    oninit($scope, function () {
        var user;
        if( isNaN(parseInt($routeParams.userId)) ){
          user = DataService.findUsers( { 'login': $routeParams.userId } );
        }
        else{
          user = DataService.findUsers( { 'id': parseInt( $routeParams.userId ) } );
        }
        if(user.length > 0){
          $scope.user = { 'id': user[0].id, 'login': user[0].login };
        }
      });
  }]);
