module.exports = function(config) {
  config.set({
    frameworks: [ 'mocha', 'chai', 'sinon' ],
    files: [
      'web/build/build.js',
      'web/build/test.js'
    ],
    reporters: [ 'progress' ],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ 'PhantomJS' ],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    captureTimeout: 60000,
    singleRun: false,
    browserNoActivityTimeout: 20000
  });
};
