var http = require('http');
var socketIo = require('socket.io');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var open = require('open');

require('sugar');

var port = 3000;

var routes = {
  index: require('./routes/index'),
  lsCommand: require('./routes/lsCommand'),
  mkdirCommand: require('./routes/mkdirCommand'),
  openCommand: require('./routes/openCommand'),
  rmCommand: require('./routes/rmCommand'),
  mvCommand: require('./routes/mvCommand'),
  watchCommand: require('./routes/watchCommand'),
  thumbCommand: require('./routes/thumbCommand'),
  setCommand: require('./routes/setCommand')
};

console.log('Open on http://localhost:' + port);

var app = express();

app.set('port', port);
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));


app.use('/', routes.index);
app.use(/\/path=.+/, routes.index);
app.use('/ls', routes.lsCommand);
app.use('/rm', routes.rmCommand);
app.use('/mv', routes.mvCommand);
app.use('/get', express.static('/'));
app.use('/set', routes.setCommand);
app.use('/mkdir', routes.mkdirCommand);
app.use('/open', routes.openCommand);
app.use('/watch', routes.watchCommand);
app.use('/thumb', routes.thumbCommand);

var server = http.createServer(app);
server.listen(port);  

var io = socketIo(server);
app.set('socketIo', io);

module.exports = app;