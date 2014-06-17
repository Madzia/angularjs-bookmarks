'use strict';

/* App Module */

var App = angular.module('App', [
  'ngRoute',
  'appControllers',
  'categoriesControllers',
  'bookmarksControllers',
  'appFilters',
  'appServices',
  'appDataServices'
]);

App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
        templateUrl: 'partials/index.html',
        controller: 'indexCtrl'
      }).
      when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'signupCtrl'
      }).
      // categories
      when('/user/:userId', {
        templateUrl: 'partials/category/categories.html',
        controller: 'categoriesCtrl'
      }).
      when('/addcategory', {
        templateUrl: 'partials/category/addcategory.html',
        controller: 'addCategoryCtrl'
      }).
      when('/editcategory/:categoryId', {
        templateUrl: 'partials/category/editcategory.html',
        controller: 'editCategoryCtrl'
      }).
      when('/rmcategory/:categoryId', {
        templateUrl: 'partials/category/rmcategory.html',
        controller: 'rmCategoryCtrl'
      }).
      // bookmarks
      when('/user/:userId/category/:categoryId', {
        templateUrl: 'partials/bookmark/bookmarks.html',
        controller: 'bookmarksCtrl'
      }).
      when('/addbookmark/:categoryId', {
        templateUrl: 'partials/bookmark/addbookmark.html',
        controller: 'addBookmarkCtrl'
      }).
      when('/editbookmark/:bookmarkId', {
        templateUrl: 'partials/bookmark/editbookmark.html',
        controller: 'editBookmarkCtrl'
      }).
      when('/rmbookmark/:bookmarkId', {
        templateUrl: 'partials/bookmark/rmbookmark.html',
        controller: 'rmBookmarkCtrl'
      }).
      // ---
      otherwise({
        redirectTo: '/index'
      });
  }]);
