var url = require('url');

angular
    .module('app', [require('angular-aria'), require('angular-animate'), require('angular-material')])
    .controller('SearchController', SearchController);
    
function SearchController($scope, $http, $location, $mdToast) {
    $scope.menuItems = [
        {name: 'Play track', mode: 'play', type: 'track', id: 'storeId', icon: 'play_arrow'},
        {name: 'Add track',  mode: 'add',  type: 'track', id: 'storeId', icon: 'add'},
        {name: 'Play album', mode: 'play', type: 'album', id: 'albumId', icon: 'playlist_play'},
        {name: 'Add album',  mode: 'add',  type: 'album', id: 'albumId', icon: 'playlist_add'},
        {name: 'Play radio', mode: 'play', type: 'radio', id: 'storeId', icon: 'radio'},
    ];

    function get_method(path, query) {
        $http({
            method: 'GET',
            url: url.format({pathname: '/api/' + path, query: query})
        }).then(function successCallback(res) {
            $location.path(path);
            $location.search(query);
            $scope.data = res.data;
            console.log($scope.data);
        }, function errorCallback(res) {
            console.log(res);
        });
    }

    $scope.search = function() { get_method('', {'q': $scope.query}) }
    $scope.artist = function(id) { get_method('artist', {'id': id}) }
    $scope.album = function(id) { get_method('album', {'id': id}) }
    $scope.load = function(id, mode, type) {
        $http({
            method: 'POST',
            url: '/load',
            data: { 
                id: id,
                type: type,
                mode: mode
            }
        }).then(function successCallback(res) {
            if (res.status == 202) $scope.notify(id);
        }, function errorCallback(res) {
            console.log(res); 
        });
    }

    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
      sanitizePosition();

      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
      var current = $scope.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    }

    $scope.notify = function(id) {
        var pinTo = $scope.getToastPosition();

        $mdToast.show(
            $mdToast.simple()
              .textContent(id)
              .position(pinTo)
              .hideDelay(3000)
        );
    }

    // cheeky way of handling page refreshes
    switch ($location.path()) {
    case "/":
        $scope.query = $location.search()['q'];
        if ($scope.query) $scope.search();
    case "/artist":
        $scope.artist($location.search()['id']);
    case "/album":
        $scope.album($location.search()['id']);
    default:
        console.log($location.path());
    }
}
