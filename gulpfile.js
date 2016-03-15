var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var header = require('gulp-header');
var pkg = require('./package.json');
var clean = require('gulp-clean');
var replace = require('gulp-replace');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('versionJs', function() {

  gulp.src('config.js')
    .pipe(replace(/window\.VERSION = (\"\d?\.\d?\.1?\d?\d\")/g, 'window.VERSION = "'+pkg.version+'"'))
    .pipe(gulp.dest('.'));

  gulp.src('www/js/config.js')
    .pipe(replace(/window\.VERSION = (\"\d?\.\d?\.1?\d?\d\")/g, 'window.VERSION = "'+pkg.version+'"'))
    .pipe(gulp.dest('www/js/'));

});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('bump', require('gulp-cordova-bump'));

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('install-baztille', function(done) {
  gulp.src('./config.js')
    .pipe(gulp.dest('./www/js/'));
});

require('gulp-ionic-webbuild')(gulp, {
  templatesModule: 'app.controllers',
  wwwWeb: 'dist'
});
