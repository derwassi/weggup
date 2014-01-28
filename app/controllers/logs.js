/**
 * Created by wassi on 24.01.14.
 */
var mongoose = require('mongoose');
var Datalog = mongoose.model('Datalog');
var fs=require('fs');
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
    Datalog.aggregate([{$match:{created:{$gte: data.from, $lt:data.to},type:data.type}},{$group:{
            _id: {
                year       : { $year       : '$created' },
                month      : { $month      : '$created' },
                dayOfMonth : { $dayOfMonth : '$created' },
                hour : {$hour : '$created'},
                minute: {$minute : '$created'},
                second: {$second : '$created'}
            },
            dt_sample : { $first : '$created' },
            val:{$first:'$value'},
            sum   : { $sum : '$value'},
            count : { $sum : 1 }

        }},{
            $project: {
                _id   : 0,
                created  : '$dt_sample',

                sum   : 1,
                count : 1,
                value   : { $divide: ['$sum', '$count'] }
            }
        }]).sort('created').exec(function(err, logs) {
        if (err) {
            res.render('500', {
                status: 500
            });
        } else {
            /*fs.open('logs-'+data.type+'-'+req.params.from+'-'+req.params.to,'w',function(err,fd){
                logs.forEach(function(v,k){
                    fs.writeSync(fd, v.created.getFullYear()+'-'+ (v.created.getMonth()+1)+'-'+ v.created.getDate()+' ' + v.created.getHours()+':'+ v.created.getMinutes()+':'+ v.created.getSeconds()+";"+ v.value+"\r\n");

                });
                fs.close(fd);
            })*/
            res.jsonp(logs);
        }

    });

};