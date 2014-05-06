var isProd,
    appConfigEnv,
    gulp      = require('gulp'),
    gutil     = require('gulp-util'),
    clean     = require('gulp-clean'),
    uglifyjs  = require('gulp-uglifyjs'),
    minifyCSS = require('gulp-minify-css'),
    pushState = require('connect-pushstate/lib/pushstate').pushState,
    connect   = require('gulp-connect'),
    concat    = require('gulp-concat-util'),
    Notifier  = require('node-notifier'),
    component    = require('./component-gulp-adapter'),
    args         = require('yargs').argv,
    path         = require('path'),
    es           = require('event-stream');

var notifier = new Notifier();

var karma = require('gulp-karma')({
  configFile: 'karma.conf.js'
});

isProd       = args.production;
appConfigEnv = args.target || (isProd ? 'production' : 'development');

var sitePrefix = '';

var dirs = {
  web: 'web',
  build: sitePrefix + 'web/build',
  src: 'client'
};

var testlibs = [
  require.resolve('jquery'),
  path.join(path.dirname(require.resolve('chai')), 'chai.js'),
  path.join(path.dirname(require.resolve('mocha')), 'mocha.js'),
  require.resolve('chai-jquery'),
  require.resolve('sinon-chai'),
  path.join(path.dirname(require.resolve('sinon')), '..', 'pkg', 'sinon.js')
];

var testStyles = [
  path.join(path.dirname(require.resolve('mocha')), 'mocha.css')
];

var programName = 'presentation';
var componentOptions = {
  development: !isProd,
  install:     true,
  verbose:     true,
  alias:       true,
  require:     true,
  umd:         false,
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

gulp.task('build:testlibs', ['build'], function() {
  return gulp.src(testlibs)
  .pipe(concat(programName + '-testlibs.js'))
  .pipe(gulp.dest(dirs.build));
});

gulp.task('build:teststyles', function() {
  return gulp.src(testStyles)
  .pipe(concat(programName + '-teststyles.css'))
  .pipe(gulp.dest(dirs.build));
});

gulp.task('build:tests', ['build:testlibs', 'build:teststyles'], function() {
  return gulp.src(dirs.src + '/**/*-test.js')
  .pipe(concat(programName + '-tests.js'))
  .pipe(gulp.dest(dirs.build));
});

gulp.task('karma:run', ['build'], function () {
  var run = karma.run;
  run({}, function (code) {
    console.log('test');
    notifier.notify({
      title: ProgramName,
      message: 'Tests failed: ' + code
    });
  });
  return run;
});

gulp.task('connect:reload', ['build:tests'], function () {
  connect.reload();
});

gulp.task('watch', ['connect', 'build:tests'], function () {
  karma.start().then(karma.run);
  gulp.watch([dirs.src + '/**/*'], ['connect:reload', 'karma:run']);
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

gulp.task('test',['build'], function() {
  return karma.once();
});

gulp.task('build', ['component:build']);

gulp.task('default', ['build']);

gutil.log('**********************************************');
gutil.log('* gulp              (development build)');
gutil.log('* gulp --production (production build)');
gutil.log('* gulp clean        (rm /web/build)');
gutil.log('* gulp test         (run karma tests and exit)');
gutil.log('* gulp watch        (build and run tests and dev server on localhost:9001)');
gutil.log('');
gutil.log('Current environment: ' + appConfigEnv);
gutil.log('**********************************************');
