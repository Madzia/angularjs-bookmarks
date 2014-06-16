'use strict';

var categoriesControllers = angular.module('categoriesControllers', []);

categoriesControllers.controller('addCategoryCtrl',
  ['$scope', '$location', 'DataService',
  function( $scope, $location, DataService ) {
    $scope.addCategoryFailed = false;
    $scope.addedCateogry = {
      "name": ""
    };
    //add category
    $scope.addCategory = function ( category ) {
      if( DataService.findCategories( { 'name': category.name } ).length === 0 ) {
        DataService.addCategory( category );
        $scope.addCategoryFailed = false;
        $location.path( '/user/' + $scope.currentUser );
      }
      else {
        $scope.addCategoryFailed = true;
      }
    };

}]).
controller('editCategoryCtrl',
  ['$scope', '$location', '$routeParams', 'DataService', 'oninit',
  function( $scope, $location, $routeParams, DataService, oninit ) {
    console.log($scope.currentUser);
    $scope.editCategoryFailed = false;
    $scope.editedCateogry = {
      "name": ""
    };

    oninit($scope, function () {
        var id = parseInt($routeParams.categoryId);
        var cat = DataService.findCategories( { 'id': id } );
        if(cat.length > 0){
          $scope.editedCategory = {
            'id': cat[0].id,
            'owner': cat[0].owner,
            'name': cat[0].name
          };
        }
      });

    //edit category
    $scope.editCategory = function ( category ) {
      if( DataService.findCategories( { 'id': category.id } ).length === 1 ){
        if( DataService.findCategories( { 'name': category.name, 'id': { '$ne': category.id } } ).length === 0 ) {
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

}]).
controller('rmCategoryCtrl',
  ['$scope', '$location', '$routeParams', 'DataService', 'oninit',
  function( $scope, $location, $routeParams, DataService, oninit ) {
    console.log($scope.currentUser);
    $scope.rmedCateogry = {
      "name": ""
    };

    oninit($scope, function () {
        var id = parseInt($routeParams.categoryId);
        var cat = DataService.findCategories( { 'id': id } );
        if(cat.length > 0){
          $scope.rmedCateogry = {
            'id': cat[0].id,
            'owner': cat[0].owner,
            'name': cat[0].name
          };

        }
      });

    //edit category
    $scope.rmCategory = function ( category ) {
      if( DataService.findCategories( { 'id': category.id } ).length === 1 ){
        DataService.rmCategory( category );
        $location.path( '/user/' + $scope.currentUser );
      }
      else {
        // err - kategoria już usunięta
        $location.path( '/user/' + $scope.currentUser );
      }
    };

}]).
controller('userCtrl',
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
