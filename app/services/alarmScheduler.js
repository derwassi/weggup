/**
 * Created by wassi on 29.01.14.
 */

var cronJob = require('cron').CronJob;
var events = require('../services/eventbus');
var emitter = events.emitter;
var player = require('../hardware/soundAccess');
var ringers = [];


var clear = function(){
    ringers.forEach(function (v, k, a) {
        v.job.stop();
    });
    ringers.length = 0;
};

var ring = function(alarm){
  //TODO
};



//determine on waketime, current time and last modification time wether the alarm is still to be executed
var needsToBeScheduledSingle=function(wakeTimeMinutes, modifiedDate, nowDate){
    var modified = modifiedDate.getHours()*60+modifiedDate.getMinutes();
    var now = nowDate.getHours()*60+nowDate.getMinutes();
    var alarmPoint = new Date();
    alarmPoint.setTime(modified.getTime());
    alarmPoint.setHours(0);
    alarmPoint.setMinutes(0);
    alarmPoint.setSeconds(0);
    if(modified<wakeTimeMinutes) alarmPoint.setTime(alarmPoint.getTime()+86400000);
    alarmPoint.setHours(Math.floor(wakeTimeMinutes/60));
    alarmPoint.setMinutes(wakeTimeMinutes%60);
    if(alarmPoint.getTime()>nowDate.getTime())
        return alarmPoint;
    return false;


}

var schedule = function(alarms, module){
    alarms.forEach(function (alarm) {
        //Get daytime
        var time = alarm.wakeTime.split(':');
        time.forEach(function (v, k) {
            time[k] = parseInt(v);
        });
        var minutes = time[0]*60+time[1];
        if(alarm.useAmbientSound || alarm.useLight){
            minutes-=alarm.ambientDuration;
        }
        //alarm happens only once
        if (alarm.oneTime ) {
            var alarmPoint = needsToBeScheduledSingle(minutes,alarm.modified,new Date());
            if(alarmPoint){
                ringers.push(
                    {job:new cronJob(alarmPoint.getMinutes() + " " + alarmPoint.getHours() + " " + alarmPoint.getDate() + " " + (alarmPoint.getMonth() + 1) + " *", function () {
                        ring(alarm);
                    }),
                        alarm:alarm
                    });
            }
        } else {
            //common multi day alarm
            ringers.push({job:new cronJob(time[1] + " " + time[0] + " * * " + alarm.dayOfWeek.join(',')),alarm:alarm});
        }
    });
};

/**
 * On movement detection, initialize next sunrise alarm
 */
emitter.on('movement.primary',function(){
    //TODO: get current light status (apply only when dark!)
    //TODO: get sleepcycle duration from settings (calculated continuosly)
    //TODO: when upcoming alarm is between next and overnext light sleeping phase adjust ring time accordingly
    //TODO: when using ambient wakeup schedule alarm before next light sleeping phase
    //TODO: when using default noisy wakeup, and in timerange before actual wakeuptime => wakeup immediately!
    var cycleLength = 3600*3*1000;
    ringers.forEach(function(v,k){
        var t = v.job.cronTime.getTimeout();
        if(t>cycleLength && t<2*cycleLength){

        }
    });

});

