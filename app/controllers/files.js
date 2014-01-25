/**
 * Module dependencies.
 */
var _ = require('underscore');
var fs = require('fs');


/**
 *
 * List of files
 */
exports.all = function(req, res) {
    //TODO: in model auslagern!
    var basedir = req.params.basedir || './moodsounds/';
    fs.readdir(basedir,function(err,files){
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            var f = [];
            for(var file in files){
                f.push({file:files[file]});
            }

            res.jsonp(f);
        }
    });

};
