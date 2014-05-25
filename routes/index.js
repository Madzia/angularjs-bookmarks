exports.auth = function(req, res, appUser){
  var sid = req.sessionID;

  console.log("sid: " + sid);

  console.log(req.params);

  var login = req.params[0];
  var password = req.params[1];

  if( appUser.auth(login, password) ){
    var user = {'auth': true, 'login': login, 'token': new Date().getTime() };
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
