/**
 * Created by wassi on 19.01.14.
 */


    var hardwareAccess = require('./hardwareAccess');

var temperatureAccess = require('./temperatureAccess');

var map=function(v,fromLow,fromHigh, toLow, toHigh){
    return v/255;//TODO:
};
//TODO: temp-shutdown
//TODO: switching on fan


exports.setColor = function (r,g,b) {
    //console.log('test',model);
    hardwareAccess.setActuator(r, 27, 'pwm', function (v) {
        return map(v, 0, 255, 0, 1);
    });
    hardwareAccess.setActuator(g, 22, 'pwm', function (v) {
        return map(v, 0, 255, 0, 1);
    });
    hardwareAccess.setActuator(b, 28, 'pwm', function (v) {
        return map(v, 0, 255, 0, 1);
    });
};

//TODO: überhitzungsschutz