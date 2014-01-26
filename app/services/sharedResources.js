/**
 * Created by wassi on 19.01.14.
 */
var _ = require('underscore');




var createAccessControl = function () {
    var currentProcess = null;
    return {
        isProcessRunning: function () {
            return currentProcess && currentProcess.isProcessRunning();
        },

        run: function (process) {
            if (currentProcess) {
                currentProcess.stop();
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


};



exports.sound = createAccessControl();

exports.light = createAccessControl();

