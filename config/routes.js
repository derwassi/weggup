module.exports = function(app) {
    //User Routes


    //Article Routes
    var alarms = require('../app/controllers/alarms');
    var ringer = require('../app/controllers/ringer');

    app.get('/alarms', alarms.all);
    app.post('/alarms',  alarms.create);
    app.get('/alarms/:alarmId', alarms.show);
    app.put('/alarms/:alarmId',ringer.update, alarms.update );
    app.del('/alarms/:alarmId', ringer.update, alarms.destroy);
    app.param('alarmId', alarms.alarm);


    var files = require('../app/controllers/files');
    app.get('/files',files.all);

    var settings = require('../app/controllers/settings');
    var moduleLauncher = require('../app/controllers/moduleLauncher');

    var modulesKeys = ['light/light','light/moodLight','sound/vorleser'];
    for(var i=0;i<modulesKeys.length;i++){
        var module = require('../app/modules/'+modulesKeys[i]);

        app.get('/module/' + modulesKeys[i]+'/start',moduleLauncher.getLauncher(module,'/'));
        app.get('/module/' + modulesKeys[i]+'/stop',moduleLauncher.getStopper(module,'/'));
        app.get('/module/' + modulesKeys[i],settings.getShower(module));
        app.put('/module/' + modulesKeys[i],settings.getEditor(module));
    }


    var logs = require('../app/controllers/logs');
    app.get('/logs/:type/:from/:to',logs.all);



    //app.get('/ring',ringer.ring);
    //Finish with setting up the articleId param


    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
