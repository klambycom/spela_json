var gulp = require('gulp');
var to5 = require('gulp-6to5');
var browserify = require('gulp-browserify');
var markdox = require('gulp-markdox');
var rename = require('gulp-rename');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');

var paths = {
  js:    'src/**/*.js',
  dist:  'dist',
  docs:  'docs',
  tests: 'test/**/*_test.js',
  example: {
    html: 'example.html',
    js:   'example.js',
    dist: 'dist/example'
  }
};

gulp.task('6to5', function () {
  return gulp.src(paths.js)
    .pipe(to5())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('example:browserify', function () {
  return gulp.src(paths.example.js)
    .pipe(browserify({ transform: '6to5ify', debug: true }))
    .pipe(gulp.dest(paths.example.dist));
});

gulp.task('example:html', function () {
  return gulp.src(paths.example.html)
    .pipe(gulp.dest(paths.example.dist));
});

gulp.task('docs', function () {
  return gulp.src(paths.js)
    .pipe(markdox())
    .pipe(rename({ extname: '.markdown' }))
    .pipe(gulp.dest(paths.docs));
});

gulp.task('jasmine', function () {
  return gulp.src(paths.tests)
    .pipe(jasmine());
});

gulp.task('watch:test', function () {
  gulp.watch([paths.js, paths.tests], ['jasmine']);
});

gulp.task('lint', function () {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['6to5', 'example', 'docs']);
  gulp.watch(paths.example.js, ['example']);
});

gulp.task('example', ['example:browserify', 'example:html']);
gulp.task('default', ['6to5']);
