/**
 * Created by wassi on 26.12.13.
 */

//var tweenLite = require('./tweenLite');
var shifty = require('shifty/dist/shifty');
console.log(shifty);
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


var pos = 0;

var points = [];
var length = 0;
var tw = null;
var convertTimeToMillis = function (time) {
    var t = time.split(':');
    return ((parseInt(t[0]) * 60 + parseInt(t[1])) * 1000);
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var setColor = function (model) {
    //console.log('test',model);
    hardwareAccess.setActuator(model.r, hardware.actuators['red'].pin, hardware.actuators['red'].mode, function (v) {
        return map(v, 0, 255, 0, 1);
    });
    hardwareAccess.setActuator(model.g, hardware.actuators['green'].pin, hardware.actuators['green'].mode, function (v) {
        return map(v, 0, 255, 0, 1);
    });
    hardwareAccess.setActuator(model.b, hardware.actuators['blue'].pin, hardware.actuators['blue'].mode, function (v) {
        return map(v, 0, 255, 0, 1);
    });
};

var tween = function () {

    var from = {};
    if (pos == 0) {
        from = {position: 0, color: hexToRgb(points[0].color)};
    } else {
        from = {position: points[pos - 1].position * length, color: hexToRgb(points[pos - 1].color)};
    }
    var to = {};
    if (pos == points.length) {
        to = {position: length, color: hexToRgb(points[points.length - 1].color)};
    } else {
        to = {position: points[pos].position * length, color: hexToRgb(points[pos].color)};
    }
    to.color.r = 20;

    to.onUpdate = setColor;
    to.onUpdateParams = [from];
    to.useFrames = true;


    pos++;

    tw.tween({
        from: from.color,
        to: to.color,
        duration: to.position-from.position,
        fps:30,
        //start: function () { console.log('Off I go!'); },
        step: setColor,
        callback: function () {
            //console.log('complete');
            if (pos <= points.length) {
                tween();
            }
        }
    });
    //tw = tweenLite.to(from.color,(to.position-from.position)/1000,to.color);
    //tw.render();

};

exports.play = function (p, l) {

    exports.stop();

    points = p;
    length = convertTimeToMillis(l);
    pos = 0;

    if (points && points.length > 0) {
        tw = new shifty();

        tween()
    }


};

exports.stop = function () {
    if (tw) {
        tw.stop();
    }
    setColor({color: {r: 0, g: 0, b: 0}});
};

