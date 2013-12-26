/**
 * This controller controls the ringing. It creates cronjobs for the alarms of the currently active user
 * it is called each time, the alarms get modified
 */

/**
 * Module dependencies.
 */
var _ = require('underscore');

var spawn = require('child_process').spawn;


exports.play = function (soundFile, loop, volume) {
    console.log(soundFile,loop,volume);
    var sound;
    var player = {};
    player.sendCommand = function (cmd) {
       try{
        sound.stdin.write(cmd + "\n");
       }catch(e){}
    };
    player.setInfinite = function () {
        player.sendCommand('loop 0');
    };

    player.play = function () {
        player.sendCommand('pause');
    };
    player.pause = function () {
        player.sendCommand('pause');
    };
    player.volume = function (vol) {

        player.sendCommand('volume ' + vol + ' 1');
    };
    player.stop = function(){
        sound.kill('SIGTERM');
    }
    var arguments = ['-slave'];
    if(loop){
        arguments.push('-loop');
        arguments.push('0');
    }
    if(volume){
        arguments.push('-volume');
        arguments.push(volume+"");
    }
    arguments.push(soundFile);


    sound = spawn('mplayer', arguments);
    player.pause();




    return player;


};