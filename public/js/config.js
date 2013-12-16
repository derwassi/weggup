//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/alarms', {
            templateUrl: 'views/alarms/list.html'
        }).
        when('/alarms/create', {
            templateUrl: 'views/alarms/create.html'
        }).
        when('/alarms/:alarmId/edit', {
            templateUrl: 'views/alarms/edit.html'
        }).
        when('/alarms/:alarmId', {
            templateUrl: 'views/alarms/view.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);