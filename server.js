// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const http = require('http');
// const app = express();



// //========================DB CONN ====================//
// var mongoose = require("mongoose");
// mongoose.Promise = global.Promise; mongoose.connect("mongodb://localhost:27017/mean");


// // ROUTES FOR OUR API
// // =============================================================================
// var router = express.Router();              // get an instance of the express Router
// //SET CORS TO ACCESS API FROM ANGULAR
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// // API file for interacting with MongoDB
// //const aws = require('./server/routes/api');

// // Parsers
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // Angular DIST output folder
// app.use(express.static(path.join(__dirname, 'dist')));

// // API location
// //app.use('/api', api);
// // more routes for our API will happen here

// // REGISTER OUR ROUTES -------------------------------
// // all of our routes will be prefixed with /api
// app.use('/api', require('./server/routes/api'));
// // Send all other requests to the Angular app
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/angular-registration-login-example/index.html'));
// });

// //Set Port
// const port = process.env.PORT || '3000';
// app.set('port', port);

// const server = http.createServer(app);

// server.listen(port, () => console.log(`Running on localhost:${port}`));

var app = require('./app');
var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    console.log('Express server listening on port ' + port);

});