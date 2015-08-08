var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var open = require('open');
var exec = require('child_process').exec;

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


open('http://localhost:3000');
console.log('Opening http://localhost:3000...');

var app = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');


app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/get', express.static('/'));

app.use('/', routes.index);
app.use(/\/path=.+/, routes.index);
app.use('/ls', routes.lsCommand);
app.use('/rm', routes.rmCommand);
app.use('/mv', routes.mvCommand);
app.use('/set', routes.setCommand);
app.use('/mkdir', routes.mkdirCommand);
app.use('/open', routes.openCommand);
app.use('/watch', routes.watchCommand);
app.use('/thumb', routes.thumbCommand);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;