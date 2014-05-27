'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource']);

appServices.factory('AuthService', [ '$resource',
  function( $resource ) {
    return {
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
    };
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
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  }]).
  factory('manager',[ function () {
    return {
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
    };
  }]);

// appServices.factory('Phone', ['$resource',
//   function($resource){
//     return $resource('phones/:phoneId.json', {}, {
//       query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
//     });
//   }]);
