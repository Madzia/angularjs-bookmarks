exports.auth = function(req, res, appUser){
  console.log(req.params);

  var login = req.params[0];
  var password = req.params[1];

  appUser.auth({'login':login, 'password':password}, function ( result ){

    if( result ){
      var user = {'auth': true, 'login': login, '_id': result._id, 'token': new Date().getTime() };
      appUser.signin(user.login, user.token);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf8'
      });
      res.end(JSON.stringify(user));
    }
    else {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf8'
      });
      res.end(JSON.stringify({'auth': false}));
    }
  });
}

exports.check = function(req, res, appUser){
  console.log(req.params);

  var login = req.params[0];
  var token = parseInt(req.params[1]);

  if( appUser.check(login, token) ){
    var user = {'auth': true, 'login': login, 'token': token };
    appUser.signin(user.login, user.token);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf8'
    });
    res.end(JSON.stringify(user));
  }
  else {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf8'
    });
    res.end(JSON.stringify({'auth': false}));
  }

};

exports.signout = function(req, res, appUser){
  console.log(req.params);

  var login = req.params[0];
  var token = parseInt(req.params[1]);

  appUser.signout(login, token);

  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf8'
  });
  res.end(JSON.stringify({'auth': false}));
};
