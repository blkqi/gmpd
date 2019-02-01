angular
    .module('app', [require('angular-aria'), require('angular-animate'), require('angular-material'), require('angular-resource')])
    .controller('AppCtrl', AppCtrl)
    .controller('ToastCtrl', ToastCtrl)
    .component('artistListing', {
        templateUrl: 'partials/artist_listing.tmpl.html',
        controller: ArtistListingCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('albumListing', {
        templateUrl: 'partials/album_listing.tmpl.html',
        controller: AlbumListingCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('trackListing', {
        templateUrl: 'partials/track_listing.tmpl.html',
        controller: TrackListingCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('searchPage', {
        templateUrl: 'partials/search_page.tmpl.html',
        controller: SearchPageCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('albumPage', {
        templateUrl: 'partials/album_page.tmpl.html',
        controller: AlbumPageCtrl,
        bindings: { data: '=', menu: '=' }
    })
    .component('artistPage', {
        templateUrl: 'partials/artist_page.tmpl.html',
        controller: AlbumPageCtrl,
        bindings: { data: '=', menu: '=' }
    })

function AppCtrl($scope, $location, $resource, $mdToast) {
    var ctrl = this;

    ctrl.menu = [
        {name: 'Play track', mode: 'play', type: 'track', id: 'storeId', icon: 'play_arrow'},
        {name: 'Add track',  mode: 'add',  type: 'track', id: 'storeId', icon: 'add'},
        {name: 'Play album', mode: 'play', type: 'album', id: 'albumId', icon: 'playlist_play'},
        {name: 'Add album',  mode: 'add',  type: 'album', id: 'albumId', icon: 'playlist_add'},
        {name: 'Play radio', mode: 'play', type: 'radio', id: 'storeId', icon: 'radio'},
    ];

    function notify(data) {
        $mdToast.show({
            hideDelay: 3000,
            position: 'bottom right',
            controller: 'ToastCtrl',
            templateUrl: 'partials/toast.tmpl.html',
            locals: {data: data}
        });
    }

    function searchInterceptor(res,qry) {
        $location.search('q', res.config.params.q);
        ctrl.data = res.data;
        if (res.data.entries) {
            ctrl.data.tracks = ctrl.data.entries.filter((x) => x.track).map((x) => x.track);
            ctrl.data.albums = ctrl.data.entries.filter((x) => x.album).map((x) => x.album);
            ctrl.data.artists = ctrl.data.entries.filter((x) => x.artist).map((x) => x.artist);
        }
    }

    var searchResource = $resource('/api', {q: '@q'}, {
        search: {method: 'GET', interceptor: {response: (res) => { searchInterceptor(res,this) }}}
    });

    var entryResource = $resource('/api/:type', {type: '@type', id: '@id'}, {
        fetch: {method:'GET', interceptor: {response: (res) => { ctrl.data = res.data }}},
        load: {method:'POST', interceptor: {response: (res) => { notify(res) }}},
    });

    $scope.methods = {
        search: searchResource.search,
        fetch: entryResource.fetch,
        load: entryResource.load
    };

    $scope.init = function () {
        $scope.query = $location.search()['q'];
        ($scope.query != null) && searchResource.search({q: $scope.query});
    };

    $scope.$on('$locationChangeSuccess', function() {
        $scope.actualLocation = $location.url();
    });

    $scope.$watch(function () {return $location.url()}, function (newLocation, oldLocation) {
        if($scope.actualLocation === newLocation) {
          $scope.init();
        };
    });

}

function ToastCtrl($scope, data) {
    $scope.data = data;
}

function ArtistListingCtrl($scope) {
    $scope.methods = $scope.$parent.methods;
}

function AlbumListingCtrl($scope) {
    $scope.methods = $scope.$parent.methods;
}

function TrackListingCtrl($scope) {
    $scope.methods = $scope.$parent.methods;
}

function AlbumPageCtrl($scope) {
    $scope.methods = $scope.$parent.methods;
}

function ArtistPageCtrl($scope) {
    $scope.methods = $scope.$parent.methods;
}

function SearchPageCtrl($scope) {
    $scope.methods = $scope.$parent.methods;
}
