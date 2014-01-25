//Global service for global variables
angular.module('mean.system').factory("Global", [
    function() {
        var _this = this;
        _this._data = {

        };

        return _this._data;
    }
]);
