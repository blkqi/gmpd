angular
    .module('app')
    .directive('selectOnClick', SelectOnClickDirective)
    .directive('blurOnEnter', blurOnEnter)

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

function blurOnEnter($parse) {
    return {
        link:  function (scope, element, attrs) {
            element.bind("keypress", function (event) {
                if(event.which === 13) {
                    element.blur();
                }
            });
        }
    }
}
