
var io = require('socket.io').listen(3010);
var mongoose = require('mongoose');
//var hardwareAccess = require('../hardware/hardwareAccess');

var soundMixer = require('../modules/sound/soundMixerModule');
var lightsequence = require('../modules/light/sequenceLightModule');
var soundModule = require('../modules/sound/soundModule');
var lightMixer = require('../modules/light/sequenceLightModule');
var previewLightModule = require('../modules/light/lightPreviewModule');
var hardware;

var map = function(val, fl,fu,tl,tu){
    return ((tu-tl)/(fu-fl))*(val-fl)+tl;
};


var music = {};

io.sockets.on('connection',function(socket){

    socket.on('setColor',function(color){

        previewLightModule.setSettings(color);
        previewLightModule.launch();
    });
    socket.on('playAudio', function(audio){
        soundModule.setSettings(audio);
        soundModule.launch();
    });
    socket.on('stopAudio', function(audio){
        soundModule.stop();
  });


    socket.on('play', function(list){
        console.log(list);
        soundMixer.setSettings({list:list.audio.list,length:list.duration,speed:list.speed});
        soundMixer.launch();
        lightsequence.setSettings({list:list.light.list,length:list.duration,speed:list.speed});
        lightsequence.launch();
    });
    socket.on('stop', function(){
        soundMixer.stop();
    });

    socket.on('playLight',function(list){

        lightMixer.play(list.items,list.duration);
    });
});