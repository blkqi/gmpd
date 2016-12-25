require('lightslider');

angular
    .module('app')
    .directive('selectOnClick', SelectOnClickDirective)
    .directive('lightSlider', LightSliderDirective)
    .directive('contextMenu', ContextMenuDirective)

function SelectOnClickDirective($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', function() {
                if (!$window.getSelection().toString()) {
                    this.setSelectionRange(0, this.value.length);
                }
            });
        }
    };
}

function LightSliderDirective() {
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
}

function ContextMenuDirective($window, $http) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if (scope.$last) {
		$.contextMenu({
		  selector: ".context-menu-one", 
		  trigger: 'left',
		  build: function($trigger) {
			var options = {
			  callback: function(key, options) {
                $http({
                    method: 'POST',
                    url: '/load',
					data: {
						  "mode": key.split('-')[1],
						  "type": key.split('-')[0],
						  "album": $trigger.attr("data-album"),
						  "artist": $trigger.attr("data-artist"),
						  "track": [ $trigger.attr("data-track") ]
						}
				}).then(function successCallback(res) {
					console.log(res); //dosomething
				}, function errorCallback(res) {
					console.log(res); 
				});
			  },
			  items: {
					"radio-play": {name: "Play Radio", icon: "fa-feed"},
					"album-add": {name: "Add Album", icon: "add"},
					"album-play": {name: "Play Album", icon: "fa-play"}
			  }
			};
			if ($window.innerWidth)  {
			  options.items['track-add'] = {name: "Add Track", icon: "add"};
			  options.items['track-play'] = {name: "Play Track", icon: "fa-play"};
			}
			return options;
		  }
		})
      }
    }
  };
}
