/**
 * Created by wassi on 29.01.14.
 */

var cronJob = require('cron').CronJob;
var events = require('../services/eventbus');

var emitter = events.emitter;

var ringers = [];
var cronJob = require('cron').CronJob;
new cronJob('* 42 22 1 2 *', function(){
    console.log('You will see this message every second');
}, null,true);

exports.clear = function(){
    ringers.forEach(function (v) {
        v.job.stop();
    });
    ringers.length = 0;
};

var ring = function(alarm,module){
    console.log('RRRRRRRRRIIIIIIIIIIINNNNNNNNNGGGGGGGGGG');
  module.setSettings(alarm);
  module.launch();
};



//determine on waketime, current time and last modification time wether the alarm is still to be executed
var needsToBeScheduledSingle=function(wakeTimeMinutes, modifiedDate, nowDate){
    if(nowDate.getTime()-modifiedDate.getTime()>86400000) return false;//old alarm
    var modified = modifiedDate.getHours()*60+modifiedDate.getMinutes();
    console.log('modified',modified)
    console.log('wakeTimeMinutes',wakeTimeMinutes);
    //var now = nowDate.getHours()*60+nowDate.getMinutes();
    var alarmPoint = new Date();
    //alarmPoint.setTime(modified.getTime());
    alarmPoint.setHours(0);
    alarmPoint.setMinutes(0);
    alarmPoint.setSeconds(0);
    if(modified>wakeTimeMinutes) alarmPoint.setTime(alarmPoint.getTime()+86400000);
    alarmPoint.setHours(Math.floor(wakeTimeMinutes/60));
    alarmPoint.setMinutes(wakeTimeMinutes%60);
    if(alarmPoint.getTime()>nowDate.getTime())
        return alarmPoint;
    return false;


};

exports.schedule = function(alarms, module){

    alarms.forEach(function (alarm) {
        //Get daytime
        var cronString;
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

                cronString = + alarmPoint.getMinutes() + " " + alarmPoint.getHours() + " " + alarmPoint.getDate() + " " + (alarmPoint.getMonth() ) + " *";
                //cronString =  "* * " + (alarmPoint.getHours()-1) + " " + alarmPoint.getDate() + " " + (alarmPoint.getMonth() + 1) + " *";
                //cronString = "* * * * * *";
                console.log('single',cronString);

                ringers.push(
                    {job:new cronJob(cronString,function () {
                        ring(alarm,module);
                    },null,true),
                        alarm:alarm
                    });

            }
        } else {
            cronString = "* " + time[1] + " " + time[0] + " * * " + alarm.dayOfWeek.join(',');

            console.log('multiday',cronString);
            //common multi day alarm
            ringers.push({job:new cronJob(cronString,function(){ring(alarm,module)},null,true),alarm:alarm});
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
    ringers.forEach(function(v){
        var t = v.job.cronTime.getTimeout();
        if(t>cycleLength && t<2*cycleLength){

        }
    });

});

