module.exports = function (Data){

  return {
    //users
    'addUser': function ( user, callback ) {
      user.id = new Date().getTime();
      Data.insertData('user', user, callback);
    },
    'findAllUsers': function ( callback ) {
      Data.findAllData('user', undefined, callback);
    },
    'findUserById': function ( id, callback ) {
      Data.findData('user', { 'id': id }, callback);
    },
    'findUserByLogin': function( login, callback ) {
      Data.findData('user', { 'login': login }, callback);
    },
    //categories
    'addCategory': function ( category, callback ) {
      category.id = new Date().getTime();
      Data.insertData('category', category, callback);
    },
    'findAllCategories': function ( callback ) {
      Data.findAllData('category', undefined, callback);
    },
    'editCategory': function ( category, callback ) {
      Data.updateData('category', { 'id': category.id },
      { $set: { 'name': category.name } }, callback);
    },
    'rmCategory': function ( category, callback ) {
      Data.removeData('category', { 'id': category.id }, callback);
    },
    //bookmarks
    'addBookmark': function ( bookmark, callback ) {
      bookmark.id = new Date().getTime();
      Data.insertData('bookmark', bookmark, callback);
    },
    'findAllBookmarks': function ( callback ) {
      Data.findAllData('bookmark', undefined, callback);
    },
    'editBookmark': function ( bookmark, callback ) {
      Data.updateData('bookmark', { 'id': bookmark.id },
      { $set: { 'name': bookmark.name, 'url': bookmark.url } }, callback);
    },
    'rmBookmark': function ( bookmark, callback ) {
      Data.removeData('bookmark', { 'id': bookmark.id }, callback);
    }
  }
};
