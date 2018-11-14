var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');  //Custom
var bluebird = require('bluebird');
var config = require('./config');

var app = express();

var cons = require('consolidate');




app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,x-access-token, Accept");
    next();
});



// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist/angular-registration-login-example')));
app.use('/api', apiRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);


//Database connection --
var mongoose = require('mongoose')
mongoose.Promise = bluebird

mongoose.connect(config.DATABASE)
        .then(() => {
            console.log(`Succesfully Connected to theMongodb Database..`)
        })
        .catch(() => {
            console.log(`Error Connecting to the Mongodb Database...`)
        })
       // catch 404 and forward to error handler 
       app.use(function (req, res, next) {
       next(createError(404));
});


// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost");
//     res.header("Access-Control-Allow-Headers", "*");
//     res.header("Access-Control-Allow-Credentials","true");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

//     next();
// });

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
