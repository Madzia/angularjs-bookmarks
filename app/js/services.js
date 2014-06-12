'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource', 'ngCookies']);

appServices.factory('AuthService', [ '$rootScope', '$resource', '$cookieStore', 'socket',
  function( $rootScope, $resource, $cookieStore, socket ) {

    var methods = {
      'signin': function () {
        return $resource('api/auth/:login/:password', {}, {
            query: {method:'GET', params:{'login': 'login', 'password': 'password'} }
          });
      },
      'verify': function () {
        return $resource('api/verify/:login/:token', {}, {
            query: {method:'GET', params:{'login': 'login', 'token': 'token'} }
          });
      },
      'signout': function () {
        return $resource('api/out/:login/:token', {}, {
            query: {method:'GET', params:{'login': 'login', 'token': 'token'} }
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
      $rootScope.AuthUser = (methods.verify())
        .get({'login': tmpAuthUser.login, 'token': tmpAuthUser.token},
          function ( user ) {
            console.log( user );
            if( user.auth ){
              $rootScope.currentUser = user.login;
            } else {
              $rootScope.AuthUser = null;
              $rootScope.currentUser = null;
            }
          } );
    }
    catch (err){
      $rootScope.AuthUser = null;
      $rootScope.currentUser = null;
    }
    finally{
      socket.emit('init', $rootScope.AuthUser);
    }

    return methods;
  }]).
  factory('socket',['$rootScope', function ($rootScope) {
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
  factory('manager',[ '$rootScope', 'socket', function ($rootScope, socket) {

    var methods =  {
      'add': function ( coll, item ) {
        coll.push(item);
      },
      'update': function ( coll, item ) {
        for(var i = 0; i < coll.length; i++){
          if( coll[i].id === item.id ) {
            coll[i] = item;
            return true;
          }
        }
        return false;
      },
      'remove': function ( coll, item ) {
        for(var i = 0; i < coll.length; i++){
          if( coll[i].id === item.id ) {
            coll.splice(i, 1);
            return true;
          }
        }
        return false;
      },
      'find': function ( coll, cond ) {
        var res = [];
        for(var i = 0; i < coll.length; i++){
          if( cond( coll[i] ) ) {
            res.push(coll[i]);
          }
        }
        return res;
      }
    }

    //data via socket.io
    $rootScope.users = [];
    $rootScope.categories = [];
    $rootScope.bookmarks = [];

    socket.on('add', function ( data ) {
      methods.add( $rootScope[ data.coll ], data.data );
    });

    socket.on('update', function ( data ) {
      methods.update( $rootScope[ data.coll ], data.data );
    });

    socket.on('remove', function ( data ) {
      methods.remove( $rootScope[ data.coll ], data.data );
    });

    socket.on('init', function ( data ) {
        $rootScope.users = data.users;
        $rootScope.categories = data.categories;
        $rootScope.bookmarks = data.bookmarks;
        $rootScope.init = true;
        console.log('init');
    });


    return methods;
  }]).
  factory('oninit',[ '$rootScope', function ($rootScope) {
    return function ( scope, callback ) {
      var wait = setInterval(function () {
        if($rootScope.init){
          clearInterval(wait);
          scope.$apply(callback());
        }
      }, 100);
    };
  }]);
