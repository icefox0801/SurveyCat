'use strict';

var logger = require('./logger');

module.exports = function (err) {
  if ('string' === typeof err) {
    err = new Error(err);
  }

  logger.error(err.message);
  process.stdout.emit('data', err);

  if ('debug' === process.env.NODE_ENV) {
    logger.error(err.stack);
  }
};