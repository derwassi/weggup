/**
 * Created by wassi on 26.12.13.
 */

//var tweenLite = require('./tweenLite');
var shifty = require('shifty/dist/shifty');
var sharedResources = require('./../../services/sharedResources');
var lightAccess = require('./../../hardware/lightAccess');
var settingsManager = require('../../services/settings');

var identifier = "light/moodLight";
var settings={
  duration:3600000,
  randomTime: 10000,
  minTime:5000
};

//store initial settings in DB
settingsManager.init(settings,identifier);

var tw = null;

var from = {r:0,g:0,b:0};
var tween = function () {

    var to = {r:Math.random(),g:Math.random(),b:Math.random()};
    var length = Math.sqrt(to.r*to.r+to.g*to.g+to.b*to.b);
    to.r /= length;
    to.g /= length;
    to.b /= length;
    to.r*=255;
    to.g*=255;
    to.b*=255;

    to.onUpdate = lightAccess.setColor;
    to.onUpdateParams = [from];
    to.useFrames = true;


    tw.tween({
        from: from,
        to: to,
        duration: Math.random()*settings.randomTime-settings.randomTime/2+settings.minTime,
        fps:30,
        //start: function () { console.log('Off I go!'); },
        step: function(){
            console.log(from);
            lightAccess.setColor(from.r,from.g,from.b);

        },
        callback: function () {
            tween();
        }
    });

};


var running = false;
var timeOut;
var lightControl = {
    start: function(){
        exports.stop();
        tw = new shifty();
        running = true;
        tween();
        timeOut = setTimeout(exports.stop,settings.duration);

    },
    stop: function(){
        if (tw) {
            tw.stop();
        }
        lightAccess.setColor(0,0,0);
        clearTimeout(timeOut);
        running = false;
    },
    isProcessRunning: function(){
        return running;
    }
};


exports.start = function (p, l) {
    sharedResources.light.run(lightControl);
};

exports.stop = function () {
    lightControl.stop();

};


exports.launch = function(){
    //TODO: fetch data from model, call setparams
    exports.start();
};

exports.getIdentifier = function(){
    return {name:"MoodLight",identifier:identifier};
};

var loadSettings = function(){
    settingsManager.load(settings,identifier);
};

var saveSettings = function(s){
    settingsManager.save(s,identifier,settings);

};


exports.setSettings = function(s){

    saveSettings(s);

};

exports.getSettings = function(){
    return settings;
};