'use strict';

var path = require('path');

var fs = require('graceful-fs');
var ini = require('ini');

var Server = require('../server');

module.exports = function (survey, options) {
  var surveyDir = path.join(options.root, survey);
  var configFile = path.join(surveyDir, 'config.ini');

  if (!fs.existsSync(configFile)) {
    throw new Error('Survey named ' + survey.yellow + ' has not been initialized before');
  }

  var config = ini.parse(fs.readFileSync(configFile, 'utf-8'));

  config.name = survey;
  config.dir = surveyDir;

  var server = new Server(config);
  server.initialize();
  server.start();

};