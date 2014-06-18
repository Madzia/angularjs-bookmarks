'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', ['ngCookies']);

appControllers.controller('MainAppCtrl',
  ['$scope', 'AuthService', 'DataService',
  function($scope, AuthService, DataService) {
    //check if loggedin
    AuthService.verify();

    // $scope.loginFailed = false;

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

}]).
controller('indexCtrl',
  ['$scope', 'DataService', 'oninit',
  function( $scope, DataService, oninit ) {
    $scope.query = "";
    $scope.orderProp = "-id";
    $scope.browseCategories = [];


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
        return "Unknown";
      }
    }

}]).
controller('signupCtrl',
  ['$scope', '$location', 'DataService', 'oninit',
  function( $scope, $location, DataService, oninit ) {
    $scope.signupFailed = false;
    $scope.account = {
      "login": "",
      "password": ""
    };
    //sign up
    $scope.signup = function ( account ) {
      DataService.addUser( account ).
        success( function () {
          $scope.signupFailed = false;
          $location.path('/index');
        }).
        error( function ( err ) {
          $scope.signupFailed = true;
        });
    };

}]);
