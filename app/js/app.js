'use strict';

/* App Module */

var App = angular.module('App', [
  'ngRoute',
  'appControllers',
  'categoriesControllers',
  'bookmarksControllers',
  'appFilters',
  'appServices'
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
      when('/addcategory', {
        templateUrl: 'partials/addcategory.html',
        controller: 'addCategoryCtrl'
      }).
      when('/editcategory/:categoryId', {
        templateUrl: 'partials/editcategory.html',
        controller: 'editCategoryCtrl'
      }).
      when('/rmcategory/:categoryId', {
        templateUrl: 'partials/rmcategory.html',
        controller: 'rmCategoryCtrl'
      }).
      when('/user/:userId/category/:categoryId', {
        templateUrl: 'partials/category.html',
        controller: 'categoryCtrl'
      }).
      when('/user/:userId', {
        templateUrl: 'partials/user.html',
        controller: 'userCtrl'
      }).
      when('/addbookmark/:categoryId', {
        templateUrl: 'partials/addbookmark.html',
        controller: 'addBookmarkCtrl'
      }).
      when('/editbookmark/:bookmarkId', {
        templateUrl: 'partials/editbookmark.html',
        controller: 'editBookmarkCtrl'
      }).
      when('/rmbookmark/:bookmarkId', {
        templateUrl: 'partials/rmbookmark.html',
        controller: 'rmBookmarkCtrl'
      }).
      otherwise({
        redirectTo: '/index'
      });
  }]);
