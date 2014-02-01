/**
 * Created by wassi on 26.12.13.
 */

//var tweenLite = require('./tweenLite');
var shifty = require('shifty/dist/shifty');

var sharedResources = require('./../../services/sharedResources');

var lightAccess = require('./../../hardware/lightAccess');
var identifier = 'light/sequenceLightModule';

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

//tweening between gradient points
var tween = function () {

    var from = {};
    if (pos === 0) {
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

    to.onUpdate = function(){
        lightAccess.setColor(from.color.r,from.color.g,from.color.b);
        };
    to.onUpdateParams = [from];
    to.useFrames = true;


    pos++;

    tw.tween({
        from: from.color,
        to: to.color,
        duration: to.position-from.position,
        fps:30,
        //start: function () { console.log('Off I go!'); },
        step: function(){
            lightAccess.setColor(from.color.r,from.color.g,from.color.b);
        },
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

//access restriction for light
var lightControl = {
    start: function(){
        exports.stop();


        length = convertTimeToMillis(l);
        pos = 0;

        if (points && points.length > 0) {
            tw = new shifty();

            tween();
        }
    },
    stop: function(){
        if (tw) {
            tw.stop();
        }
        lightAccess.setColor(0,0,0);
    },
    isProcessRunning: function(){
        return tw.isPlaying();
    }
};


exports.launch = function () {
    sharedResources.light.run(lightControl);
};

exports.stop = function () {
    lightControl.stop();
};

exports.setSettings = function(o){
    points = o.points;
    length = o.length;

};

exports.getSettings = function(){
  return {points:points,length:length};
};

exports.getIdentifier = function(){
    return {name:"SequenceLight",identifier:identifier};
};
