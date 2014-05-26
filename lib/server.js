var socketio = require('socket.io');

exports.listen = function( server, User, Manager ) {
  var io = socketio.listen(server);

  Manager.findAllUsers(function ( err, data ) {
    if(!err){
      if(data.length === 0){
        Manager.addUser({'login': 'Mateusz', 'password': 'superhaslo'}, function ( err, data ) {
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
    client.on('init', function ( AuthUser ){
      console.log( AuthUser );
      Manager.findAllUsers(function ( err, data ) {
        if(!err){
          var res = [];
          for(var i = 0; i < data.length; i++){
            res.push({'login': data[i].login});
          }
          client.emit('init', res);
        }
      });
    });

    client.on('addUser', function ( user ) {
      Manager.addUser(user, function ( err, data ) {
        if(!err){
          var token = new Date().getTime();
          User.signin(data.login, token);
          client.emit('add', {'coll': 'users', 'data': {'login': data.login} });
          client.broadcast.emit('add', {'coll': 'users', 'data': {'login': data.login} });
          client.emit('auth', {'login': data.login, '_id': data._id, 'token': token });
        }
      });
    });
  });
};
