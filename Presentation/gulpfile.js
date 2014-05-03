var isProd,
    appConfigEnv,
    gulp      = require('gulp'),
    gutil     = require('gulp-util'),
    clean     = require('gulp-clean'),
    karma     = require('gulp-karma'),
    uglifyjs  = require('gulp-uglifyjs'),
    minifyCSS = require('gulp-minify-css'),
    pushState = require('connect-pushstate/lib/pushstate').pushState,
    connect   = require('gulp-connect'),
    concat    = require('gulp-concat-util'),
    component    = require('./component-gulp-adapter'),
    args         = require('yargs').argv,
    es           = require("event-stream");

isProd       = args.production;
appConfigEnv = args.target || (isProd ? 'production' : 'development');

var sitePrefix = '';

var dirs = {
  web: 'web',
  build: sitePrefix + 'web/build',
  src: 'client'
};

var testFiles = [
  dirs.build + '/*.js',
  dirs.src + '/**/*-test.js'
];

var programName = 'build';
var componentOptions = {
  development: !isProd,
  install:     true,
  verbose:     true,
  alias:       true,
  require:     true,
  umd:         isProd ? programName : false,
  prefix:      '',
  browsers:    '',
  destination: dirs.build,
  copy:        true
};

gulp.task('connect', function () {
  connect.server({
    root: dirs.web,
    livereload: true,
    port: 9001,
    middleware: function(connect, options) {
      return [
        pushState(sitePrefix + '/index.html'),
        connect.static(options.root)
      ];
    }
  });
});

gulp.task('clean', function() {
  return gulp.src(dirs.build, {
    read: false
  }).pipe(clean());
});


gulp.task('watch', ['build'], function () {
  gulp.watch(dirs.src + '/**/*', function () {
    gulp.run('build');
  });
  gulp.watch(dirs.build + '/**').on('change', function(file) {
    connect.reload();
  });
});

gulp.task('component:build', function (done) {
  component.resolve(__dirname, componentOptions, function (build) {
    es.concat(
      build.scripts()
        .pipe(concat(programName + '.js'))
        .pipe(isProd ? uglifyjs() : gutil.noop())
        .pipe(gulp.dest(dirs.build)),

      build.styles()
        .pipe(concat(programName + '.css'))
        .pipe(isProd ? minifyCSS() : gutil.noop())
        .pipe(gulp.dest(dirs.build)),

      build.files()
        .pipe(gulp.dest(dirs.build))
    )
    .on('error', function(err) {
      throw new gutil.PluginError('component:build', err);
    })
    .on('end', done);
  });
});

gulp.task('test', ['build'], function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: args.nowatch ? 'run' : 'watch'
    }))
    .on('error', function(err) {
      throw new gutil.PluginError('test', err);
    });
});

gulp.task('build', ['component:build']);

gulp.task('default', ['build']);

gutil.log('**********************************************');
gutil.log('* gulp              (development build)');
gutil.log('* gulp --production (production build)');
gutil.log('* gulp clean        (rm /web/build)');
gutil.log('* gulp test         (run karma tests and watch)');
gutil.log('* gulp test --nowatch (run karma tests and exit)');
gutil.log('* gulp watch        (build and run dev server)');
gutil.log('');
gutil.log('Current environment: ' + appConfigEnv);
gutil.log('**********************************************');
