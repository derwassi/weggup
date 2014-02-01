
var io = require('socket.io').listen(3010);
var mongoose = require('mongoose');
//var hardwareAccess = require('../hardware/hardwareAccess');
var mplayer = require('../hardware/soundAccess');
var soundMixer = require('../modules/sound/soundMixerModule');
var soundModule = require('../modules/sound/soundModule');
var lightMixer = require('../modules/light/sequenceLightModule');
var previewLightModule = require('../modules/light/lightPreviewModule')
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
    socket.on('play', function(audio){
        soundModule.setSettings(audio);
        soundModule.launch();
    });
    socket.on('stop', function(audio){
        soundModule.stop();
    });
    socket.on('playPreview', function(list){
       soundMixer.play(list);
    });
    socket.on('stopPreview', function(){
        soundMixer.stop();
    });

    socket.on('playLight',function(list){

        lightMixer.play(list.items,list.duration);
    });
});