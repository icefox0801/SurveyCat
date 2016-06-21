'use strict';

var path = require('path');

var _ = require('lodash');
var fs = require('graceful-fs');
var inquirer = require('inquirer');
var moment = require('moment');
var ini = require('ini');
var Promise = require('bluebird');

var logger = require('./util/logger');
var errorHandler = require('./util/errorHandler');

var getQuestions = function (survey) {
  return [
    {
      name: 'title',
      type: 'input',
      message: 'title: ',
      default: 'Survey',
      validate: function (value) {
        var isValid = value.toString().match(/^[\s\S]{1,200}$/i);
        return isValid ? true : 'Invalid survey title';
      }
    },
    {
      name: 'port',
      type: 'input',
      message: 'port: ',
      default: 8016,
      validate: function (value) {
        var isValid = value.toString().match(/^[0-9]+$/i);
        return isValid ? true : 'Invalid port number';
      }
    },
    {
      name: 'startDatetime',
      type: 'input',
      message: 'start datetime: ',
      default: moment().format('YYYY-MM-DD HH:mm'),
      validate: function (value) {
        var isValid = moment(value, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD']).isValid();
        return isValid ? true : 'Invalid start datetime';
      }
    },
    {
      name: 'endDatetime',
      type: 'input',
      message: 'end datetime: ',
      default: moment().add(1, 'd').format('YYYY-MM-DD HH:mm'),
      validate: function (value) {
        var isValid = moment(value, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD']).isValid();
        return isValid ? true : 'Invalid end datetime';
      }
    }
  ];
};

module.exports = function (survey, options) {
  var surveyDir = path.join(options.root, survey);
  var configFile = path.join(surveyDir, 'config.ini');
  logger.info('Initializing a survey');
  Promise.try(function () {

    if (fs.existsSync(surveyDir)) {
      throw new Error('Survey named ' + survey.red + ' has already been initialized.');
    }

    return inquirer.prompt(getQuestions(survey))
      .then(function (answers) {
        var config = _.assign({}, { name: survey }, answers);
        fs.mkdirSync(surveyDir);
        fs.writeFileSync(configFile, ini.stringify(config));
        logger.info('Finish initializing a survey named ' + survey.yellow);
      });
  })
    .catch(errorHandler)
};