'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource', 'ngCookies']);

appServices.factory('AuthService', [ '$rootScope', '$http', '$resource', '$cookieStore', 'socket',
  function( $rootScope, $http, $resource, $cookieStore, socket ) {

    var  methods = {
      'signin': function ( credentials ) {
        return $http.get('api/auth/'+credentials.login+'/'+credentials.password).
          success(function(data, status, headers, config) {
            $cookieStore.put('AuthUser', {'login': data.login, 'token': data.token});
            $rootScope.AuthUser = data;
            $rootScope.currentUser = data.login;
            $rootScope.loginFailed = false;
          }).
          error(function(data, status, headers, config) {
            $rootScope.loginFailed = true;
          });
      },
      'signout': function ( credentials ) {
        return $http.get('api/out/'+credentials.login+'/'+credentials.token).
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
      },
      'findNew': function ( coll, query ) {
        var cond = function ( item ) {
          var cond = true;
          for( var prop in query ) {
            if( query.hasOwnProperty(prop) ) {
              if ( query[ prop ].$ne ){
                if( item[ prop ] === query[ prop ].$ne ) {
                  cond = false;
                }
              }
              else if ( item[ prop ] !== query[ prop ] ) {
                cond = false;
              }
            }
          }
          return cond;
        }
        var res = [];
        for(var i = 0; i < coll.length; i++){
          if( cond( coll[i] ) ) {
            res.push(coll[i]);
          }
        }
        return res;
      }
    }

    return methods;
  }]).
  factory('DataService',[ '$rootScope', 'socket', 'manager', function ($rootScope, socket, manager) {
    $rootScope.init = false;

    //data via socket.io
    $rootScope.users = [];
    $rootScope.categories = [];
    $rootScope.bookmarks = [];

    socket.on('add', function ( data ) {
      manager.add( $rootScope[ data.coll ], data.data );
    });

    socket.on('update', function ( data ) {
      manager.update( $rootScope[ data.coll ], data.data );
    });

    socket.on('remove', function ( data ) {
      manager.remove( $rootScope[ data.coll ], data.data );
    });

    socket.on('init', function ( data ) {
        $rootScope.users = data.users;
        $rootScope.categories = data.categories;
        $rootScope.bookmarks = data.bookmarks;
        $rootScope.init = true;
        console.log('init');
    });

    var methods = {
      'addUser': function( user ){
        socket.emit('addUser', user);
      },
      'addCategory': function ( category ){
        category.owner = $rootScope.AuthUser.id;
        var data = {
          'user': $rootScope.AuthUser,
          'data': category
        }
        socket.emit('addCategory', data);
      },
      'editCategory': function ( category ){
        var data = {
          'user': $rootScope.AuthUser,
          'data': category
        }
        socket.emit('editCategory', data);
      },
      'rmCategory': function ( category ){
        var data = {
          'user': $rootScope.AuthUser,
          'data': category
        }
        socket.emit('rmCategory', data);
      },
      'addBookmark': function ( bookmark ){
        bookmark.owner = $rootScope.AuthUser.id;
        var data = {
          'user': $rootScope.AuthUser,
          'data': bookmark
        }
        socket.emit('addBookmark', data);
      },
      'editBookmark': function ( bookmark ){
        var data = {
          'user': $rootScope.AuthUser,
          'data': bookmark
        }
        socket.emit('editBookmark', data);
      },
      'rmBookmark': function ( bookmark ){
        var data = {
          'user': $rootScope.AuthUser,
          'data': bookmark
        }
        socket.emit('rmBookmark', data);
      },
      'findUsers': function ( query ) {
        return manager.findNew( $rootScope.users, query );
      },
      'findCategories': function ( query ) {
        return manager.findNew( $rootScope.categories, query );
      },
      'findBookmarks': function ( query ) {
        return manager.findNew( $rootScope.bookmarks, query );
      }
    }
    socket.emit('init');
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
