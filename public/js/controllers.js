angular
    .module('app')
    .controller('SearchController', SearchController);
    
function SearchController($scope, $http, $location) {
    $scope.search = function() {
        if ($scope.query) {
            $http({
                method: 'GET',
                url: '/search?q=' + encodeURIComponent($scope.query)
            }).then(function successCallback(res) {
                $scope.tracks = res.data.entries.filter((x) => x.type == 1).map((x) => x.track);
                $scope.artists = res.data.entries.filter((x) => x.type == 2).map((x) => x.artist);
                $location.search({ q: $scope.query });
            }, function errorCallback(res) {
                console.log(res);
            });
        }
    }
    $scope.artist = function(id) {
        $http({
            method: 'GET',
            url: '/artist?id=' + encodeURIComponent(id)
        }).then(function successCallback(res) {
            $scope.tracks = res.data.topTracks;
            $scope.artists = [];
            $location.search({ artist: id });
        }, function errorCallback(res) {
            console.log(res);
        });
    }
    $scope.album = function(id) {
        $http({
            method: 'GET',
            url: '/album?id=' + encodeURIComponent(id)
        }).then(function successCallback(res) {
            $scope.tracks = res.data.tracks;
            $scope.artists = [];
            $location.search({ album: id });
        }, function errorCallback(res) {
            console.log(res);
        });
    }
    $scope.load = function(id,mode) {
        if ($scope.query) {
            $http({
                method: 'POST',
                url: '/load',
                data: { 
                    track: [id],
                    type: 'track',
                    mode: mode
                    }
            }).then(function successCallback(res) {
                console.log(res); //dosomething
            }, function errorCallback(res) {
                console.log(res); 
            });
        }
    }
    if ($location.search()['q']) {
        $scope.query = $location.search()['q'];
        $scope.search();
    }
    else if ($location.search()['artist']) {
        $scope.artist($location.search()['artist']);
    }
    else if ($location.search()['album']) {
        $scope.album($location.search()['album']);
    }
}
