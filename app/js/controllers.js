'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', ['ngCookies']);

appControllers.controller('MainAppCtrl', ['$scope', '$cookieStore', 'AuthService', 'socket', 'manager',
  function($scope, $cookieStore, AuthService, socket, manager) {
    $scope.init = false;
    $scope.loginFailed = false;

    $scope.credentials = {
      "login": '',
      "password": ''
    };

    //sign in
    $scope.signin = function ( credentials ) {
      // console.log(credentials);
      // console.log(AuthService);
      $scope.AuthUser = (AuthService.signin())
        .get({'login': credentials.login, 'password': credentials.password},
          function ( user ) {
            console.log( user );
            if( user.auth ){
              $cookieStore.put('AuthUser', {'login': user.login, 'token': user.token});
              $scope.currentUser = user.login;
              $scope.loginFailed = false;
            } else {
              $scope.loginFailed = true;
            }
          } );
    }
    //sign out
    $scope.signout = function () {
      // console.log( $scope.AuthUser );
      // console.log(AuthService);
      $scope.AuthUser = (AuthService.signout())
        .get({'login': $scope.AuthUser.login, 'token': $scope.AuthUser.token},
          function ( user ) {
            // console.log( user );
            if( !user.auth ){
              $cookieStore.remove('AuthUser');
              $scope.currentUser = null;
            }
          } );
    }

  }]);

appControllers.controller('indexCtrl', ['$scope', 'socket', 'manager', 'oninit',
  function( $scope, socket, manager, oninit ) {
    $scope.query = "";
    $scope.orderProp = "-id";
    $scope.signupFailed = false;
    $scope.browseCategories = [];

    $scope.account = {
      "login": "",
      "password": ""
    };

    oninit($scope, function () {
      console.log('oninit');
      $scope.browseCategories = $scope.categories;
      // $scope.$apply();
    });

    $scope.userName = function ( userId ) {
      // console.log(userId);
      var usr = manager.find( $scope.users, function ( u ) { return u.id === userId; });
      // console.log(usr);
      if(usr.length > 0){
        return usr[0].login;
      }
      else{
        return "unknown";
      }
    }

  }]);

appControllers.controller('signupCtrl', ['$scope', '$location', 'socket', 'manager', 'oninit',
  function( $scope, $location, socket, manager, oninit ) {
    //sign up
    $scope.signup = function ( account ) {
      if( manager.find( $scope.users,
        function ( item ) { return item.login === account.login} ).length === 0 )
      {
        $scope.signupFailed = false;
        socket.emit('addUser', account);
        $location.path('/index');
      }
      else {
        $scope.signupFailed = true;
      }
    };

  }]);
