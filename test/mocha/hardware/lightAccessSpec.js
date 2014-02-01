/**
 * Created by wassi on 01.02.14.
 */

sinon = require('sinon');
var should;
should = require('should');
/*globals Player:false, Song: false*/

describe("Modules ", function () {

    var clock;
    var app;
    var hardwareAccess;
    var temperatureAccess;
    var lightAccess;
    var temperature = 20;
    var lastCall = {};
    var val;
    var copyObject = function (lastCall) {
        var col = {};

        Object.keys(lastCall).forEach(function (key) {
            val = lastCall[key];
            col[key] = val;
        });
        return col;
    };
    var cycleObject = function (lastCall, callback) {
        Object.keys(lastCall).forEach(function (key) {
            var val = lastCall[key];
            callback(key, val);
        });
    };


    before(function () {
        clock = sinon.useFakeTimers();
        //load modules after initialising fake timers
        hardwareAccess = require('../../../app/hardware/hardwareAccess');
        temperatureAccess = require('../../../app/hardware/temperatureAccess');
        lightAccess = require('../../../app/hardware/lightAccess');

        sinon.stub(hardwareAccess, 'setActuator', function (v, pin, mode, callback) {
            lastCall[pin] = callback(v);

        });
        sinon.stub(temperatureAccess, 'getInnerTemperature', function () {
            return temperature;
        });
    });


    after(function () {
        clock.restore();
    });

    it('should reduce light to 50%, when temperature rises above 33°C', function () {
        lightAccess.setColor(255, 255, 255);
        var col = copyObject(lastCall);
        temperature = 37;
        clock.tick(1100);

        cycleObject(lastCall, function (key) {
            if (key != '23') {//only rgb pins
                lastCall[key].should.be.approximately(col[key] / 2, 0.01);
            }
        });


    });
    it('should raise light to 100%, when temperature sinks below 33°C', function () {
        temperature = 25;
        clock.tick(1100);
        lightAccess.setColor(255, 255, 255);
        var col = copyObject(lastCall);
        temperature += 12;
        clock.tick(3000);
        cycleObject(lastCall, function (key) {
            if (key != '23') {//only rgb pins
                lastCall[key].should.be.approximately(col[key] / 2, 0.01);
            }
        });

        temperature -= 12;
        clock.tick(1100);
        cycleObject(lastCall, function (key) {
            if (key != '23') {//only rgb pins
                lastCall[key].should.be.approximately(col[key], 0.01);
            }
        });


    });
    it('should turn off light, when temperature rises above 40°C', function () {
        lightAccess.setColor(255, 255, 255);
        temperature = 42;
        clock.tick(3000);

        cycleObject(lastCall, function (key) {
            if (key != '23') {//only rgb pins
                lastCall[key].should.be.approximately(0, 0.01);
            }
        });
    });
    it('should raise light to 50%, when temperature sinks below 40°C', function () {
        temperature = 25;
        clock.tick(1100);
        lightAccess.setColor(255, 255, 255);
        var col = copyObject(lastCall);

        temperature += 16;
        clock.tick(3000);
        cycleObject(lastCall, function (key) {
            if (key != '23') {//only rgb pins
                lastCall[key].should.be.approximately(0, 0.01);
            }
        });

        temperature -= 5;
        clock.tick(1100);
        cycleObject(lastCall, function (key) {
            if (key != '23') {//only rgb pins
                lastCall[key].should.be.approximately(col[key] / 2, 0.01);
            }
        });
        temperature -= 11;
        clock.tick(1100);
        cycleObject(lastCall, function (key) {
            if (key != '23') {//only rgb pins
                lastCall[key].should.be.approximately(col[key], 0.01);
            }
        });

    });
    it('should turn on the fan, when temperature rises above 35°C', function () {
        temperature = 25;
        clock.tick(1100);
        lastCall['23'].should.equal(0);
        temperature += 3;
        clock.tick(1100);
        lastCall['23'].should.equal(1);
    });
    it('should turn on the fan, when temperature rises above 35°C', function () {
        temperature = 25;
        clock.tick(1100);
        lastCall['23'].should.equal(0);
        temperature += 3;
        clock.tick(1100);
        lastCall['23'].should.equal(1);
        temperature -= 4;
        clock.tick(1100);
        lastCall['23'].should.equal(0);
    });


});
