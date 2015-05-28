'use strict';

var istanbul = require('browserify-istanbul');
var proxyquireify = require('proxyquireify');

module.exports = function(config) {
  config.set({

    basePath: '.',

    exclude: [],

    preprocessors: {
      './test/**/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      plugin: [
        proxyquireify.plugin
      ],
      transform: [istanbul({
        ignore: ['**/node_modules/**', '**/test/**'],
      })]
    },

    frameworks: ['browserify', 'jasmine'],

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: './build/coverage/'
    },

    colors: true,

    logLevel: config.LOG_INFO,

    port: 9876,

    browsers: [
      'PhantomJS'
    ],

    autoWatch: false,

    singleRun: true
  });

};
