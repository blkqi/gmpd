angular
    .module('app', [require('angular-route'), require('angular-resource')])
	.config(function ($routeProvider, $locationProvider, $resourceProvider ) {
		$routeProvider
		  .when('/', {
			templateUrl: 'index.html',
			reloadOnSearch: false,
			controller: 'SearchController',
			controllerAs: 'main'
		  })
		  .otherwise({
			redirectTo: '/'
		  });
        $locationProvider.html5Mode(true);
        $resourceProvider.defaults.stripTrailingSlashes = false;
	});
