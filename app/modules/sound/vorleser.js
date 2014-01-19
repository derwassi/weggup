/**
 * Created by wassi on 27.12.13.
 */

//TODO: Spiele nacheinander Dateien aus Verzeichnis ab, werde alle 10 Minuten leiser
// findet in dieser zeit eine Bewegung statt => wieder auf volle lautstärke hochregeln
// Vorlesen per TTS

var soundAccess = require('../../hardware/soundAccess');
var sharedResources = require('../../services/sharedResources');
var event = require('events');
var fs = require('fs');
var _dir, _file, _position,_index,_volume = 100;
var running = false;
var player = null;

//TODO: position
var read = function(){
    var files = fs.readdirSync(_dir);
    _index = files.indexOf(_file);
    if(_index==-1){
        _file = files[0];
        _position = 0;
        _index = 0;
    }

    //reduce volume after 10 minutes
    player = soundAccess.play(_dir + '/' + _file);
    //read next file, when current file finished
    player.on('exit',function(){
        _index++;
        //TODO: save to model!
        if(_index<files.length){
            _position=0;
            _file = files[_index];
            read();
        }
    });
    var stopReading = null;
    reduceVolume(player);
};

var reduceVolume=function(){
    setTimeout(function(){
        _volume = 50;
        player.volume(_volume);
        //TODO: eventhandler for movement
        //Stop reading after one minute
        stopReading = setTimeout(function(){
            stop();

        },60000);
        event.EventEmitter.once('movement.primary',function(){
            clearTimeout(stopReading);
            _volume = 100;
            player.volume(_volume);
            reduceVolume();
        });
    },600000)
};
var stop=function(){
    player.stop();
    running = false;
};


var soundControl = {
    play:function(){
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

exports.play = function(){
    sharedResources.sound.run(soundControl);
};

exports.stop = function(){
    soundControl.stop();

};

exports.setParams = function(dir,file,position){
    _dir = dir;
    _file = file;
    _position = position;

};
