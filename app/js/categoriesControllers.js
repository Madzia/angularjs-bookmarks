var categoriesControllers = angular.module('categoriesControllers', []);

categoriesControllers.controller('addCategoryCtrl', ['$scope', '$location', 'socket', 'manager',
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

categoriesControllers.controller('editCategoryCtrl', ['$scope', '$location', '$routeParams', 'socket', 'manager',
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
        function ( item ) { return item.id === cat.id; } ).length === 1 )
      {
        socket.emit('editCategory', {'user': $scope.AuthUser, 'data':cat});
        $location.path('/user/'+$scope.currentUser);
      }
      else {
        //TODO err - nazwa zajęty
      }
    };

  }]);

categoriesControllers.controller('rmCategoryCtrl', ['$scope', '$location', '$routeParams', 'socket', 'manager',
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

categoriesControllers.controller('userCtrl', ['$scope', '$routeParams', '$location', 'socket', 'manager',
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
