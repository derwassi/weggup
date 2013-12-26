/**
 * Created by wassi on 23.12.13.
 */
angular.module('mean.files').factory("Files", ['$resource', function($resource) {
    return $resource('files/:fileId', {
        fileId: '@_id'
    }, {

    });
}]);