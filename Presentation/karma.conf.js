var jqueryPath = require.resolve('jquery');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'sinon', 'chai', 'chai-jquery', 'chai-as-promised', 'sinon-chai'],
    files: [
      jqueryPath,
      'web/build/presentation.js',
      'client/**/*-test.js'
    ].concat(config.files),
    reporters: [ 'progress' ],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [ 'PhantomJS' ],
    //browsers: [ 'Chrome' ],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    captureTimeout: 60000,
    singleRun: false,
    browserNoActivityTimeout: 20000
  });
};
