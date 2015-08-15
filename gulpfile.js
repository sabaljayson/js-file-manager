var gulp = require('gulp');
var empty = require('gulp-empty');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var Thumbnails = require('./utils/Thumbnails');
var removeOldFiles = require('./utils/removeOldFiles');

gulp.task('browserify-debug', function() {
  browserifyShare(true);
});

gulp.task('browserify', function() {
  browserifyShare();
});

gulp.task('remove-thumbs', function() {
  removeOldFiles(Thumbnails.dir, 0, Thumbnails.skipRemoveOfFiles);
});

function browserifyShare(debug) {
  debug = !! debug;

  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: debug
  });

  b = watchify(b);

  b.on('update', bundleShare.bind(this, b, debug));
  b.on('log', console.error);
  
  b.add('./jsx/main.js');
  bundleShare(b, debug);
}

function bundleShare(b, debug) {
  b.bundle()
    .pipe(source('jsx/main.js'))
    .pipe(rename('bundle.js'))
    .pipe(buffer())
    .pipe((debug ? empty : uglify)())
    .pipe(gulp.dest('./public/js'));
}