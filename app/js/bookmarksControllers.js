var bookmarksControllers = angular.module('bookmarksControllers', []);

bookmarksControllers.controller('categoryCtrl', ['$scope', '$routeParams', '$location', 'socket', 'manager',
  function( $scope, $routeParams, $location, socket, manager ) {
    $scope.query = "";
    $scope.orderProp = "-id";
    var wait = setInterval(function () {
      if($scope.init){
        clearInterval(wait);
        console.log("fill data");
        var usr;
        if( isNaN(parseInt($routeParams.userId)) ){
          console.log(manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.login); }));
          usr = manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.login); });
        }
        else{
          console.log(manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.id.toString()); }));
          usr = manager.find( $scope.users, function( u ){ return ($routeParams.userId === u.id.toString()); });
        }
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

bookmarksControllers.controller('addBookmarkCtrl', ['$scope', '$routeParams', '$location', 'socket', 'manager',
  function( $scope, $routeParams, $location, socket, manager ) {
    $scope.addedBookmark = {
      'name': "",
      'url': ""
    }

    var wait = setInterval(function () {
      if($scope.init){
        clearInterval(wait);
        console.log("fill data");
        console.log(manager.find( $scope.categories, function( c ){ return ($routeParams.categoryId === c.id.toString()); }));
        var cat = manager.find( $scope.categories, function( c ){ return ($routeParams.categoryId === c.id.toString()); });
        if(cat.length > 0){
          console.log(cat[0].id);
          $scope.category = { 'id': cat[0].id, 'name': cat[0].name };
          console.log($scope.category);
        }
          $scope.$apply();
      }
    }, 100);

    $scope.addBookmark = function ( bookmark ) {
      console.log(bookmark);
      if( manager.find( $scope.bookmarks,
        function ( item ) { return item.name === bookmark.name; } ).length === 0 )
      {
        bookmark.owner = $scope.AuthUser.id;
        bookmark.category = $scope.category.id;
        console.log(bookmark);
        socket.emit('addBookmark', {'user': $scope.AuthUser, 'data': bookmark});
        $location.path('/user/'+$scope.currentUser+'/category/'+$scope.category.id);
      }
      else {
        //TODO err - nazwa zajęty
      }
    }


  }]);

bookmarksControllers.controller('editBookmarkCtrl', ['$scope', '$routeParams', '$location', 'socket', 'manager',
  function( $scope, $routeParams, $location, socket, manager ) {
    $scope.editedBookmark = {
      'name': "",
      'url': ""
    }

    var wait = setInterval(function () {
      if($scope.init){
        clearInterval(wait);
        console.log("fill data");
        console.log(manager.find( $scope.bookmarks, function( b ){ return ($routeParams.bookmarkId === b.id.toString()); }));
        var book = manager.find( $scope.bookmarks, function( b ){ return ($routeParams.bookmarkId === b.id.toString()); });
        if(book.length > 0){
          console.log(book[0].id);
          $scope.editedBookmark = { 'id': book[0].id, 'name': book[0].name, 'url': book[0].url, 'owner': book[0].owner,
            'category': book[0].category };
          console.log($scope.editedBookmark);
        }
          $scope.$apply();
      }
    }, 100);

    $scope.editBookmark = function ( bookmark ) {
      console.log(bookmark);
      if( manager.find( $scope.bookmarks,
        function ( item ) { return item.id === bookmark.id; } ).length === 1 )
      {
        console.log(bookmark);
        socket.emit('editBookmark', {'user': $scope.AuthUser, 'data': bookmark});
        $location.path('/user/'+$scope.currentUser+'/category/'+bookmark.category);
      }
      else {
        //TODO err - nazwa zajęty
      }
    }
  }]);

bookmarksControllers.controller('rmBookmarkCtrl', ['$scope', '$routeParams', '$location', 'socket', 'manager',
  function( $scope, $routeParams, $location, socket, manager ) {
    $scope.rmedBookmark = {
      'name': "",
      'url': ""
    }

    var wait = setInterval(function () {
      if($scope.init){
        clearInterval(wait);
        console.log("fill data");
        console.log(manager.find( $scope.bookmarks, function( b ){ return ($routeParams.bookmarkId === b.id.toString()); }));
        var book = manager.find( $scope.bookmarks, function( b ){ return ($routeParams.bookmarkId === b.id.toString()); });
        if(book.length > 0){
          console.log(book[0].id);
          $scope.rmedBookmark = { 'id': book[0].id, 'name': book[0].name, 'url': book[0].url, 'owner': book[0].owner,
            'category': book[0].category };
          console.log($scope.rmedBookmark);
        }
          $scope.$apply();
      }
    }, 100);

    $scope.rmBookmark = function ( bookmark ) {
      console.log(bookmark);
      if( manager.find( $scope.bookmarks,
        function ( item ) { return item.id === bookmark.id; } ).length === 1 )
      {
        console.log(bookmark);
        socket.emit('rmBookmark', {'user': $scope.AuthUser, 'data': bookmark});
        $location.path('/user/'+$scope.currentUser+'/category/'+bookmark.category);
      }
      else {
        //TODO err - nazwa zajęty
      }
    }
  }]);
