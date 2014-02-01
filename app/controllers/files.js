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

    var basedir = req.params.basedir || './moodsounds/';
    fs.readdir(basedir,function(err,files){
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            var f = [];
            for(var file=0;file<files.length;file++){
                f.push({file:files[file]});
            }

            res.jsonp(f);
        }
    });

};
