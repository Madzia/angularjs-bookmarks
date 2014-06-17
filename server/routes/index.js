exports.signin = function(req, res){//, appUser){
  // console.log(req.params);
  //
  // var login = req.params[0];
  // var password = req.params[1];
  //
  // appUser.auth({'login':login, 'password':password}, function ( result ){
  //
  //   if( result ){
  //     var token = new Date().getTime();
  //     var user = {'auth': true, 'login': login, 'id': result.id, 'token': token };
  //     appUser.signin(user.login, user.id, user.token);
  //     res.writeHead(200, {
  //       'Content-Type': 'application/json; charset=utf8'
  //     });
  //     res.end(JSON.stringify(user));
  //   }
  //   else {
  //     res.writeHead(200, {
  //       'Content-Type': 'application/json; charset=utf8'
  //     });
  //     res.end(JSON.stringify({'auth': false}));
  //   }
  // });
  res.cookie('AuthUser', JSON.stringify(req.user));
  res.send(req.user);
}

exports.check = function(req, res, appUser){
  // console.log(req.params);

  var login = req.params[0];
  var token = parseInt(req.params[1]);
  console.log("verify");
  var result = appUser.check(login, token);
  console.log(result);
  if( result ){
    var user = {'auth': true, 'login': result.login, 'token': result.token, 'id': result.id };
    // appUser.signin(user.login, user.id, user.token);
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
  // console.log(req.params);
  //
  var login = req.params[0];
  var token = parseInt(req.params[1]);

  appUser.signout(login, token);
  req.logout();

  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf8'
  });
  res.end(JSON.stringify({'auth': false}));
};
