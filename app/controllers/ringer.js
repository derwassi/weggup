/**
 * This controller controls the ringing. It creates cronjobs for the alarms of the currently active user
 * it is called each time, the alarms get modified
 */

/**
 * Module dependencies.
 */
var _ = require('underscore');
var mongoose = require('mongoose');
Alarm = mongoose.model('Alarm');
var cronJob = require('cron').CronJob;
var emitter = require('events').EventEmitter;


var ringers = [];
//var player = require('./mplayer');


/**
 * update cronjobs
 */

var ring = function(alarm){
    var sound = player.play('../moodsounds/dream.ogg');
    sound.play();

    setTimeout(function(){
        sound.pause();
    },1000);
    setTimeout(function(){
        sound.play();
    },3000);
   /* for (var i=0;i<=10;i++){
        (function(i){
            setTimeout(function(){
                sound.volume(i*10);
            },3000+i*500);
        })(i);
    }*/

};

exports.ring = function(req,res,next){
    ring(null);

    next();
};
//TODO: alarme richtig terminieren
/**
 * On movement detection, initialize next sunrise alarm
 */
emitter.on('movement.primary',function(){
    //TODO: get sleepcycle duration from settings (calculated continuosly)
    var cycleLength = 3600*3*1000;
    ringers.forEach(function(v,k){
        var t = v.job.cronTime.getTimeout();
        if(t>cycleLength && t<2*cycleLength){

        }
    });

});

exports.update = function (req, res, next) {
    Alarm.find().exec(function (err, alarms) {

        ringers.forEach(function (v, k, a) {
            v.job.stop();
        });
        ringers.length = 0;

        alarms.forEach(function (alarm) {
            //Get daytime
            var time = alarm.wakeTime.split(':');
            time.forEach(function (v, k) {
                time[k] = parseInt(v);
            });
            //alarm happens only once
            if (alarm.oneTime) {
                //TODO: check, when alarm has been last modified, skip, if already executed!
                var now = new Date();
                if (now.getHours() < time[0] || (now.getHours() == time[0] && now.getMinutes() < time[1])) {
                    ringers.push(
                        {job:new cronJob(time[1] + " " + time[0] + " " + now.getDate() + " " + (now.getMonth() + 1) + " *", function () {
                            ring(alarm);
                            }),
                         alarm:alarm
                        });
                } else {
                    now.setTime(now.getTime() + 86400 * 1000);
                    ringers.push({job:new cronJob(time[1] + " " + time[0] + " " + now.getDate() + " " + (now.getMonth() + 1) + " *",function(){ring(alarm)})});
                }
            } else {
                //common multi day alarm
                ringers.push(time[1] + " " + time[0] + " * * " + alarm.dayOfWeek.join(','));
            }
        });
        console.log(ringers);

    });
    next();

};

