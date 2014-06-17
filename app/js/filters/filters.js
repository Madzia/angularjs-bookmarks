'use strict';

/* Filters */

var appFilters = angular.module('appFilters', []);


appFilters.filter('usersCategories',
  function() {
  return function(input, user) {
    var id = null;
    if(user && user.id){ id = parseInt(user.id) };
    var res = [];
    for(var i = 0; i < input.length; i++){
      if(input[i].owner === id){
        res.push(input[i]);
      }
    }
    return res;
  };
}).
filter('categoryBookmarks',
  function() {
  return function(input, cat) {
    var id = null;
    if(cat && cat.id){ id = parseInt(cat.id) };
    var res = [];
    for(var i = 0; i < input.length; i++){
      if(input[i].category === id){
        res.push(input[i]);
      }
    }
    return res;
  };
});
