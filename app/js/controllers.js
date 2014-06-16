'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', ['ngCookies']);

appControllers.controller('MainAppCtrl', ['$scope', 'AuthService', 'DataService',
  function($scope, AuthService, DataService) {
    $scope.loginFailed = false;

    $scope.credentials = {
      "login": '',
      "password": ''
    };

    //sign in
    $scope.signin = function ( credentials ) {
      AuthService.signin( {
        'login': credentials.login,
        'password': credentials.password
      } );
    }
    //sign out
    $scope.signout = function () {
      AuthService.signout( {
        'login': $scope.AuthUser.login,
        'token': $scope.AuthUser.token
      } );
    }

  }]);

appControllers.controller('indexCtrl', ['$scope', 'DataService', 'oninit',
  function( $scope, DataService, oninit ) {
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
    });

    $scope.userName = function ( userId ) {
      var usr = DataService.findUsers( { 'id': userId } );
      if(usr.length > 0){
        return usr[0].login;
      }
      else{
        return "unknown";
      }
    }

  }]);

appControllers.controller('signupCtrl', ['$scope', '$location', 'DataService', 'oninit',
  function( $scope, $location, DataService, oninit ) {
    //sign up
    $scope.signup = function ( account ) {
      console.log(DataService.findUsers( { 'login': account.login } ));
      if( DataService.findUsers( { 'login': account.login } ).length === 0 ) {
        $scope.signupFailed = false;
        DataService.addUser( account );
        $location.path('/index');
      }
      else {
        $scope.signupFailed = true;
      }
    };

  }]);
