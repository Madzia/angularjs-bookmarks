'use strict';

/* Services */

var appDataServices = angular.module('appDataServices', []);

appDataServices.factory('manager',
  ['$rootScope', 'socket',
  function ($rootScope, socket) {
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
factory('DataService',
  ['$rootScope', 'socket', 'manager',
  function ($rootScope, socket, manager) {
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

    var callbacks = function ( err, errType ) {
      return {
        'success': function ( callback ) {
          if( !err ) {
            callback();
          }
          return callbacks( err, errType );
        },
        'error': function ( callback ) {
          if ( err ) {
            callback( err, errType );
          }
          return callbacks( err, errType );
        }
      };
    }

    var methods = {
      'addUser': function( user ){
        var err = false;
        if( methods.findUsers( { 'login': user.login } ).length === 0 ) {
          socket.emit('addUser', user);
        }
        else {
          err = true;
        }
        return callbacks( err );
      },
      'addCategory': function ( category ){
        var err = false;
        var errType = {};
        if( methods.findCategories( { 'name': category.name } ).length === 0 ) {
          category.owner = $rootScope.AuthUser.id;
          var data = {
            'user': $rootScope.AuthUser,
            'data': category
          }
          socket.emit('addCategory', data);
        }
        else {
          err = true;
          errType.alreadyExists = true;
        }
        return callbacks( err, errType );
      },
      'editCategory': function ( category ){
        var err = false;
        var errType = {};
        if( methods.findCategories( { 'id': category.id } ).length === 1 ){
          if( methods.findCategories( { 'name': category.name, 'id': { '$ne': category.id } } ).length === 0 ) {
            var data = {
              'user': $rootScope.AuthUser,
              'data': category
            }
            socket.emit('editCategory', data);
          }
          else {
            err = true;
            errType.alreadyExists = true;
          }
        }
        else {
          err = true;
          errType.notExists = true;
        }
        return callbacks( err, errType );
      },
      'rmCategory': function ( category ){
        var err = false;
        var errType = {};
        if( methods.findCategories( { 'id': category.id } ).length === 1 ){
          var data = {
            'user': $rootScope.AuthUser,
            'data': category
          }
          socket.emit('rmCategory', data);
        }
        else {
          err = true;
          errType.notExists = true;
        }
        return callbacks( err, errType );
      },
      'addBookmark': function ( bookmark ){
        var err = false;
        var errType = {};
        if( methods.findBookmarks( { 'name': bookmark.name } ).length === 0 ){
          bookmark.owner = $rootScope.AuthUser.id;
          var data = {
            'user': $rootScope.AuthUser,
            'data': bookmark
          }
          socket.emit('addBookmark', data);
        }
        else {
          err = true;
          errType.alreadyExists = true;
        }
        return callbacks( err, errType );
      },
      'editBookmark': function ( bookmark ){
        var err = false;
        var errType = {};
        if( methods.findBookmarks( { 'id': bookmark.id } ).length === 1 ){
          if( methods.findBookmarks( { 'name': bookmark.name, 'id': { '$ne': bookmark.id } } ).length ===0 ){
            var data = {
              'user': $rootScope.AuthUser,
              'data': bookmark
            }
            socket.emit('editBookmark', data);
          }
          else {
            err = true;
            errType.alreadyExists = true;
          }
        }
        else {
          err = true;
          errType.notExists = true;
        }
        return callbacks( err, errType );
      },
      'rmBookmark': function ( bookmark ){
        var err = false;
        var errType = {};
        if( methods.findBookmarks( { 'id': bookmark.id } ).length == 1 ){
          var data = {
            'user': $rootScope.AuthUser,
            'data': bookmark
          }
          socket.emit('rmBookmark', data);
        }
        else {
          err = true;
          errType.notExists = true;
        }
        return callbacks( err, errType );
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

}]);
