/**
 * Created by wassi on 27.12.13.
 */

//TODO: Spiele nacheinander Dateien aus Verzeichnis ab, werde alle 10 Minuten leiser
// findet in dieser zeit eine Bewegung statt => wieder auf volle lautstärke hochregeln
// Vorlesen per TTS
var identifier= "sound/vorleser";
var soundAccess = require('../../hardware/soundAccess');
var sharedResources = require('../../services/sharedResources');
var event = require('../../services/eventbus');
var fs = require('fs');
var settingsManager = require('../../services/settings');

var _index = 0;
var _basedir = 'audiobooks/';
var settings = {
    dir: 'test',
    file: '1.mp3',
    position: 0,
    maxVolume:100,
    lowVolume: 50,
    readTime: 5000,
    fadeOutTime : 5000
};

//store initial settings in DB
settingsManager.init(settings,identifier);

var _volume = settings.maxVolume;


var running = false;
var player = null;


//TODO: position
var read = function(){
    var files = fs.readdirSync(_basedir + settings.dir);
    _index = files.indexOf(settings.file);
    if(_index==-1){
        settings.file = files[0];
        settings.position = 0;
        _index = 0;
    }

    //reduce volume after 10 minutes
    player = soundAccess.play(_basedir + settings.dir + '/' + settings.file);
    player.play();
    //read next file, when current file finished
    player.on('exit',function(){
        _index++;
        //TODO: save to model!
        if(_index<files.length){
            settings.position=0;
            settings.file = files[_index];
            read();
        }
    });
    var stopReading = null;
    reduceVolume();
};
var stopReading;
var reduceReading;
var reduceVolume=function(){
    reduceReading = setTimeout(function(){
        _volume = settings.lowVolume;
        player.volume(_volume);
        //Stop reading after one minute
        stopReading = setTimeout(function(){
            stop();

        },settings.fadeOutTime);
        event.emitter.once('movement.primary',function(){
            clearTimeout(stopReading);
            _volume = settings.maxVolume;
            player.volume(_volume);
            reduceVolume();
        });
    },settings.readTime);
};
var stop=function(){
    if(player){
        player.stop();
    }
    clearTimeout(stopReading);
    clearTimeout(reduceReading);
    exports.setSettings(settings);//auto save on closing
    running = false;
};


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


exports.stop = function(){
    soundControl.stop();

};


var loadSettings = function(){
    settingsManager.load(settings,identifier);
};

var saveSettings = function(s){
    settingsManager.save(s,identifier,settings);

};


exports.launch = function(){
    sharedResources.sound.run(soundControl);
};

exports.getIdentifier = function(){
    return {name:"Vorleser",identifier:identifier};
};


exports.setSettings = function(s){

    saveSettings(s);

};

exports.getSettings = function(){
    return settings;
};

