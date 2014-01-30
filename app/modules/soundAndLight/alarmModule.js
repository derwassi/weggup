/**
 * Created by wassi on 29.01.14.
 */
var mongoose = require('mongoose');
Alarm = mongoose.model('Alarm');

var sharedResources = require('../../services/sharedResources');
var sequenceLight = require('../light/sequenceLight');
var soundMixer = require('../sound/soundMixer');
var currentAlarm;
var settings = {alarm:''};








var soundControl = {
    start:function(){
        read();
        running = true;
    },
    stop:function(){
        stop();
    },
    isProcessRunning: function(){
        return running;
    }
};

var lightControl = {
    start:function(){
        read();
        running = true;
    },
    stop:function(){
        stop();
    },
    isProcessRunning: function(){
        return running;
    }
};


var start = function(alarm){
    if(alarm.useLight){
        sequenceLight.setSettings({gradient: alarm.gradient,duration:alarm.ambientDuration});
        sequenceLight.launch();
    }

    if(alarm.useAmbientSound){
        soundMixer.setSettings({sounds: alarm.ambientSounds, duration: alarm.ambientDuration});
        soundMixer.launch();
    }

    if(alarm.useLight || alarm.useAmbientSound){
        //TODO: timeout für alarm
    }else{
        //TODO: alarm auslösen
    }
};

//TODO: eventlistener für button druck => timeout ausschalten (module werden von haus aus beendet)
//TODO: eventlistener für button druck => snooze/ganz aus (5x drücken in 10 sekunden)

exports.launch = function(){
    if(!currentAlarm || (settings.alarm && settings.alarm!==currentAlarm._id)){
        Alarm.findById(settings.alarm,function(err,alarm){
            start(alarm);
        })
    }else{
        start(currentAlarm);
    }

};

exports.getIdentifier = function(){
    return {name:"Alarm",identifier:identifier};
};


exports.setSettings = function(s){

    //TODO: saveSettings(s);

};

exports.getSettings = function(){
    return settings;
};

exports.setAlarm = function(alarm){
    currentAlarm = alarm;
    settings.alarm = alarm._id;
}