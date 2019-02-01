angular
    .module('app', [require('angular-route'), require('angular-resource')])
	.config(function ($routeProvider, $resourceProvider ) {
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
      $resourceProvider.defaults.stripTrailingSlashes = false;
	});
