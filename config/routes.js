module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);

    //Setting up the users api
    app.post('/users', users.create);

    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: 'Invalid email or password.'
    }), users.session);

    app.get('/users/me', users.me);

    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);



    //Article Routes
    var alarms = require('../app/controllers/alarms');
    var ringer = require('../app/controllers/ringer');

    app.get('/alarms', alarms.all);
    app.post('/alarms', auth.requiresLogin, alarms.create);
    app.get('/alarms/:alarmId', alarms.show);
    app.put('/alarms/:alarmId', auth.requiresLogin, auth.alarm.hasAuthorization,ringer.update, alarms.update );
    app.del('/alarms/:alarmId', auth.requiresLogin, auth.alarm.hasAuthorization,  ringer.update, alarms.destroy);
    app.param('alarmId', alarms.alarm);

    var hardware = require('../app/controllers/hardware');
    app.get('/hardware',hardware.all);
    app.put('/hardware/:hardwareId',hardware.update);
    app.param('hardwareId',hardware.hardware);

    var files = require('../app/controllers/files');
    app.get('/files',files.all);



    app.get('/ring',ringer.ring);
    //Finish with setting up the articleId param


    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
