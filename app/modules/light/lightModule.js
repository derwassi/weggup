/**
 * Created by wassi on 19.01.14.
 */

var _ = require('underscore');
var sharedResources = require('./../../services/sharedResources');

var lightAccess = require('./../../hardware/lightAccess');

var settingsManager = require('../../services/settings');
var identifier = "light/lightModule";
var running = false;

var settings = {
    duration:3600000,
    red:255,
    green:255,
    blue:255
};

var timeOut;

var lightControl = {
    start: function(){
        lightAccess.setColor(settings.red,settings.green,settings.blue);
        running = true;
        timeOut = setTimeout(exports.stop,settings.duration);
    },
    stop: function(){
        lightAccess.setColor(0,0,0);
        clearTimeout(timeOut);
        running = false;
    },
    isProcessRunning: function(){
        return running;
    }
};


var start = function(){
    sharedResources.light.run(lightControl);
};

exports.stop = function(){
    lightControl.stop();
};



exports.launch = function(){
    start();
};

exports.getIdentifier = function(){
    return {name:"Lamp",identifier:identifier};
};

/*var loadSettings = function(){
    settingsManager.load(settings,identifier);
};*/

var saveSettings = function(s){
    settingsManager.save(s,identifier,settings);

};


exports.setSettings = function(s){

    saveSettings(s);

};

exports.getSettings = function(){
    return settings;
};