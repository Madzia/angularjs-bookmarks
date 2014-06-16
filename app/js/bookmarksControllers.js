'use strict';

var bookmarksControllers = angular.module('bookmarksControllers', []);

bookmarksControllers.controller('categoryCtrl',
  ['$scope', '$routeParams', '$location', 'DataService', 'socket', 'manager', 'oninit',
  function( $scope, $routeParams, $location, DataService, socket, manager, oninit ) {
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
        var cat = manager.find( $scope.categories, function( c ){ return ($routeParams.categoryId === c.id.toString()); });
        if(user.length > 0){
          $scope.user = { 'id': user[0].id, 'login': user[0].login };
        }
        if(cat.length > 0){
          // console.log(cat[0].id);
          $scope.category = { 'id': cat[0].id, 'name': cat[0].name };
        }
      });
  }]);

bookmarksControllers.controller('addBookmarkCtrl',
  ['$scope', '$routeParams', '$location', 'DataService', 'manager', 'oninit',
  function( $scope, $routeParams, $location, DataService, manager, oninit ) {
    $scope.addBookmarkFailed = false;
    $scope.addedBookmark = {
      'name': "",
      'url': ""
    }

    oninit($scope, function () {
        // console.log("fill data");
        // console.log(manager.find( $scope.categories, function( c ){ return ($routeParams.categoryId === c.id.toString()); }));
        var cat = manager.find( $scope.categories, function( c ){ return ($routeParams.categoryId === c.id.toString()); });
        if(cat.length > 0){
          // console.log(cat[0].id);
          $scope.category = { 'id': cat[0].id, 'name': cat[0].name };
          // console.log($scope.category);
        }
      });

    $scope.addBookmark = function ( bookmark ) {
      if( manager.find( $scope.bookmarks,
        function ( item ) { return item.name === bookmark.name; } ).length === 0 )
      {
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
  ['$scope', '$routeParams', '$location', 'DataService', 'socket', 'manager', 'oninit',
  function( $scope, $routeParams, $location, DataService, socket, manager, oninit ) {
    $scope.editBookmarkFailed = false;
    $scope.editedBookmark = {
      'name': "",
      'url': ""
    }

    oninit($scope, function () {
        // console.log("fill data");
        // console.log(manager.find( $scope.bookmarks, function( b ){ return ($routeParams.bookmarkId === b.id.toString()); }));
        var book = manager.find( $scope.bookmarks, function( b ){ return ($routeParams.bookmarkId === b.id.toString()); });
        if(book.length > 0){
          // console.log(book[0].id);
          $scope.editedBookmark = { 'id': book[0].id, 'name': book[0].name, 'url': book[0].url, 'owner': book[0].owner,
            'category': book[0].category };
          // console.log($scope.editedBookmark);
        }
      });

    $scope.editBookmark = function ( bookmark ) {
      if( manager.find( $scope.bookmarks,
        function ( item ) { return item.id === bookmark.id; } ).length === 1 )
      {
        if( manager.find( $scope.bookmarks,
          function ( item ) { return item.name === bookmark.name && item.id !== bookmark.id; } ).length === 0 )
        {
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
  ['$scope', '$routeParams', '$location', 'DataService', 'socket', 'manager', 'oninit',
  function( $scope, $routeParams, $location, DataService, socket, manager, oninit ) {
    $scope.rmedBookmark = {
      'name': "",
      'url': ""
    }

    oninit($scope, function () {
        // console.log(manager.find( $scope.bookmarks, function( b ){ return ($routeParams.bookmarkId === b.id.toString()); }));
        var book = manager.find( $scope.bookmarks, function( b ){ return ($routeParams.bookmarkId === b.id.toString()); });
        if(book.length > 0){
          // console.log(book[0].id);
          $scope.rmedBookmark = { 'id': book[0].id, 'name': book[0].name, 'url': book[0].url, 'owner': book[0].owner,
            'category': book[0].category };
          // console.log($scope.rmedBookmark);
        }
      });

    $scope.rmBookmark = function ( bookmark ) {
      if( manager.find( $scope.bookmarks,
        function ( item ) { return item.id === bookmark.id; } ).length === 1 )
      {
        DataService.rmBookmark( bookmark );
        $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
      }
      else {
        $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
      }
    }
  }]);
