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
