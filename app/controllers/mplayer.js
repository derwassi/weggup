/**
 * This controller controls the ringing. It creates cronjobs for the alarms of the currently active user
 * it is called each time, the alarms get modified
 */

/**
 * Module dependencies.
 */
var _ = require('underscore');

var spawn = require('child_process').spawn;


exports.play = function (soundFile) {
    var sound = spawn('mplayer', [soundFile, '-loop', '0', '-slave']);
    sound.stdin.write('pause');
    var player = {};
    player.sendCommand = function (cmd) {
        sound.stdin.write(cmd + "\n");
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


    return player;


};