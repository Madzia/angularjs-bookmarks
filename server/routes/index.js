exports.signin = function(req, res){
  res.cookie('AuthUser', JSON.stringify(req.user));
  res.send(req.user);
}

exports.check = function(req, res, appUser){
  var login = req.params[0];
  var token = parseInt(req.params[1]);
  console.log("verify");
  var result = appUser.check(login, token);
  console.log(result);
  if( result ){
    var user = {'auth': true, 'login': result.login, 'token': result.token, 'id': result.id };
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
  var login = req.params[0];
  var token = parseInt(req.params[1]);

  appUser.signout(login, token);
  req.logout();

  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf8'
  });
  res.end(JSON.stringify({'auth': false}));
};
