//Articles service used for articles REST endpoint
angular.module('mean.logs').factory("Logs", ['$resource', function($resource) {
    return $resource('logs/:type/:from/:to', {
        type: 'm1',
        from: new Date(Date.now()-86400*1000).getTime(),
        to: new Date().getTime()
    }, {

    });
}]);