exports.signin = function(req, res){
  res.cookie('AuthUser', JSON.stringify(req.user));
  res.send(req.user);
}

exports.check = function(req, res){
  console.log('check');
  console.log(req.user);
  if( req.isAuthenticated() ){
    console.log('isAuth');
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf8'
    });
    res.end( JSON.stringify( { 'auth': true, 'login': req.user.login, 'id': req.user.id } ) );
  }
  else {
    console.log('isNotAuth');
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf8'
    });
    res.end( JSON.stringify( { 'auth': false } ) );
  }

};

exports.signout = function(req, res){
  req.logout();

  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf8'
  });
  res.end( JSON.stringify( { 'auth': false } ) );
};
