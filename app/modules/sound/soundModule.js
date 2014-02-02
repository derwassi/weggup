/**
 * Created by wassi on 26.12.13.
 */

var _ = require('underscore');
var identifier = 'sound/soundModule';
var soundAccess = require('../../hardware/soundAccess');
var sharedResources = require('../../services/sharedResources');

var settings = {
    file:'',
    volume:100
}

var player;

var play = function(){
    console.log(settings);
    player = soundAccess.play('./' + settings.file,false,settings.volume);
    player.play();

    player.on('exit',function(){soundControl.stop();});
};



var running = false;
//access restriction for light
var soundControl = {
    start: function(){
        soundAccess.turnOn();
       play();
       running = true;
    },
    stop: function(){
        soundAccess.turnOff();
        if(player){
            player.stop();
            player = null;
        }
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
   return settings;
};
exports.setSettings = function(s){
   settings = s;
};

exports.getIdentifier = function(){
    return {name:"Sound",identifier:identifier};
};

