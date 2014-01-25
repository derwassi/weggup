/**
 * Created by wassi on 24.01.14.
 */
var mongoose = require('mongoose');
var Datalog = mongoose.model('Datalog');
/**
 * List of Alarms
 */
exports.all = function(req, res) {

    //TODO handle default fallbacks
    var data = {
            type: req.params.type,
            from: new Date(parseInt(req.params.from)),
            to: new Date(parseInt(req.params.to))
    };
    Datalog.find({created:{$gte: data.from, $lt:data.to},type:data.type}).sort('created').exec(function(err, logs) {
        if (err) {
            res.render('500', {
                status: 500
            });
        } else {

            res.jsonp(logs);
        }

    });

};