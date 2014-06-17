var socketio = require('socket.io');

exports.listen = function( server, Manager ) {
  var io = socketio.listen(server);

  Manager.findAllUsers(function ( err, data ) {
    if(!err){
      if(data.length === 0){
        Manager.addUser({'login': 'Mateusz', 'password': 'superhaslo', 'id': new Date().getTime() }, function ( err, data ) {
          if(!err){
            console.log('first user added');
          }
        });
      }
    }
  });


  io.sockets.on('connection', function ( client ) {
    'use strict';
    console.log('socket.io connected');
    console.log(client.id);

    //init
    client.on('init', function () {
      Manager.findAllUsers(function ( err, data ) {
        if(!err){
          var res = {
            'users': [],
            'categories': []
          };
          for(var i = 0; i < data.length; i++){
            res.users.push({'login': data[i].login, "id": data[i].id});
          }
          Manager.findAllCategories( function ( err, data) {
            if(!err){
              res.categories = data;
              Manager.findAllBookmarks( function ( err, data) {
                if(!err){
                  res.bookmarks = data;
                  client.emit('init', res);
                  console.log('init');
                }
              });
            }
          });
        }
      });
    });

    //users
    client.on('addUser', function ( user ) {
      Manager.addUser(user, function ( err, data ) {
        if(!err){
          var token = new Date().getTime();
          User.signin(data.login, data.id, token);
          client.emit('add', {'coll': 'users', 'data': {'login': data.login, 'id': data.id} });
          client.broadcast.emit('add', {'coll': 'users', 'data': {'login': data.login, 'id': data.id} });
          client.emit('auth', {'login': data.login, 'id': data.id, 'token': token });
        }
      });
    });

    //categories
    client.on('addCategory', function ( data ) {
      if( data.user.id === data.data.owner ) {
        var category = { 'name': data.data.name, 'owner': data.data.owner };
        Manager.addCategory(category, function ( err, data ) {
          if(!err){
            client.emit('add', {'coll': 'categories', 'data': category });
            client.broadcast.emit('add', {'coll': 'categories', 'data': category });
          }
        });
      }
    });

    client.on('editCategory', function ( data ) {
      if( data.user.id === data.data.owner ) {
        var category = data.data;
        Manager.editCategory(category, function ( err, data ) {
          if(!err){
            client.emit('update', {'coll': 'categories', 'data': category });
            client.broadcast.emit('update', {'coll': 'categories', 'data': category });
          }
        });
      }
    });

    client.on('rmCategory', function ( data ) {
      if( data.user.id === data.data.owner ) {
        var category = data.data;
        Manager.rmCategory(category, function ( err, data ) {
          if(!err){
            client.emit('remove', {'coll': 'categories', 'data': category });
            client.broadcast.emit('remove', {'coll': 'categories', 'data': category });
          }
        });
      }
    });

    //bookmarks
    client.on('addBookmark', function ( data ) {
      if( data.user.id === data.data.owner ) {
        var bookmark = { 'name': data.data.name, 'owner': data.data.owner,
          'category': data.data.category, 'url': data.data.url };
        Manager.addBookmark(bookmark, function ( err, data ) {
          if(!err){
            client.emit('add', {'coll': 'bookmarks', 'data': bookmark });
            client.broadcast.emit('add', {'coll': 'bookmarks', 'data': bookmark });
          }
        });
      }
    });

    client.on('editBookmark', function ( data ) {
      if( data.user.id === data.data.owner ) {
        var bookmark = data.data;
        Manager.editBookmark(bookmark, function ( err, data ) {
          if(!err){
            client.emit('update', {'coll': 'bookmarks', 'data': bookmark });
            client.broadcast.emit('update', {'coll': 'bookmarks', 'data': bookmark });
          }
        });
      }
    });

    client.on('rmBookmark', function ( data ) {
      if( data.user.id === data.data.owner ) {
        var bookmark = data.data;
        Manager.rmBookmark(bookmark, function ( err, data ) {
          if(!err){
            client.emit('remove', {'coll': 'bookmarks', 'data': bookmark });
            client.broadcast.emit('remove', {'coll': 'bookmarks', 'data': bookmark });
          }
        });
      }
    });
  });
};
