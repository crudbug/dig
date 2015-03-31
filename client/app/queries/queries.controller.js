'use strict';

angular.module('digApp')
.controller('QueriesCtrl', ['$scope', '$state', '$http', 'socket', 'User', 'euiConfigs',
    function($scope, $state, $http, socket, User, euiConfigs) {

    $scope.currentUser = User.get();
    $scope.opened = [];
    $scope.frequencyOptions = ['daily', 'weekly', 'monthly'];
    $scope.facets = euiConfigs.facets;

    $http.get('api/query/').
        success(function(data) {
            $scope.queryResults = data;
            socket.syncUpdates('query', $scope.queryResults);
        }).
        error(function(data, status, headers, config) {
            console.log(config.method + ' to ' + config.url + ' returned with status code of ' + status);
        });

    $scope.toggleListItemOpened = function(index) {
        $scope.opened[index] = !($scope.opened[index]);
    };

    $scope.isListItemOpened = function(index) {
        return ($scope.opened[index]) ? true : false;
    };

    $scope.deleteQuery = function(id) {
        $http.delete('api/query/' + id).
            error(function(data, status, headers, config) {
                console.log(config.method + ' to ' + config.url + ' returned with status code of ' + status);
            });
    };

    $scope.toggleFrequency = function(id, selectedOption) {
        $http.put('api/query/' + id, {frequency: selectedOption}).
            error(function(data, status, headers, config) {
                console.log(config.method + ' to ' + config.url + ' returned with status code of ' + status);
            });
    };

    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('query');
    });

    $scope.runQuery = function(query) {
        $state.go('search.results.list', {
            query: query
        }, {
            location: true
        });
    };

}]);