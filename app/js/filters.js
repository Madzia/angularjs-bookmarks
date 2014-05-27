'use strict';

/* Filters */

angular.module('appFilters', [])
.filter('usersCategories', function() {
  return function(input, user) {
    var id = null;
    if(user && user.id){ id = parseInt(user.id) };
    console.log(id);
    var res = [];
    for(var i = 0; i < input.length; i++){
      console.log(input[i].owner + " === " + id + ' ? ' + (input[i].owner === id) );
      if(input[i].owner === id){
        res.push(input[i]);
      }
    }
    return res;
  };
})
.filter('categoryBookmarks', function() {
  return function(input, cat) {
    var id = null;
    if(cat && cat.id){ id = parseInt(cat.id) };
    console.log(id);
    var res = [];
    for(var i = 0; i < input.length; i++){
      // console.log(input[i].owner + " === " + id + ' ? ' + (input[i].owner === id) );
      if(input[i].category === id){
        res.push(input[i]);
      }
    }
    return res;
  };
});
