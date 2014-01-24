/**
 * Created by wassi on 24.01.14.
 */

/**
 * List of Alarms
 */
exports.all = function(req, res) {
    //TODO handle default fallbacks
    var data = {
            type: req.params.type,
            from: Date.parse(req.params.from),
            to: Date.parse(req.params.to)
    };

    Datalog.find({created:{$gte: data.from, $lte:date.to},type:date.type}).sort('created').exec(function(err, logs) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(logs);
        }

    });

};