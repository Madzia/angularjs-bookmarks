module.exports = function (Data){

  return {
    'addUser': function ( user, callback ) {
      Data.insertData('user', user, callback);
    },
    'findAllUsers': function ( callback ) {
      Data.findAllData('user', undefined, callback);
    }
  }
};
