'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource', 'ngCookies']);

appServices.factory('AuthService',
  [ '$rootScope', '$http', '$resource', '$cookieStore', 'socket',
  function( $rootScope, $http, $resource, $cookieStore, socket ) {

    var  methods = {
      'signin': function ( credentials ) {
        return $http.post('api/login/', { 'login': credentials.login, 'password': credentials.password } ).
          success(function(data, status, headers, config) {
            // $cookieStore.put('AuthUser', {'login': data.login, 'token': data.token});
            $rootScope.AuthUser = data;
            $rootScope.currentUser = data.login;
            $rootScope.loginFailed = false;
          }).
          error(function(data, status, headers, config) {
            $rootScope.loginFailed = true;
          });
      },
      'signout': function ( credentials ) {
        return $http.get('api/logout/'+credentials.login+'/'+credentials.token).
          success(function(data, status, headers, config) {
            if( !data.auth ){
              $cookieStore.remove('AuthUser');
              $rootScope.AuthUser = null;
              $rootScope.currentUser = null;
            }
          }).
          error(function(data, status, headers, config) {
          });
      },
      'verify': function ( credentials ) {
        return $http.get('api/verify/'+credentials.login+'/'+credentials.token).
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
      $cookieStore.put('AuthUser', {'login': data.login, 'token': data.token});
      console.log($cookieStore.get('AuthUser'));
      $rootScope.AuthUser = data;
      $rootScope.currentUser = data.login;
      $rootScope.loginFailed = false;
    });

    //auth setup
    try {
      var tmpAuthUser = $cookieStore.get('AuthUser');
      console.log(tmpAuthUser);
      methods.verify( {
        'login': tmpAuthUser.login,
        'token': tmpAuthUser.token
      } );
    }
    catch (err){
      $rootScope.AuthUser = null;
      $rootScope.currentUser = null;
    }
    // finally{
    //
    // }

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
