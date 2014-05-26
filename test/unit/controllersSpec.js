'use strict';

/* jasmine specs for controllers go here */
describe('App controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('App'));
  beforeEach(module('appServices'));
  beforeEach(module('appControllers'));

  describe('MainAppCtrl', function(){
    var scope, ctrl, $httpBackend, cookieStore;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      // $httpBackend.expectGET('api/auth/login/password').
      //     respond({"auth": true, "login": "login", "password": "password"});
      // $httpBackend.expectGET('api/verify/login/1').
      //     respond({"auth": false, "login": "login", "password": "password"});

      scope = $rootScope.$new();
      cookieStore = {
        'get': function ( key ) {
          return null;
        }
      }
      ctrl = $controller('MainAppCtrl', {$scope: scope, $cookieStore: cookieStore});
    }));


    it('should set AuthUser and currentUser to null', function() {
      // expect(scope.phones).toEqualData([]);
      // $httpBackend.flush();

      expect(scope.AuthUser).toBe(null);
      expect(scope.currentUser).toBe(null);
    });


    // it('should set the default value of orderProp model', function() {
    //   expect(scope.orderProp).toBe('age');
    // });
  });


  // describe('PhoneDetailCtrl', function(){
  //   var scope, $httpBackend, ctrl,
  //       xyzPhoneData = function() {
  //         return {
  //           name: 'phone xyz',
  //               images: ['image/url1.png', 'image/url2.png']
  //         }
  //       };
  //
  //
  //   beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
  //     $httpBackend = _$httpBackend_;
  //     $httpBackend.expectGET('phones/xyz.json').respond(xyzPhoneData());
  //
  //     $routeParams.phoneId = 'xyz';
  //     scope = $rootScope.$new();
  //     ctrl = $controller('PhoneDetailCtrl', {$scope: scope});
  //   }));
  //
  //
  //   it('should fetch phone detail', function() {
  //     expect(scope.phone).toEqualData({});
  //     $httpBackend.flush();
  //
  //     expect(scope.phone).toEqualData(xyzPhoneData());
  //   });
  // });
});
