#!/usr/bin/env node

var //es6modules = require('builder-es6-module-to-cjs'),
    program = require('commander'),
    Resolve = require('component-resolver'),
    utils   = require('component-consoler'),
    Build   = require('component-build'),
    Builder = require('component-builder'),
    mkdirp  = require('mkdirp'),
    path    = require('path'),
    fs      = require('fs');

    exists = fs.existsSync || path.existsSync,
    log    = utils.log;

if (!exists('component.json')) utils.fatal('missing component.json');

  program
    .usage('component build [scripts] [styles] [files]')
    .option('-o, --out <dir>', 'output directory defaulting to ./build', 'build')
    .option('-n, --name <file>', 'base name for build files defaulting to build', 'build')
    .option('-d, --dev', 'build development dependencies, use aliases, and use sourceURLs')
    .option('-s, --standalone <name>', 'build a standalone, UMD-wrapped version of the component with the given global name')
    .option('-R, --no-require', 'exclude require from build')
    .option('-p, --prefix <str>', 'prefix css asset urls with <str>', '')
    .option('-b, --browsers <string>', 'browsers to support with autoprefixer')
    .option('-c, --copy', 'copy files instead of linking')
    .option('--umd', 'alias for --standalone')

  program.on('--help', function(){
    console.log('  Examples:');
    console.log();
    console.log('    # build to ./build');
    console.log('    $ component build');
    console.log();
    console.log('    # build to ./dist as assets.js, assets.css');
    console.log('    $ component build -o dist -n assets');
    console.log();
    console.log('    # build as standalone as window.$');
    console.log('    $ component build --standalone $');
    console.log();
    console.log('    # build only .js');
    console.log('    $ component build scripts');
    console.log();
    process.exit();
  });

program.parse(process.argv);

var options = {
  paths: {
    scripts:     program.name + '.js',
    testScripts: program.name + '-test.js',
    styles:      program.name + '.css'
  },

  development: program.dev,
  install:     true,
  verbose:     true,
  require:     program.require,
  umd:         program.standalone || program.umd || '',
  prefix:      program.prefix || '',
  browsers:    program.browsers || '',
  destination: program.out,
  copy:        program.copy,
  watch:       program.watch
};

mkdirp.sync(options.destination);

function resolve() {
  var start = Date.now();

  Resolve(process.cwd(), options, function (err, tree) {
    resolving = false;

    if (err) {
      if (!watching) utils.fatal(err);
      utils.error('build', 'resolve failed: ' + err.message);
      return;
    }

    build          = Build(tree, options);
    var plugins    = Builder.plugins;
    var oldPlugins = build.scriptPlugins;

    build.scriptPlugins = function (build, options) {
      build
      .use('testScripts',
        //es6modules(options),
        plugins.js(options));

      oldPlugins(build, options);
    };

    log('build', 'resolved in ' + (Date.now() - start) + 'ms');

    var createResource = function(key, isMulti) {
      var start    = Date.now();
      resourcePath = path.join(program.out, options.paths[key]);

      (build[key])(function (err, file) {
        if (err) utils.fatal(err);
        if (!isMulti) {
          if (!file) return;
          fs.writeFile(resourcePath, file);
        }
        log('build', resourcePath + ' in '
          + (Date.now() - start) + 'ms - '
          + (file.length / 1024 | 0) + 'kb');
      });
    };

    createResource('scripts');
    createResource('testScripts');
    createResource('styles');
    createResource('files', true);
  });
};

resolve();
