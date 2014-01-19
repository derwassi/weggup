/**
 * Created by wassi on 19.01.14.
 */


    var hardwareAccess = require('./hardwareAccess');
var Hardware = require('mongoose').model('Hardware');
var hardware = {};



exports.updateHardware = function () {
    Hardware.find().populate('user', 'name username').exec(function (err, hardwares) {
        if (hardwares.length > 0) {
            hardware = hardwares[0];
        }
    });
};

exports.updateHardware();


exports.setColor = function (r,g,b) {
    //console.log('test',model);
    hardwareAccess.setActuator(r, hardware.actuators['red'].pin, hardware.actuators['red'].mode, function (v) {
        return map(v, 0, 255, 0, 1);
    });
    hardwareAccess.setActuator(g, hardware.actuators['green'].pin, hardware.actuators['green'].mode, function (v) {
        return map(v, 0, 255, 0, 1);
    });
    hardwareAccess.setActuator(b, hardware.actuators['blue'].pin, hardware.actuators['blue'].mode, function (v) {
        return map(v, 0, 255, 0, 1);
    });
};

//TODO: überhitzungsschutz