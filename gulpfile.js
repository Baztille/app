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

// fork gulp-ionic-webbuild
var del = require('del');
var templateCache = require('gulp-angular-templatecache');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var minifyHtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

//opts build-web
var opts = {
    dist: 'www-dist',
    partials: 'www-dist/partials',
    templatesModule: 'app.controllers',
    wwwWeb: 'dist'
};

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

gulp.task('build-web-partials', function() {
  return gulp.src('www/{js,templates}/**/*.html')
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(templateCache('templateCacheHtml.js', { module: opts.templatesModule }))
    .pipe(gulp.dest(opts.partials));
});

gulp.task('build-web-cleanup', ['build-web-js'], function() {
  del([opts.partials]);
});

gulp.task('build-web-assets', function() {
  return gulp.src(['www/{css,img,lib/ionic/css,lib/ionic/fonts}/**/*'], { base: 'www' })
    .pipe(gulp.dest(opts.dist));
});

gulp.task('build-web-other', function() {
  return gulp.src(['www/favicon.ico'], { base: 'www' })
    .pipe(gulp.dest(opts.dist));
});

gulp.task('build-web-js', ['build-web-partials'], function() {
  var assets = useref.assets();
  var partialsInjectFile = gulp.src(opts.partials + '/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: opts.partials,
    addRootSlash: false
  };

  return gulp.src(opts.wwwWeb+'/index.html')
    .pipe(inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets)
    .pipe(gulpif('*.js', ngAnnotate()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest(opts.dist));
});

gulp.task('build-web', ['build-web-assets', 'build-web-js', 'build-web-other', 'build-web-cleanup']);


