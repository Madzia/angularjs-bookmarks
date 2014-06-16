'use strict';

var bookmarksControllers = angular.module('bookmarksControllers', []);

bookmarksControllers.controller('categoryCtrl',
  ['$scope', '$routeParams', '$location', 'DataService', 'oninit',
  function( $scope, $routeParams, $location, DataService, oninit ) {
    $scope.query = "";
    $scope.orderProp = "-id";

    oninit($scope, function ()  {
        var user;
        if( isNaN(parseInt($routeParams.userId)) ){
          user = DataService.findUsers( { 'login': $routeParams.userId } );
        }
        else{
          user = DataService.findUsers( { 'id': parseInt( $routeParams.userId ) } );
        }
        var cat = DataService.findCategories( { 'id': parseInt( $routeParams.categoryId ) } );
        if(user.length > 0){
          $scope.user = { 'id': user[0].id, 'login': user[0].login };
        }
        if(cat.length > 0){
          $scope.category = { 'id': cat[0].id, 'name': cat[0].name };
        }
      });
  }]);

bookmarksControllers.controller('addBookmarkCtrl',
  ['$scope', '$routeParams', '$location', 'DataService', 'oninit',
  function( $scope, $routeParams, $location, DataService, oninit ) {
    $scope.addBookmarkFailed = false;
    $scope.addedBookmark = {
      'name': "",
      'url': ""
    }

    oninit($scope, function () {
        var cat = DataService.findCategories( { 'id': parseInt( $routeParams.categoryId ) } );
        if(cat.length > 0){
          $scope.category = { 'id': cat[0].id, 'name': cat[0].name };
        }
      });

    $scope.addBookmark = function ( bookmark ) {
    if( DataService.findBookmarks( { 'name': bookmark.name } ).length === 0 ){
        bookmark.category = $scope.category.id;
        DataService.addBookmark( bookmark );
        $scope.addBookmarkFailed = false;
        $location.path( '/user/' + $scope.currentUser + '/category/' + $scope.category.id );
      }
      else {
        // err - nazwa zajęty
        $scope.addBookmarkFailed = true;
      }
    }


  }]);

bookmarksControllers.controller('editBookmarkCtrl',
  ['$scope', '$routeParams', '$location', 'DataService', 'oninit',
  function( $scope, $routeParams, $location, DataService, oninit ) {
    $scope.editBookmarkFailed = false;
    $scope.editedBookmark = {
      'name': "",
      'url': ""
    }

    oninit($scope, function () {
        var book = DataService.findBookmarks( { 'id': parseInt( $routeParams.bookmarkId ) } );
        if(book.length > 0){
          $scope.editedBookmark = { 'id': book[0].id, 'name': book[0].name, 'url': book[0].url, 'owner': book[0].owner,
            'category': book[0].category };
        }
      });

    $scope.editBookmark = function ( bookmark ) {
      if( DataService.findBookmarks( { 'id': bookmark.id } ).length === 1 ){
        if( DataService.findBookmarks( { 'name': bookmark.name, 'id': { '$ne': bookmark.id } } ).length ===0 ){
          DataService.editBookmark( bookmark );
          $scope.editBookmarkFailed = false;
          $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
        }
        else {
          //err - nazwa zajęta
          $scope.editBookmarkFailed = true;
        }
      }
      else {
        $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
      }
    }
  }]);

bookmarksControllers.controller('rmBookmarkCtrl',
  ['$scope', '$routeParams', '$location', 'DataService', 'oninit',
  function( $scope, $routeParams, $location, DataService, oninit ) {
    $scope.rmedBookmark = {
      'name': "",
      'url': ""
    }

    oninit($scope, function () {
        var book = DataService.findBookmarks( { 'id': parseInt( $routeParams.bookmarkId ) } );
        if(book.length > 0){
          $scope.rmedBookmark = { 'id': book[0].id, 'name': book[0].name, 'url': book[0].url, 'owner': book[0].owner,
            'category': book[0].category };
        }
      });

    $scope.rmBookmark = function ( bookmark ) {
      if( DataService.findBookmarks( { 'id': bookmark.id } ).length == 1 ){

        DataService.rmBookmark( bookmark );
        $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
      }
      else {
        $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
      }
    }
  }]);
