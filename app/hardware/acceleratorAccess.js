/**
 * Created by wassi on 19.01.14.
 */
/**
 * Created by wassi on 19.01.14.
 */


var hardwareAccess = require('./hardwareAccess');
var hardware = require('../models/hardware');
var pin1 = hardware.sensors.motionPrimary;
var pin2 = hardware.sensors.motionSecondary;

hardwareAccess.getAverageValues(pin1.pin,100,100);
hardwareAccess.getAverageValues(pin2.pin,100,100);


var map = function(v){
   return v;
};

exports.getMainMovement = function(){
    return hardwareAccess.getSensor(pin1.pin,pin1.type,map);
};

exports.getSecondaryMovement = function(){
   return hardwareAccess.getSensor(pin2.pin,pin2.type,map);
};