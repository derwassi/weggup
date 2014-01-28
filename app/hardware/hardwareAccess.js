
var _ = require('underscore'),
    piblaster = require('pi-blaster.js'),
    spi = require('mcp3008.js');
    try{
        var adc = new spi();
    }catch(e){
        var f=function(timeout,callback){

           setTimeout(function(){f(timeout,callback);},timeout);
            callback(-1);
        };
        adc = {
            poll:function(idx,interval,callback){
            f(interval,callback);

        }};
    }
    var channel = 0;
//TODO: aus model lesen, welche channels es gibt
var values = [0,0,0,0,0,0,0,0,0];
var pollMean = function(pin,num,t){
    var avg = [];
    var diff= [];

    var sum = 0;
    var cnt = 0;
    for(var i=0;i<num;i++){
        avg.push(0);
        diff.push(0);
    }
    adc.poll(pin,t,function(value){
        sum-= diff[cnt];
        avg[cnt]=value;
        var d = Math.abs(avg[cnt]-avg[(cnt+num-1)%num]);
        diff[cnt] = d;
        sum+=diff[cnt];
        cnt = (cnt+1)%num;
        values[pin] = sum/num;
    });

}
pollMean(0,100,1);
pollMean(1,100,1);
adc.poll(2,1000,function(value){values[2] = value;});
adc.poll(3,1000,function(value){values[3] = value;});
adc.poll(4,1000,function(value){values[4] = value;});

exports.getSensor = function(pin,mode,map){
    if(typeof map == 'undefined') {
        map = function(v){return v;};
    }
    var value = 0;
    if(mode=='spi'){
        //TODO: readSpiValue
        value = values[pin];
    }
    value = map(value);

    return value;
};

exports.setActuator = function(value, pin, mode, map){
    if(typeof map == 'undefined') {
        map = function(v){return v;};
    }
    //console.log(value,pin,mode);
    if(mode == 'pwm'){
        try{
            //console.log('set actuator ' + pin + ' to ' + map(value));
            //piblaster.setPwm(pin,map(value));
        }catch(exception){
            console.log('error reading pin ' + pin + ' (' + mode + ')', exception);
            return false;
        }
    }
    return true;
};


