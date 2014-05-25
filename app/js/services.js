'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource']);

// appServices.factory('Phone', ['$resource',
//   function($resource){
//     return $resource('phones/:phoneId.json', {}, {
//       query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
//     });
//   }]);
