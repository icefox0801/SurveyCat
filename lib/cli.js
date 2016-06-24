'use strict';

var path = require('path');

var _ = require('lodash');
var fs = require('graceful-fs');
var program = require('commander');
var colors = require('colors');

var logger = require('./util/logger');

function getUserHome() {
  return process.env[('win32' === process.platform) ? 'USERPROFILE' : 'HOME'];
}

var home = path.join(getUserHome(), '.surveyCat');

if(!fs.existsSync(home)) {
  fs.mkdirSync(home);
} else if (!fs.lstatSync(home).isDirectory()) {
  fs.rmdirSync(home);
  fs.mkdirSync(home);
}

var cli = {};

cli.name = 'surveyCat';

cli.defaults = {
  root: home
};

cli.run = function (env) {
  /**
   * Global command
   */
  program.usage('[options]')
    .description('A tool for launching a survey');
  /**
   * Init a survey
   */
  program
    .command('init <survey>')
    .description('init a survey')
    .action(function () {
      var init = require('./init');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var survey = args[0];
      options = _.assign({}, cli.defaults, options);
      init(survey, options);
    });
  /**
   * Init a survey
   */
  program
    .command('config <survey>')
    .description('config survey questions')
    .action(function () {
      var start = require('./start');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var survey = args[0];
      options = _.assign({}, cli.defaults, options);
      options.pathname = '/config';
      start(survey, options);
    });
  /**
   * View survey report
   */
  program
    .command('report <survey>')
    .description('view survey report')
    .action(function () {
      var start = require('./start');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var survey = args[0];
      options = _.assign({}, cli.defaults, options);
      options.pathname = '/report';
      start(survey, options);
    });
  /**
   * Start a survey
   */
  program
    .command('start <survey>')
    .description('start a survey')
    .action(function () {
      var start = require('./start');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var survey = args[0];
      options = _.assign({}, cli.defaults, options);
      start(survey, options);
    });
  /**
   * Restart a survey
   */
  program
    .command('restart <survey>')
    .description('restart a survey')
    .action(function () {
      var start = require('./start');
      var stop = require('./stop');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var survey = args[0];
      options = _.assign({}, cli.defaults, options);
    });
  /**
   * Stop a survey
   */
  program
    .command('stop <survey>')
    .description('stop a survey')
    .action(function () {
      var stop = require('./stop');
      var args = [].slice.call(arguments);
      var options = args.pop();
      var survey = args[0];
      options = _.assign({}, cli.defaults, options);
      stop(survey, options);
    });
  program.parse(process.argv);
  // If no sub-commands and options are passed, output help info
  if (!process.argv.slice(2).length) {
    program.outputHelp(function (txt) {
      var json = require('../package.json');
      logger.info('surveycat version: ' + json.version.yellow);
      return txt;
    });
  }
};

module.exports = cli;
