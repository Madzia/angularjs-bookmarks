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
      }
    };
  }]);

// appServices.factory('Phone', ['$resource',
//   function($resource){
//     return $resource('phones/:phoneId.json', {}, {
//       query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
//     });
//   }]);
