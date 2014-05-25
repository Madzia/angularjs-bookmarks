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
      // when('/phones/:phoneId', {
      //   templateUrl: 'partials/phone-detail.html',
      //   controller: 'PhoneDetailCtrl'
      // }).
      otherwise({
        redirectTo: '/index'
      });
  }]);
