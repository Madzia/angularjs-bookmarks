module.exports = function () {
  var loggedinUsers = [];
  var users = [
    { 'login': 'mateusz', 'password': 'superhaslo' }
  ];
  return {
    'signin': function ( login, token ) {
      loggedinUsers.push({'login': login, 'token': token});
    },
    'signout': function ( login, token ) {
      for(var i = 0; i < loggedinUsers.length; i++){
        if(loggedinUsers[i].login === login && loggedinUsers[i].token === token){
          loggedinUsers.splice(i,1);
        }
      }
    },
    'signup': function ( login, password ) {
      users.push({'login': login, 'password': password});
    },
    'auth': function ( login, password ) {
      for(var i = 0; i < users.length; i++){
        if(users[i].login === login && users[i].password === password){
          return true;
        }
      }
      return false;
    },
    'check': function ( login, token ) {
      for(var i = 0; i < loggedinUsers.length; i++){
        if(loggedinUsers[i].login === login && loggedinUsers[i].token === token){
          return true;
        }
      }
      return false;
    }
  };
};
