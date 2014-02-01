/**
 * Created by wassi on 19.01.14.
 */

//innerer schmeisst event bei Überhitzung und abkühlung (einschalten/ausschalten von licht!)

var hardwareAccess = require('./hardwareAccess');
var hardware = require('../models/hardware');

var pinInner = hardware.sensors.temperatureInner;
var pinOuter = hardware.sensors.temperatureOuter;
hardwareAccess.getAverageValues(pinOuter.pin,600000,5);
hardwareAccess.getAverageValues(pinInner.pin,1000,1);//faster averaging for inner temperature => overheat

var map = function(v){
        //from http://www.nextit.de/2011/07/thermometer-mit-arduino/
        var r1 = 10000; // Wert des Festen Wiederstandes des sabbungsteiler
        var r2 = 10000; // Wiederstand des Thermristors bei 25grad
        var b = 3950;  // Fixwert aus Datenblatt
        var r_akt; // Aktueller Wiederstand
        var temp; //Temporäre Variable
        var ergebnis; //
        var tn = 25; //Basistemperatur in Grad Celsius
// Wiederstand Therm ausrechnen
//Widerstand auf Temperatur umrechnen
        tn = tn+273.15; // Basitemperatur auf Kelvin umrechnen
        r_akt = ((4.64/(4.64/1023*v))*r1)-r2; //Aktuellen Widerstand ermitteln
        temp = b*tn/(b+Math.log((r_akt/r2))/Math.LN10*tn);
        temp = temp - 273.15; //Ergebnis in Grad Celsius umwandeln
        ergebnis =temp;

        return ergebnis;

};

exports.getOuterTemperature = function(){
    return hardwareAccess.getSensor(pinOuter.pin,pinOuter.type,map);
};


exports.getInnerTemperature = function(){
    return hardwareAccess.getSensor(pinInner.pin,pinInner.type,map);
};