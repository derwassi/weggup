/**
 * Created by wassi on 26.12.13.
 */

var _ = require('underscore');
var soundAccess = require('./../../hardware/soundAccess');
var identifier = 'sound/soundModule';
var settingsManager = require('../../services/settings');
var soundAccess = require('../../hardware/soundAccess');
var sharedResources = require('../../services/sharedResources');

var settings = {
    file:'',
    volume:100
}
//store initial settings in DB
settingsManager.init(settings,identifier);
var player

var play = function(){
    player = soundAccess.play('./' + v.file, v.volume);
    player.play();
    player.on('exit',function(){soundControl.stop();});
};



var running = false;
//access restriction for light
var soundControl = {
    start: function(){
       play();
       running = true;
    },
    stop: function(){
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
   return settings;//TODO
};
exports.setSettings = function(s){
   settingsManager.save(s,identifier,settings);
};

exports.getIdentifier = function(){
    return {name:"Sound",identifier:identifier};
};

