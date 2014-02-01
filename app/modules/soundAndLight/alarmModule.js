/**
 * Created by wassi on 29.01.14.
 */
var mongoose = require('mongoose');
Alarm = mongoose.model('Alarm');

//var sharedResources = require('../../services/sharedResources');
var sequenceLight = require('../light/sequenceLightModule');
var soundMixer = require('../sound/soundMixerModule');
var identifier = 'soundAndLight/alarmModule';

var alarm;







exports.launch = function(){
    var l = [];
    alarm.ambientSounds.forEach(function(v,k){

        l.push({file:'./moodsounds/'+ v.file,
            from: v.from,
            to: v.to,
            repeat: v.repeat,
            volume: v.volume}) ;
    });
    sequenceLight.setSettings({list:alarm.gradient,duration:alarm.ambientDuration,speed:1});
    sequenceLight.launch();
    soundMixer.setSettings({list:l,duration:alarm.ambientDuration,speed:1});
    soundMixer.launch();

};

exports.getIdentifier = function(){
    return {name:"Alarm",identifier:identifier};
};


exports.setSettings = function(s){
    alarm = s;
};

exports.getSettings = function(){
    return alarm;
};


exports.stop = function(){
    sequenceLight.stop();
    soundMixer.stop();
};
