'use strict';

var path = require('path');
var url = require('url');

var fs = require('graceful-fs');
var ini = require('ini');
var open = require('open');
var Promise = require('bluebird');

var Server = require('../server');
var logger = require('./util/logger');
var errorHandler = require('./util/errorHandler');

module.exports = function (survey, options) {
  var surveyDir = path.join(options.root, survey);
  var configFile = path.join(surveyDir, 'config.ini');

  Promise.try(function () {
    if (!fs.existsSync(configFile)) {
      throw new Error('Survey named ' + survey.yellow + ' has not been initialized before');
    }

    var config = ini.parse(fs.readFileSync(configFile, 'utf-8'));

    config.name = survey;
    config.dir = surveyDir;

    var server = new Server(config);
    server.initialize();
    return server.start();
  })
    .then(function (server) {
      var urlObject = {
        protocol: 'http:',
        hostname: '127.0.0.1',
        port: server.config.port,
        pathname: '/config'
      };
      var urlString = url.format(urlObject);

      logger.info('Opening ' + urlString);
      return new Promise(function (resolve) {
        open(urlString, 'Google Chrome', function () {
          resolve();
        });
      });
    })
    .then(function () {

    })
    .catch(errorHandler);

};