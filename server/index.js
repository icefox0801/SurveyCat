'use strict';

var path = require('path');
var http = require('http');

var _ = require('lodash');
var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Promise = require('bluebird');

var logger = require('../lib/util/logger');

var Server = function (config) {
  this.config = _.assign({}, Server.defaults, config);
  this.app = express();
};

Server.defaults = {
  port: 8016,
  startDatetime: null,
  endDatetime: null
};


Server.prototype = {
  constructor: Server,
  initialize: function () {
    var self = this;
    var home = require('./routes/index');
    var users = require('./routes/users');
    var config = require('./routes/config');
    // view engine setup
    self.app.set('views', path.join(__dirname, 'views'));
    self.app.engine('html', require('ejs').renderFile);
    self.app.set('view engine', 'html');
    // uncomment after placing your favicon in /public
    self.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    self.app.use(morgan('dev'));
    self.app.use(bodyParser.json());
    self.app.use(bodyParser.urlencoded({ extended: false }));
    self.app.use(cookieParser());
    self.app.use(express.static(path.join(__dirname, 'public')));
    self.app.use(function (req, res, next) {
      req.surveycat = self.config;
      next();
    });
    self.app.use('/', home);
    self.app.use('/users', users);
    self.app.use('/config', config);
    // catch 404 and forward to error handler
    self.app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    // error handlers
    // development error handler
    // will print stacktrace
    if (self.app.get('env') === 'development') {
      self.app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          stack: err.stack
        });
      });
    }
    // production error handler
    // no stacktraces leaked to user
    self.app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        stack: err.stack
      });
    });

  },
  start: function () {
    var self = this;
    var port = self.config.port;

    self.app.set('port', port);

    var server = http.createServer(self.app);

    return new Promise(function (resolve, reject) {
      server.listen(port);

      server.on('listening', function () {
        var addr = server.address();
        var bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port;
        logger.info('Listening on ' + bind);
        resolve(self);
      });

      server.on('error', function (error) {

        if (error.syscall !== 'listen') {
          throw error;
        }

        var bind = typeof port === 'string'
          ? 'Pipe ' + port
          : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
        case 'EACCES':
          logger.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
        }

      });
    });

  }
};

module.exports = Server;
