angular.module('mean.logs').controller('LogsController', ['$scope', '$routeParams', '$location', 'Global', 'Logs' ,function ($scope, $routeParams, $location, Global,Logs) {

    $scope.from = new Date(new Date().getTime()-86400*1000);
    $scope.to = new Date();
    $scope.logs = [{id:'l',selected:false, name:'Brightness', data:null, color:0},
        {id:'m1',selected:false, name:'Movement (primary)',data:null, color:1},
        {id:'m2',selected:false, name:'Movement (secondary)',data:null, color:2},
        {id:'ti',selected:false, name:'Temperature (inner)',data:null, color:3},
        {id:'to',selected:false, name:'Temperature (outer)',data:null, color:4}
    ];
    $scope.data = [];

    $scope.chartConfig = {xaxis: {
        mode: "time"},
        series:{
            lines:{
                show:true,
                steps:true
            }
        }
    };

    var processData = function(data){
        var d = [];
        for(var i=0;i<data.length;i++){

            d.push([Date.parse(data[i].created),data[i].value]);
        }
        return d;
    };
    var updateLog = function(log,from,to,callback){
        var params = {
            type: log.id,
            from:from.getTime(),
            to: to.getTime()
        };

        Logs.query(params, function(logs) {
            log.data = processData(logs);
            callback(log);
        });
    };

    var setGraphs = function(){
        $scope.data = [];
        angular.forEach($scope.logs,function(log){
            if(log.selected && log.data){
                $scope.data.push({label:log.name,data:log.data, color:log.color});
            }
        });
    };

    $scope.changeDate = function(){
        angular.forEach($scope.logs,function(v){
            updateLog(v,$scope.from,$scope.to,setGraphs);
        });
    };

    $scope.change = function(log){
        if(log.selected && log.data===null){
           updateLog(log,$scope.from, $scope.to,setGraphs);
        }else{

            setGraphs();
        }

    };


}]);