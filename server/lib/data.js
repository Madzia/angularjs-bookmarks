module.exports = function(dbName){

  var mongo = require('mongodb');

  //database connection
  var dbc = new mongo.Db(dbName || 'test', new mongo.Server('localhost', 27017), {safe: true});

  //internal functions
  var InsertData = function (collName, data, callback){
    dbc.open(function (err){
      if(err){
        dbc.close();
        // console.log("MongoDB disconnected with err!");
        // console.log(err);
        callback(err, undefined);
      }
      else{
        // console.log("MongoDB connected!");
        dbc.collection(collName, function(err, coll){
          if(err){
            dbc.close();
            // console.log("MongoDB disconnected with err!");
            // console.log(err);
            callback(err, undefined);
          }
          else{
            coll.insert(data, function(err, item){
              if(err){
                dbc.close();
                // console.log("MongoDB disconnected with err!");
                // console.log(err);
                callback(err, undefined);
              }
              else{
                dbc.close();
                // console.log("MongoDB disconnected!");
                callback(undefined, item[0]);
              }
            });
          }
        });
      }
    });
  };

  var RemoveData = function (collName, query, callback){
    dbc.open(function (err){
      if(err){
        dbc.close();
        // console.log("MongoDB disconnected with err!");
        // console.log(err);
        callback(err, undefined);
      }
      else{
        // console.log("MongoDB connected!");
        dbc.collection(collName, function(err, coll){
          if(err){
            dbc.close();
            // console.log("MongoDB disconnected with err!");
            // console.log(err);
            callback(err, undefined);
          }
          else{
            coll.remove(query, function(err, result){
              if(err){
                dbc.close();
                // console.log("MongoDB disconnected with err!");
                // console.log(err);
                callback(err, undefined);
              }
              else{
                dbc.close();
                // console.log("MongoDB disconnected!");
                callback(undefined, result);
              }
            });
          }
        });
      }
    });
  };

  var RemoveAllData = function (collName, query, callback){
    dbc.open(function (err){
      if(err){
        dbc.close();
        // console.log("MongoDB disconnected with err!");
        // console.log(err);
        callback(err, undefined);
      }
      else{
        // console.log("MongoDB connected!");
        dbc.collection(collName, function(err, coll){
          if(err){
          dbc.close();
          // console.log("MongoDB disconnected with err!");
          // console.log(err);
          callback(err, undefined);
          }
          else{
            coll.update(query, {$set: {"trash": true}}, {multi: true}, function(err, result){
              if(err){
                dbc.close();
                // console.log("MongoDB disconnected with err!");
                // console.log(err);
                callback(err, undefined);
              }
              else{
                dbc.close();
                // console.log("MongoDB disconnected!");
                callback(undefined, result);
              }
            });
          }
        });
      }
    });
  };

  var UpdateData = function (collName, query, setter, callback){
    dbc.open(function (err){
      if(err){
        dbc.close();
        // console.log("MongoDB disconnected with err!");
        // console.log(err);
        callback(err, undefined);
      }
      else{
        // console.log("MongoDB connected!");
        dbc.collection(collName, function(err, coll){
          if(err){
            dbc.close();
            // console.log("MongoDB disconnected with err!");
            // console.log(err);
            callback(err, undefined);
          }
          else{
            coll.update(query, setter /*{$set: data}*/, function(err, item){
              if(err){
                dbc.close();
                // console.log("MongoDB disconnected with err!");
                // console.log(err);
                callback(err, undefined);
              }
              else{
                dbc.close();
                callback(undefined, item);
                // console.log("MongoDB disconnected!");
              }
            });
          }
        });
      }
    });
  };

  var FindData = function (collName, query, callback){
    dbc.open(function (err){
      if(err){
        dbc.close();
        // console.log("MongoDB disconnected with err!");
        // console.log(err);
        callback(err, undefined);
      }
      else{
        // console.log("MongoDB connected!");
        dbc.collection(collName, function(err, coll){
          if(err){
            dbc.close();
          // console.log("MongoDB disconnected with err!");
          // console.log(err);
          callback(err, undefined);
          }
          else{
            // query.trash = false;
            coll.findOne(query, function(err, item){
              if(err){
                dbc.close();
                // console.log("MongoDB disconnected with err!");
                // console.log(err);
                callback(err, undefined);
              }
              else{
                dbc.close();
                // console.log("MongoDB disconnected!");
                callback(undefined, item);
              }
            });
          }
        });
      }
    });
  };

  var FindAllData = function (collName, query, callback){
    dbc.open(function (err){
      if(err){
        dbc.close();
        // console.log("MongoDB disconnected with err!");
        console.log(err);
        callback(err, undefined);
      }
      else{
        // console.log("MongoDB connected!");
        dbc.collection(collName, function(err, coll){
          if(err){
            dbc.close();
            // console.log("MongoDB disconnected with err!");
            // console.log(err);
            callback(err, undefined);
          }
          else{
            // query.trash = false;
            coll.find(query).toArray(function(err, item){
              if(err){
                dbc.close();
                // console.log("MongoDB disconnected with err!");
                // console.log(err);
                callback(err, undefined);
              }
              else{
                dbc.close();
                // console.log(item);
                callback(undefined, item);
                // console.log("MongoDB disconnected!");
              }
            });
          }
        });
      }
    });
  };

  return{
    insertData: InsertData,
    removeData: RemoveData,
    removeAllData: RemoveAllData,
    updateData: UpdateData,
    findData: FindData,
    findAllData: FindAllData
  }

};
