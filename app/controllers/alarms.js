/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Alarm = mongoose.model('Alarm'),
    _ = require('underscore');


/**
 * Find article by id
 */
exports.alarm = function(req, res, next, id) {
    console.log(id);
    Alarm.load(id, function(err, alarm) {
         if (err) return next(err);
        if (!alarm) return next(new Error('Failed to load alarm ' + id));
        req.alarm = alarm;
        next();
    });
};

/**
 * Create a article
 */
exports.create = function(req, res,next) {
    var alarm = new Alarm(req.body);
    //alarm.user = req.user;
    alarm.save(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(alarm);

       }
        next();
    });

};

/**
 * Update a article
 */
exports.update = function(req, res,next) {
    var alarm = req.alarm;
    alarm = _.extend(alarm, req.body);
    alarm.save(function(err) {
        res.jsonp(alarm);

    });

};

/**
 * Delete an article
 */
exports.destroy = function(req, res,next) {
    var alarm = req.alarm;

    alarm.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(alarm);
        }

    });

};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.alarm);

};

/**
 * List of Alarms
 */
exports.all = function(req, res) {

    Alarm.find().sort('onlyOnce, dayOfWeek, wakeTime').exec(function(err, alarms) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(alarms);
        }

    });

};
