var Build   = require('component-build'),
    resolve = require('component-resolver'),
    gutil     = require('gulp-util'),
    File        = require('vinyl'),
    through     = require('through');


module.exports = {
  resolve: function (basePath, options, cb) {
    resolve(basePath, options, function (err, tree) {
      if (err) throw err;
      var build = Build(tree, options);
      var defaultScriptPlugins = build.scriptPlugins;
      var defaultStylePlugins = build.stylePlugins;
      var defaultFilePlugins  = build.filePlugins;
      var func = {
        scripts: function () {
          var stream = through();
          build.scriptPlugins = function (build, options) {
            defaultScriptPlugins(build, options);

            var plugin = function (file, done) {
              gutil.log('scripts', file.filename);
              done();
            };

            build
              .use('scripts', plugin);
          };

          build.scripts(function (err, string) {
            if (err) throw err;
            stream.end(new File({
              cwd:  basePath,
              base: options.base || basePath,
              path: 'build.js',
              contents: new Buffer(string)
            }));
          });

          return stream;
        },

        styles: function () {
          var stream = through();
          build.stylePlugins = function (build, options) {
            defaultStylePlugins(build, options);
            var plugin = function (file, done) {
              stream.write(new File({
                cwd:  basePath,
                base: options.base || basePath,
                path: file.filename,
                contents: new Buffer(file.string)
              }));
              gutil.log('styles', file.filename);
              done();
            };

            build
              .use('styles', plugin);
          };

          build.styles(function (err, string) {
            if (err) throw err;
            stream.end();
          });

          return stream;
        },
        files: function () {
          var stream = through();
          build.filePlugins = function (build, options) {
            var plugin = function (file, done) {
              stream.write(new File({
                cwd:  basePath,
                base: options.base || basePath,
                path: file.filename
              }));
              gutil.log('files', file.filename);
              done();
            };

            build
              .use('images', plugin)
              .use('fonts', plugin)
              .use('files', plugin);
          };

          build.files(function (err) {
            if (err) throw err;
            stream.end();
          });

          return stream;
        }
      };
      cb(func);
    });
  }
};
