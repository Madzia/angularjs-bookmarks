'use strict';

/* App Module */

var App = angular.module('App', [
  'ngRoute',
  'appControllers',
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
      otherwise({
        redirectTo: '/index'
      });
  }]);
