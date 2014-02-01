/**
 * Created by wassi on 26.12.13.
 */

var _ = require('underscore');
var soundAccess = require('./../../hardware/soundAccess');
var sharedResources = require('../../services/sharedResources');
var identifier = 'sound/soundMixerModule';


var timeOuts = [];
var instances = [];


var convertTimeToMillis = function(time){
    var t = time.split(':');
    return ((parseInt(t[0])*60+parseInt(t[1]))*1000);
};

var settings={
    list:[],
    length:'20:00',
    speed:1
};
var start = 0;

var play = function(){
    if(!settings.length) settings.length = '01:00';

    if(!settings.start) settings.start = 0;
    if(!settings.speed) settings.speed = 1

    var duration = convertTimeToMillis(settings.length)/settings.speed;
    settings.start -=100;//-100 ms  to ensure start of first sound!

    if(!settings.list){
        settings.list = [];
    }
    settings.list.forEach(function(v){


        var from = (parseFloat(v.from)/100)*duration;
        var to = parseFloat(v.to)/100*duration;
        if(to>start){
            to=to-start;
            from = Math.max(from-start,0);
            var player = soundAccess.play(v.file, v.repeat, v.volume);
            instances.push(player);
            timeOuts.push(setTimeout(function(){
                console.log('start', v.file);
                player.play();
            },from));
            timeOuts.push(setTimeout(function(){
                console.log('stop', v.file);
                player.stop();
            },to));
        }
    });

};



var running = false;
//access restriction for light
var soundControl = {
    start: function(){
       play();
       running = true;
    },
    stop: function(){
        timeOuts.forEach(function(v){
            clearTimeout(v);
        });
        timeOuts = [];
        instances.forEach(function(v){
            v.stop();
        });
        instances = [];
        running = false;
    },
    isProcessRunning: function(){
        return running;
    }
};


exports.launch = function () {
    sharedResources.sound.run(soundControl);

};

exports.stop = function () {
    soundControl.stop();
};

exports.getSettings = function(){
   return settings
};
exports.setSettings = function(s){
   settings=s;
};

exports.getIdentifier = function(){
    return {name:"SoundMixer",identifier:identifier};
};

