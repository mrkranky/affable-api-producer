var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var request = require('request');
var http = require('http');
http.globalAgent.maxSockets = 10;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var moment = require('moment');

var kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer;
var client = new kafka.Client('127.0.0.1:2181', 'affable-producer-node-1',
    {}, {
        //noAckBatchSize: 2000000, // 2 MB
        noAckBatchAge: 4000 // 4 Sec
    });
var producer = new HighLevelProducer(client, {requireAcks: 0});

producer.on('ready', function () {
    console.log("Producer started..");

    for (var j=0; j<100; j++) {
        for (var i=1000000; i<1001000;i++) {
            request("http://localhost:3000/api/v1/influencers/" + i, function (error, response, body) {
                console.log(body);
                if (!error && response.statusCode === 200) {
                    // prepare the message object and add timestamp to it.
                    var message = JSON.parse(body);
                    message.timestamp = moment().valueOf();

                    // make the payload
                    var payload = [{
                        topic: "influencers",
                        messages: JSON.stringify(message)
                    }];

                    producer.send(payload, function(err, data) {
                    });

                    payload = null;
                    message = null;
                } else {
                    console.log("GOT ERROR: " + error);
                }
            });
        }
    }
});

producer.on('error', function (err) {});
module.exports = app;
