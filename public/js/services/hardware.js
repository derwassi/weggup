//Articles service used for articles REST endpoint
angular.module('mean.hardware').factory("Hardware", ['$resource', function($resource) {
    return $resource('hardware/:hardwareId', {
        hardwareId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);