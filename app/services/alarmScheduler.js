/**
 * Created by wassi on 29.01.14.
 */

var cronJob = require('cron').CronJob;
var cronTime = require('cron').CronTime;
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

var convertTime = function(t){
    var s = t.split(':');
    return parseInt(s[0])*60+parseInt(s[1]);
}

var getWakeTime = function(alarm){

    var minutes = convertTime(alarm.wakeTime);
    var ambientDuration = parseInt(convertTime(alarm.ambientDuration)/60)
    minutes-=ambientDuration;
    return minutes
}


exports.schedule = function(alarms, module){

    alarms.forEach(function (alarm) {
        //Get daytime
        var cronString;
        var minutes = getWakeTime(alarm);
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

var updateAlarm = function(){
    //TODO: get current light status (apply only when dark!)
    //TODO: get sleepcycle duration from settings (calculated continuosly)
    //TODO: when upcoming alarm is between next and overnext light sleeping phase adjust ring time accordingly
    //TODO: when using ambient wakeup schedule alarm before next light sleeping phase


    var cycleLength = 3600*3*1000;
    var now = Date.now();
    console.log(ringers);
    ringers.forEach(function(v){
        var t = v.job.cronTime.sendAt();
        var minutes = getWakeTime(v.alarm);
        var priorTime = v.alarm.allowedPriorTime;
        console.log(t.getHours()*60+ t.getMinutes(),minutes);
        if(t.getHours()*60+ t.getMinutes() == minutes ){
            //alarm time has not been shifted yet
            //console.log(t.getTime()-now,cycleLength,t.getTime()-(convertTime(priorTime)*60*1000)-now);
            if(t.getTime()-now>cycleLength && t.getTime()-(convertTime(priorTime)*60*1000)-now<cycleLength){
                var d = new Date();
                d.setTime(now+cycleLength);
            //console.log(new cronTime(d));
                v.job.setTime(new cronTime(d));//TODO: repating alarms are not regarded currently.
            }
        }

    });
};
//setTimeout(updateAlarm,1000);
emitter.on('movement.primary',updateAlarm);

