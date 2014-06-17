var express = require('express');
var routes = require('./server/routes');
var http = require('http');
var path = require('path');
var appServer = require('./server/lib/server.js');
var appData = require('./server/lib/data.js')('angularBookmarks');
var appManager = require('./server/lib/manager.js')(appData);
var appUser = require('./server/lib/users.js')(appManager);

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.logger());

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

appServer.listen(server, appUser, appManager);

app.get(/api\/auth\/([\w\d]+)\/([\w\d]+)/, function (req, res) { routes.auth(req, res, appUser, appManager); });

app.get(/api\/verify\/([\w\d]+)\/([\d]+)/, function (req, res) { routes.check(req, res, appUser, appManager); });

app.get(/api\/out\/([\w\d]+)\/([\d]+)/, function (req, res) { routes.signout(req, res, appUser, appManager); });
