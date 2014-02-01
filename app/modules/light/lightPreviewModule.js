/**
 * Created by wassi on 19.01.14.
 */

//TODO: essentially the same as light module, try not to duplicate code...
var _ = require('underscore');
var sharedResources = require('./../../services/sharedResources');

var lightAccess = require('./../../hardware/lightAccess');

var settingsManager = require('../../services/settings');
var identifier = "light/lightPreviewModule";
var running = false;

var to = 10000;


var settings = {
    r:255,
    g:255,
    b:255
};
//store initial settings in DB
settingsManager.init(settings,identifier);

var timeOut;

var lightControl = {
    start: function(){
        lightAccess.setColor(settings.r,settings.g,settings.b);
        running = true;
        timeOut = setTimeout(exports.stop,to);
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