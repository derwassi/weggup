/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Hardware = mongoose.model('Hardware'),
    _ = require('underscore'),
    piblaster = require('pi-blaster.js');

if(Hardware.count({},function(err,c){
    if(c===0){
        var hardware = new Hardware({});
        hardware.save(function(err) {
            if (err) {
                //TODO:log!
            } else {
                //TODO:log
            }
        });
    }
}))


/**
 * Find article by id
 */
exports.hardware = function(req, res, next, id) {
    console.log(id);
    Hardware.load(id, function(err, hardware) {
         if (err) return next(err);
        if (!hardware) return next(new Error('Failed to load hardware ' + id));
        req.hardware = hardware.populate('user', 'name username');
        next();
    });
};

/**
 * Create a article
 * NO creation => only one raspi! on first find, create one
 */
/*exports.create = function(req, res,next) {
    var hardware = new Hardware(req.body);
    hardware.user = req.user;
    hardware.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                hardware: hardware
            });
        } else {
            res.jsonp(hardware);

       }
        next();
    });

};*/

/**
 * Update a article
 */
exports.update = function(req, res,next) {
    //console.log(req.body.actuators.red.v, req.body.actuators.red.v/255);
    /*piblaster.setPwm('22',(req.body.actuators.red.v/255));
    piblaster.setPwm('23',(req.body.actuators.green.v/255));
    piblaster.setPwm('24',(req.body.actuators.blue.v/255));*/
    var hardware = req.hardware;
    hardware = _.extend(hardware, req.body);
    hardware.save(function(err) {
        res.jsonp(hardware);

    });

};

/**
 * Delete an article
 */
exports.destroy = function(req, res,next) {
    var hardware = req.hardware;

    hardware.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(hardware);
        }

    });

};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.hardware);

};

/**
 * List of Hardwares
 */
exports.all = function(req, res) {


    Hardware.find().populate('user', 'name username').exec(function(err, hardwares) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(hardwares);
        }

    });

};
