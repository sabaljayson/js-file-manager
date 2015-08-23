var http = require('http');
var Path = require('path');
var open = require('open');
var express = require('express');
var socketIo = require('socket.io');
var favicon = require('serve-favicon');
var escapeRegexp = require('escape-regexp');

require('sugar');

var PORT = 3000;

var bowerPath = Path.join(__dirname, 'bower_components');
var publicPath = Path.join(__dirname, 'public');
var faviconPath = Path.join(__dirname, 'public/img/favicon.ico');

var app = express();

app.set('port', PORT);
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.use(favicon(faviconPath));
app.use(express.static(publicPath));
app.use('/bower_components', express.static(bowerPath));

var RoutesPaths = require('./routes/RoutesPaths');
var indexRegExp = new RegExp(escapeRegexp(RoutesPaths.index) + '.+');

app.use('/', 													require('./routes/index'));
app.use(indexRegExp, 									require('./routes/index'));
app.use(RoutesPaths.lsCommand, 				require('./routes/lsCommand'));
app.use(RoutesPaths.rmCommand, 				require('./routes/rmCommand'));
app.use(RoutesPaths.mvCommand, 				require('./routes/mvCommand'));
app.use(RoutesPaths.getCommand, 			require('./routes/getCommand'));
app.use(RoutesPaths.setCommand, 			require('./routes/setCommand'));
app.use(RoutesPaths.mkdirCommand, 		require('./routes/mkdirCommand'));
app.use(RoutesPaths.openCommand, 			require('./routes/openCommand'));
app.use(RoutesPaths.watchCommand, 		require('./routes/watchCommand'));
app.use(RoutesPaths.thumbCommand, 		require('./routes/thumbCommand'));

var server = http.createServer(app);

server.listen(PORT, function() {
	console.log('Open on http://localhost:' + PORT);
});

var io = socketIo(server);
app.set('socketIo', io);

module.exports = app;