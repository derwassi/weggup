/**
 * Created by wassi on 26.12.13.
 */

//var tweenLite = require('./tweenLite');
var shifty = require('shifty/dist/shifty');
console.log(shifty);
var hardwareAccess = require('./../services/hardwareAccess');
var sharedResources = require('./../../services/sharedResources');
var lightAccess = require('./../../hardware/lightAccess');


var tw = null;

var from = {r:0,g:0,b:0};
var tween = function () {

    var to = {r:Math.random(),g:Math.random(),b:Math.random()};
    var length = Math.sqrt(to.r*to.r+to.g*to.g+to.b*to.b);
    to.r /= length;
    to.g /= length;
    to.b /= length;

    to.onUpdate = setColor;
    to.onUpdateParams = [from];
    to.useFrames = true;


    tw.tween({
        from: from,
        to: to,
        duration: math.random()*10000+5000,//TODO konfigurierbar
        fps:30,
        //start: function () { console.log('Off I go!'); },
        step: function(){
            lightAccess.setColor(from.r,from.g,from.b);

        },
        callback: function () {
            tween();
        }
    });

};


var running = false;
var lightControl = {
    start: function(){
        exports.stop();
        tw = new shifty();
        running = true;
        tween();

    },
    stop: function(){
        if (tw) {
            tw.stop();
        }
        lightAccess.setColor(0,0,0);
        running = false;
    },
    isProcessRunning: function(){
        return running;
    }
};


exports.play = function (p, l) {
    sharedResources.light.run(lightControl);
};

exports.stop = function () {
    lightControl.stop();
};
