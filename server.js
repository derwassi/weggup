/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    logger = require('mean-logger');



/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    mongoose = require('mongoose');


//Bootstrap db connection
var db = mongoose.connect(config.db);

//Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);


var app = express();

//express settings
require('./config/express')(app, db);

//Bootstrap routes
require('./config/routes')(app);

//Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

//Initializing logger
logger.init(app, {},mongoose);

//initialize sockets
require('./app/services/directControlSocket');

//initialize logging
require('./app/hardware/hardwareAccess');
require('./app/dataLogger/brightnessLogger').start();
require('./app/dataLogger/movementLogger').start();
require('./app/dataLogger/TemperatureLogger').start();
require('./app/hardware/buttonAccess');






Alarm = mongoose.model('Alarm');
var alarmScheduler = require('./app/services/alarmScheduler');
var alarmModule = require('./app/modules/soundAndLight/alarmModule');

    Alarm.find().exec(function (err, alarms) {
        alarmScheduler.clear();
        alarmScheduler.schedule(alarms,alarmModule);

    });

//expose app
exports = module.exports = app;
