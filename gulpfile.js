'use strict';

var gulp = require('gulp');
var karma = require('gulp-karma');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var plato = require('plato');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('test', function() {
  gulp.src('./test/**/*')
    .pipe(karma({
      configFile: './karma.conf.js',
      action: 'run'
    }));
});

gulp.task('build', function() {
  return browserify({
      entries: ['./lib/index.js']
    })
    .bundle()
    .pipe(source('abo.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('plato', function() {
  plato.inspect(['./lib/**/*.js'], './plato', {}, function() {});
});
