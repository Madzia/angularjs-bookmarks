'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource']);

appServices.factory('AuthService',
  [ '$rootScope', '$http', '$resource', 'socket',
  function( $rootScope, $http, $resource, socket ) {

    var  methods = {
      'signin': function ( credentials ) {
        return $http.post('api/login/', { 'login': credentials.login, 'password': credentials.password } ).
          success(function(data, status, headers, config) {
            $rootScope.AuthUser = data;
            $rootScope.currentUser = data.login;
            $rootScope.loginFailed = false;
          }).
          error(function(data, status, headers, config) {
            $rootScope.loginFailed = true;
          });
      },
      'signout': function ( credentials ) {
        return $http.get('api/logout').
          success(function(data, status, headers, config) {
            if( !data.auth ){
              $rootScope.AuthUser = null;
              $rootScope.currentUser = null;
            }
          }).
          error(function(data, status, headers, config) {
          });
      },
      'verify': function ( ) {
        return $http.get('api/verify').
          success(function(data, status, headers, config) {
            if( data.auth ){
              $rootScope.AuthUser = data;
              $rootScope.currentUser = data.login;
            } else {
              $rootScope.AuthUser = null;
              $rootScope.currentUser = null;
            }
          }).
          error(function(data, status, headers, config) {
          });
      }
    }

    //auth via socket.io
    socket.on('auth', function ( data ) {
      $rootScope.AuthUser = data;
      $rootScope.currentUser = data.login;
      $rootScope.loginFailed = false;
    });

    //auth setup
    // methods.verify();

    return methods;
}]).
factory('socket',
  ['$rootScope',
  function ($rootScope) {
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.$apply(socket, args);
            }
          });
        })
      }
    };
}]).
factory('oninit',
  ['$rootScope',
  function ($rootScope) {
    return function ( scope, callback ) {
      var wait = setInterval(function () {
        if($rootScope.init){
          clearInterval(wait);
          scope.$apply(callback());
        }
      }, 100);
    };
}]);
