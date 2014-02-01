/**
 * Created by wassi on 19.01.14.
 */
/**
 * Created by wassi on 19.01.14.
 */



var hardwareAccess = require('./hardwareAccess');
var hardware = require('../models/hardware');

var pin = hardware.sensors.brightness;
hardwareAccess.getAverageValues(pin.pin,600000,5);


//map from 0 to 100 (arbitrarily chosen)

var map = function(v){
    return v/10.24;
};
exports.getAmbientBrightness = function(){
    return hardwareAccess.getSensor(pin.pin,pin.type,map);
};

