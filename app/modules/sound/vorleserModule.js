/**
 * Created by wassi on 27.12.13.
 */

var identifier= "sound/vorleser";
var soundAccess = require('../../hardware/soundAccess');
var sharedResources = require('../../services/sharedResources');
var event = require('../../services/eventbus');
var fs = require('fs');
var settingsManager = require('../../services/settings');

var _index = 0;
//milliseconds to rewind on start
var startOffset = -5000;
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
var player =  null;
var startTime;
var positionAtStart = 0;


//TODO: position
var read = function(){
    var files = fs.readdirSync(_basedir + settings.dir);
    positionAtStart = Math.max(0, settings.position+startOffset);
    startTime = Date.now();
    files.sort();
    //console.log(files);
    _index = files.indexOf(settings.file);
    if(_index==-1){
        settings.file = files[0];
        settings.position = 0;
        _index = 0;
    }

    //reduce volume after 10 minutes
    player = soundAccess.play(_basedir + settings.dir + '/' + settings.file);
    player.seek(settings.position);
    player.play();

    player.volume(_volume);
    //read next file, when current file finished
    player.on('exit',function(){
        _index++;
        //TODO: save to model!
        if(_index<files.length){
            settings.position = 0;
            settings.file = files[_index];
            read();
        }
    });
    stopReading = null;
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
            //console.log('TEST');

            settings.position = positionAtStart + Date.now()-startTime;
            //update position
            exports.setSettings(settings);
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
        player = null;
       settings.position = positionAtStart + Date.now()-startTime;


    }
    clearTimeout(stopReading);
    clearTimeout(reduceReading);

    exports.setSettings(settings);//auto save on closing
    running = false;
};


var soundControl = {
    start:function(){
        _volume = settings.maxVolume;
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


/*var loadSettings = function(){
    settingsManager.load(settings,identifier);
};*/

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

