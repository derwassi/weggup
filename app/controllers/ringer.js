/**
 * This controller controls the ringing. It creates cronjobs for the alarms of the currently active user
 * it is called each time, the alarms get modified
 */

/**
 * Module dependencies.
 */
var _ = require('underscore');
var mongoose = require('mongoose');
Alarm = mongoose.model('Alarm');

var alarmScheduler = require('../services/alarmScheduler');
var alarmModule = require('../modules/soundAndLight/alarmModule');





exports.update = function (req, res) {

    Alarm.find().exec(function (err, alarms) {
        alarmScheduler.clear();
        alarmScheduler.schedule(alarms,alarmModule);

    });


};

