/**
 * Created by wassi on 19.01.14.
 */
var _ = require('underscore');



exports.sound = createAccessControl;

exports.light = createAccessControl;


var createAccessControl = function () {
    var currentProcess = null;
    return {
        isProcessRunning: function () {
            return currentProcess && currentProcess.isRunning();
        },

        run: function (process) {
            if (currentProcess) {
                exports.stop();
            }
            currentProcess = process;
            process.start();
        },

        stop: function () {
            if (currentProcess) {
                currentProcess.stop();
            }
        },

        getCurrentProcess: function () {
            return currentProcess;
        }
    };


}

