'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', []);

appControllers.controller('MainAppCtrl', ['$scope', '$window', 'AuthService',
  function($scope, $window, AuthService) {
    //auth setup
    $scope.currentUser = null;
    $scope.AuthUser = null;
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
              $scope.currentUser = user.login;
            }
          } );
    }
    //sign out
      //TODO
    //sign up
      //TODO

  }]);

appControllers.controller('indexCtrl', ['$scope', '$window',
  function($scope, $window) {
    console.log($scope.currentUser);
  }]);

// appControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
//   function($scope, Phone) {
//     $scope.phones = Phone.query();
//     $scope.orderProp = 'age';
//   }]);

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
