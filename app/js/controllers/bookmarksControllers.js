'use strict';

var bookmarksControllers = angular.module('bookmarksControllers', []);

bookmarksControllers.controller('bookmarksCtrl',
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
          $scope.user = {
            'id': user[0].id,
            'login': user[0].login
          };
        }
        if(cat.length > 0){
          $scope.category = {
            'id': cat[0].id,
            'name': cat[0].name
          };
        }
      });

}]).
controller('addBookmarkCtrl',
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
          $scope.category = {
            'id': cat[0].id,
            'name': cat[0].name
          };
        }
      });

    $scope.addBookmark = function ( bookmark ) {
      bookmark.category = $scope.category.id;
      DataService.addBookmark( bookmark ).
        success( function () {
          $scope.addBookmarkFailed = false;
          $location.path( '/user/' + $scope.currentUser + '/category/' + $scope.category.id );
        }).
        error( function ( err, errType ) {
          if( errType.alreadyExists ) {
            $scope.addBookmarkFailed = true;
          }
        });
    }

}]).
controller('editBookmarkCtrl',
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
          $scope.editedBookmark = {
            'id': book[0].id,
            'owner': book[0].owner,
            'category': book[0].category,
            'name': book[0].name,
            'url': book[0].url
          };
        }
      });

    $scope.editBookmark = function ( bookmark ) {
      DataService.editBookmark( bookmark ).
        success( function () {
          $scope.editBookmarkFailed = false;
          $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
        }).
        error( function ( err, errType ) {
          if( errType.alreadyExists ) {
            $scope.editBookmarkFailed = true;
          }
          else if( errType.notExists ) {
            $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
          }
        });
    }

}]).
controller('rmBookmarkCtrl',
  ['$scope', '$routeParams', '$location', 'DataService', 'oninit',
  function( $scope, $routeParams, $location, DataService, oninit ) {
    $scope.rmedBookmark = {
      'name': "",
      'url': ""
    }

    oninit($scope, function () {
        var book = DataService.findBookmarks( { 'id': parseInt( $routeParams.bookmarkId ) } );
        if(book.length > 0){
          $scope.rmedBookmark = {
            'id': book[0].id,
            'owner': book[0].owner,
            'category': book[0].category,
            'name': book[0].name,
            'url': book[0].url
          };
        }
      });

    $scope.rmBookmark = function ( bookmark ) {
        DataService.rmBookmark( bookmark ).
        success( function () {
          $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
        }).
        error( function ( err, errType ) {
          if( errType.notExists ) {
            $location.path( '/user/' + $scope.currentUser + '/category/' + bookmark.category );
          }
        });
    }

}]);
