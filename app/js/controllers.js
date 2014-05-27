'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', ['ngCookies']);

appControllers.controller('MainAppCtrl', ['$scope', '$cookieStore', 'AuthService', 'socket', 'manager',
  function($scope, $cookieStore, AuthService, socket, manager) {
    $scope.init = false;
    //data via socket.io
    $scope.users = [];
    $scope.categories = [];
    $scope.bookmarks = [];

    socket.on('add', function ( data ) {
      manager.add( $scope[ data.coll ], data.data );
    });

    socket.on('update', function ( data ) {
      manager.update( $scope[ data.coll ], data.data );
    });

    socket.on('remove', function ( data ) {
      manager.remove( $scope[ data.coll ], data.data );
    });

    //auth via socket.io
    socket.on('auth', function ( data ) {
      $cookieStore.put('AuthUser', {'login': data.login, 'token': data.token});
      console.log($cookieStore.get('AuthUser'));
      $scope.AuthUser = data;
      $scope.currentUser = data.login;
    });

    //auth setup
    try {
      var tmpAuthUser = $cookieStore.get('AuthUser');
      console.log(tmpAuthUser);
      $scope.AuthUser = (AuthService.verify())
        .get({'login': tmpAuthUser.login, 'token': tmpAuthUser.token},
          function ( user ) {
            console.log( user );
            if( user.auth ){
              $scope.currentUser = user.login;
            } else {
              $scope.AuthUser = null;
              $scope.currentUser = null;
            }
          } );
    }
    catch (err){
      $scope.AuthUser = null;
      $scope.currentUser = null;
    }
    finally{
      socket.emit('init', $scope.AuthUser);
      socket.on('init', function ( data ) {
        $scope.users = data.users;
        $scope.categories = data.categories;
        $scope.bookmarks = data.bookmarks;
        $scope.init = true;
        console.log('init');
      });
    }
    $scope.credentials = {
      "login": '',
      "password": ''
    };
    //sign in
    $scope.signin = function ( credentials ) {
      console.log(credentials);
      // console.log(AuthService);
      $scope.AuthUser = (AuthService.signin())
        .get({'login': credentials.login, 'password': credentials.password},
          function ( user ) {
            console.log( user );
            if( user.auth ){
              $cookieStore.put('AuthUser', {'login': user.login, 'token': user.token});
              $scope.currentUser = user.login;
            }
          } );
    }
    //sign out
    $scope.signout = function () {
      console.log( $scope.AuthUser );
      // console.log(AuthService);
      $scope.AuthUser = (AuthService.signout())
        .get({'login': $scope.AuthUser.login, 'token': $scope.AuthUser.token},
          function ( user ) {
            console.log( user );
            if( !user.auth ){
              $cookieStore.remove('AuthUser');
              $scope.currentUser = null;
            }
          } );
    }

  }]);

appControllers.controller('indexCtrl', ['$scope', 'socket', 'manager',
  function( $scope, socket, manager ) {
    console.log($scope.currentUser);
    $scope.account = {
      "login": "",
      "password": ""
    };
    //sign up
    $scope.signup = function ( account ) {
      if( manager.find( $scope.users,
        function ( item ) { return item.login === account.login} ).length === 0 )
      {
        socket.emit('addUser', account);
      }
      else {
        //TODO err - login zajęty
      }
    };

  }]);

appControllers.controller('addCategoryCtrl', ['$scope', '$location', 'socket', 'manager',
  function( $scope, $location, socket, manager ) {
    console.log($scope.currentUser);
    $scope.addedCateogry = {
      "name": ""
    };
    //add category
    $scope.addCategory = function ( cat ) {
      if( manager.find( $scope.categories,
        function ( item ) { return item.name === cat.name} ).length === 0 )
      {
        socket.emit('addCategory', {'user': $scope.AuthUser, 'data':cat});
        $location.path('/user/'+$scope.currentUser);
      }
      else {
        //TODO err - nazwa zajęty
      }
    };

  }]);

appControllers.controller('editCategoryCtrl', ['$scope', '$location', '$routeParams', 'socket', 'manager',
  function( $scope, $location, $routeParams, socket, manager ) {
    console.log($scope.currentUser);
    $scope.editedCateogry = {
      "name": ""
    };

    var wait = setInterval(function () {
      if($scope.init){
        clearInterval(wait);
        console.log("fill data");
        var id = parseInt($routeParams.categoryId);
        console.log(manager.find( $scope.categories, function( c ){ return (id === c.id); }));
        var cat = manager.find( $scope.categories, function( c ){ return (id === c.id); });
        if(cat.length > 0){
          console.log(cat[0]);
          $scope.editedCategory = {'name': cat[0].name, 'id': cat[0].id, 'owner': cat[0].owner};
          $scope.$apply();
        }
      }
    }, 100);

    //edit category
    $scope.editCategory = function ( cat ) {
      console.log(cat);
      if( manager.find( $scope.categories,
        function ( item ) { return item.name === cat.name; } ).length === 0 )
      {
        socket.emit('editCategory', {'user': $scope.AuthUser, 'data':cat});
        $location.path('/user/'+$scope.currentUser);
      }
      else {
        //TODO err - nazwa zajęty
      }
    };

  }]);

appControllers.controller('rmCategoryCtrl', ['$scope', '$location', '$routeParams', 'socket', 'manager',
  function( $scope, $location, $routeParams, socket, manager ) {
    console.log($scope.currentUser);
    $scope.rmedCateogry = {
      "name": ""
    };

    var wait = setInterval(function () {
      if($scope.init){
        clearInterval(wait);
        console.log("fill data");
        var id = parseInt($routeParams.categoryId);
        console.log(manager.find( $scope.categories, function( c ){ return (id === c.id); }));
        var cat = manager.find( $scope.categories, function( c ){ return (id === c.id); });
        if(cat.length > 0){
          console.log(cat[0]);
          $scope.rmedCateogry = {'name': cat[0].name, 'id': cat[0].id, 'owner': cat[0].owner};
          $scope.$apply();
        }
      }
    }, 100);

    //edit category
    $scope.rmCategory = function ( cat ) {
      console.log(cat);
      if( manager.find( $scope.categories,
        function ( item ) { return item.name === cat.name; } ).length === 1 )
      {
        socket.emit('rmCategory', {'user': $scope.AuthUser, 'data':cat});
        $location.path('/user/'+$scope.currentUser);
      }
      else {
        //TODO err - nazwa zajęty
      }
    };

  }]);

appControllers.controller('userCtrl', ['$scope', '$routeParams', '$location', 'socket', 'manager',
  function( $scope, $routeParams, $location, socket, manager ) {
    var wait = setInterval(function () {
      if($scope.init){
        clearInterval(wait);
        console.log("fill data");
        console.log(manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.login); }));
        var id = manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.login); });
        if(id.length > 0){
          console.log(id[0].id);
          $scope.user = { 'id': id[0].id, 'login': id[0].login };
          console.log($scope.user);
          $scope.$apply();
        }
      }
    }, 100);
  }]);

appControllers.controller('categoryCtrl', ['$scope', '$routeParams', '$location', 'socket', 'manager',
  function( $scope, $routeParams, $location, socket, manager ) {
    var wait = setInterval(function () {
      if($scope.init){
        clearInterval(wait);
        console.log("fill data");
        console.log(manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.login); }));
        var usr = manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.login); });
        console.log(manager.find( $scope.categories, function( c ){ return ($routeParams.categoryId === c.id.toString()); }));
        var cat = manager.find( $scope.categories, function( c ){ return ($routeParams.categoryId === c.id.toString()); });
        if(usr.length > 0){
          console.log(usr[0].id);
          $scope.user = { 'id': usr[0].id, 'login': usr[0].login };
          console.log($scope.user);
        }
        if(cat.length > 0){
          console.log(cat[0].id);
          $scope.category = { 'id': cat[0].id, 'name': cat[0].name };
          console.log($scope.category);
        }
          $scope.$apply();
      }
    }, 100);
  }]);


// appControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
//   function($scope, $routeParams, Phone) {
//     $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
//       $scope.mainImageUrl = phone.images[0];
//     });
//
//     $scope.setImage = function(imageUrl) {
//       $scope.mainImageUrl = imageUrl;
//     }
//   }]);
