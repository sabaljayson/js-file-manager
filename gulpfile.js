var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('browserify', function() {
  browserifyShare();
});

function browserifyShare() {
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  b = watchify(b);

  b.on('update', function() {
    bundleShare(b);
  });

  b.on('log', console.error);
  
  b.add('./jsx/main.js');
  bundleShare(b);
}

function bundleShare(b) {
  b.bundle()
    .pipe(source('jsx/main.js'))
    .pipe(rename('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
}