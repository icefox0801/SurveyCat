'use strict';

var path = require('path');
var http = require('http');

var debug = require('debug')('server:server');

var _ = require('lodash');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Server = function (config) {
  this.cofig = _.assign({}, Server.defaults, config);
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
    var routes = require('./routes/index');
    var users = require('./routes/users');
    // view engine setup
    self.app.set('views', path.join(__dirname, 'views'));
    self.app.set('view engine', 'ejs');
    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    self.app.use(logger('dev'));
    self.app.use(bodyParser.json());
    self.app.use(bodyParser.urlencoded({ extended: false }));
    self.app.use(cookieParser());
    self.app.use(express.static(path.join(__dirname, 'public')));
    self.app.use('/', routes);
    self.app.use('/users', users);
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
      self.app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }
    // production error handler
    // no stacktraces leaked to user
    self.app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });

  },
  start: function () {
    var self = this;
    var port = self.config.port;

    self.app.set('port', port);

    var server = http.createServer(self.app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }

  }
};
