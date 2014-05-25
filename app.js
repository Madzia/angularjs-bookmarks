var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var appUser = require('./lib/users.js')();

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.logger('dev'));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get(/api\/auth\/([\w\d]+)\/([\w\d]+)/, function (req, res) { routes.auth(req, res, appUser); });
