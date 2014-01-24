module.exports = function(app, passport, auth) {
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

    var hardware = require('../app/controllers/hardware');
    app.get('/hardware',hardware.all);
    app.put('/hardware/:hardwareId',hardware.update);
    app.param('hardwareId',hardware.hardware);

    var files = require('../app/controllers/files');
    app.get('/files',files.all);



    var settings = require('../app/controllers/settings');
    var moduleLauncher = require('../app/controllers/moduleLauncher');
    var lightModule = require('../app/modules/light/light');
    var moodLightModule = require('../app/modules/light/light');
    var vorleserModule = require('../app/modules/sound/vorleser');

    app.get('/module/light',settings.show);
    app.get('/module/moodLight',settings.show);
    app.get('/module/vorleser',settings.show);

    app.get('/module/light/start',moduleLauncher.getLauncher(lightModule,'/'));
    app.get('/module/moodLight/start',moduleLauncher.getLauncher(moodLightModule,'/'));
    app.get('/module/vorleser/start',moduleLauncher.getLauncher(vorleserModule,'/'));

    app.get('/module/light/stop',moduleLauncher.getStopper(lightModule,'/'));
    app.get('/module/moodLight/stop',moduleLauncher.getStopper(moodLightModule,'/'));
    app.get('/module/vorleser/stop',moduleLauncher.getStopper(vorleserModule,'/'));

    app.put('/module/light',settings.edit);
    app.put('/module/moodLight',settings.edit);
    app.put('/module/vorleser',settings.edit);


    app.get('/ring',ringer.ring);
    //Finish with setting up the articleId param


    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
