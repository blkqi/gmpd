angular.module('GMPDApp', [])
    .controller('SearchController', function($scope, $http) {
        $scope.search = function() {
            if ($scope.query) {
                $http({
                    method: 'GET',
                    url: '/search?q=' + encodeURIComponent($scope.query)
                }).then(function successCallback(res) {
                    $scope.tracks = res.data.entries.filter((x) => x.type == 1).map((x) => x.track);
                    $scope.artists = res.data.entries.filter((x) => x.type == 2).map((x) => x.artist);
                }, function errorCallback(res) {
                    console.log(res);
                });
            }
        }
    })

.directive('lightslider', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if (scope.$last) {
        element.parent().lightSlider({
			autoWidth: false,
			item:4,
			slideMove:2,
			slideMargin: 10,
			mode: "slide",
			useCSS: true,
			speed: 400, //ms'
			auto: false,
			loop: false,
			slideEndAnimation: true,
			pause: 2000,
			pager: true,
			enableTouch:true,
			enableDrag:true,
			freeMove:true,
			swipeThreshold: 40,
			pager: false,
			responsive : [
				{
					breakpoint:900,
					settings: {
						item:3,
						slideMove:1
					  }
				},
				{
					breakpoint:700,
					settings: {
						item:2,
						slideMove:1
					  }
				}
			]
		});
      }
    }
  };
});
