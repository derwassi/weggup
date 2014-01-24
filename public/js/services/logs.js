//Articles service used for articles REST endpoint
angular.module('mean.logs').factory("Logs", ['$resource', function($resource) {
    return $resource('alarms/:type/:from/:to', {
        type: 'm1',
        from: new Date(new Date().now()-86400*1000),
        to: new Date()
    }, {

    });
}]);