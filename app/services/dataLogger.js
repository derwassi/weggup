/**
 * Created by wassi on 27.12.13.
 */

//TODO:read sensory data and log it

exports.logger = function(config,callback){

    //TODO: hole logger objekt aus mongodb
    //speichere 1 mal/ Minute + Aggregation
    //1mal täglich, logs älter als 1 woche nur noch in minuten vorhalten
    //1 mal wöchentlich, logs älter als 1 Monat nur noch täglich vorhalten
    //callback aufrufen mit Verlauf der letzten 60 messwerte (~1minute) (hierüber geht dann die motion detection (nach glättung))

}