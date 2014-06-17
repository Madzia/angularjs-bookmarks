module.exports = function ( Manager ) {
  var loggedinUsers = [];

  return {
    'signin': function ( login, id, token ) {
      console.log("signin");
      loggedinUsers.push({'login': login, 'token': token, 'id': id});
      console.log(loggedinUsers);
    },
    'signout': function ( login, token ) {
      for(var i = 0; i < loggedinUsers.length; i++){
        if(loggedinUsers[i].login === login && loggedinUsers[i].token === token){
          loggedinUsers.splice(i,1);
        }
      }
    },
    'check': function ( login, token ) {
      console.log("check");
      console.log(loggedinUsers);
      for(var i = 0; i < loggedinUsers.length; i++){
        if(loggedinUsers[i].login === login && loggedinUsers[i].token === token){
          console.log(loggedinUsers[i].login + " : " + loggedinUsers[i].token + " ? " +
            (loggedinUsers[i].login === login && loggedinUsers[i].token === token) );
          return loggedinUsers[i];
        }
      }
      return undefined;
    }
  };
};
