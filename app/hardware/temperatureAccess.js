/**
 * Created by wassi on 19.01.14.
 */

//TODO: zwei sensoren,
//innerer schmeisst event bei Überhitzung und abkühlung (einschalten/ausschalten von licht!)

var hardwareAccess = require('./hardwareAccess');
//TODO: use lookup table/correct function
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
    console.log(ergebnis);
        return ergebnis;

};

exports.getOuterTemperature = function(){
    //TODO: aus Modell lesen

    return hardwareAccess.getSensor(5,'spi',map);
};


exports.getInnerTemperature = function(){
    //TODO: aus Modell lesen
    return hardwareAccess.getSensor(6,'spi',map);
};