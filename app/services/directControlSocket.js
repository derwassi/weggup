
var io = require('socket.io').listen(3010);
var mongoose = require('mongoose');
var hardwareAccess = require('../hardware/hardwareAccess');
var mplayer = require('../hardware/soundAccess');
var soundMixer = require('../modules/sound/soundMixer');
var lightMixer = require('../modules/light/sequenceLight');
var hardware;

var map = function(val, fl,fu,tl,tu){
    return ((tu-tl)/(fu-fl))*(val-fl)+tl;
};


var music = {};

io.sockets.on('connection',function(socket){
    socket.on('get',function(sensor){
        //TODO change interface
       /* if(typeof hardware.sensors[sensor.name] != 'undefined'){

            var value=hardwareAccess.getSensor(hardware.sensors[sensor.name].pin,hardware.sensors[sensor.name].mode);//TODO: map from model!
            socket.emit('sensorvalue',value);
        }*/

    });
    socket.on('set',function(actuator){
        /*if(typeof hardware.actuators[actuator.name] != 'undefined'){
            //console.log(hardware.actuators[actuator.name])
            var value=hardwareAccess.setActuator(actuator.valtotally removed hardware modelue,hardware.actuators[actuator.name].pin,hardware.actuators[actuator.name].mode,function(v){return map(v,0,255,0,1);});//TODO: map from model!
        }*/
    });
    socket.on('play', function(audio){
        if(music[audio.file]){
            try{
                music[audio.file].stop();
            }catch(err){

            }

        }
        music[audio.file] = mplayer.play('./moodsounds/'+audio.file, audio.repeat, audio.volume);
        music[audio.file].play();
    });
    socket.on('stop', function(audio){
        if(music[audio.file]){
            music[audio.file].stop();
        }
    });
    socket.on('playPreview', function(list){
       soundMixer.play(list);
    });
    socket.on('stopPreview', function(){
        soundMixer.stop();
    });

    socket.on('playLight',function(list){

        lightMixer.play(list,'00:10');
    });
});