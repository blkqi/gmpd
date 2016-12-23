$(document).ready(function(){
    
    $(window).on('load', function(){ updateView() });
    $(window).on('resize', function(){ updateView() });
	
	$.contextMenu({
	  selector: ".context-menu-one", 
	  trigger: 'left',
	  build: function($trigger) {
		var options = {
		  callback: function(key, options) {
				var data = {
				  "mode": key.split('-')[1],
				  "type": key.split('-')[0],
				  "album": $trigger.attr("data-album"),
				  "artist": $trigger.attr("data-artist"),
				  "track": [ $trigger.attr("data-track") ]
				};
				$.post("load", data, function(data, status){
				  //$.notify(data,"success");
				});
		  },
		  items: {
				"radio-play": {name: "Play Radio", icon: "fa-feed"},
				"album-add": {name: "Add Album", icon: "add"},
				"album-play": {name: "Play Album", icon: "fa-play"}
		  }
		};
		if ($('body').hasClass('mini')) {
		  options.items['track-add'] = {name: "Add Track", icon: "add"};
		  options.items['track-play'] = {name: "Play Track", icon: "fa-play"};
		}
		return options;
	  }
	});
	
    $('.btn.track').click( function () {
      var data = {
        "mode": $(this).attr('data-mode'),
        "type": "track",
        "track": [ $(this).attr('data-track') ],
        "id": null
      };
      $.post("load", data, function(data, status){
          $.notify(data,"success");
      });
    });
    
    $('.btn.track').click( function () {
      var data = {
        "mode": $(this).attr('data-mode'),
        "type": "track",
        "track": [ $(this).attr('data-track') ],
        "id": null
      };
      $.post("load", data, function(data, status){
          //$.notify(data,"success");
      });
    });
    
	/*$("#search").submit(function(event) {
		event.preventDefault();
		var $form = $(this),
			term = $form.find('input[name="q"]').val(),
			url = $form.attr('action');
		var data = {
			"q": term
		};
		$.get(url, data, function(data, status){
			//$.notify(data,"success");
		});
	});*/

    $("#artist-cards").lightSlider({
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
    
    $('div.frm input').focus(function(){
    	$(this).select();
	});
	
    $("form#search input").val(decodeURIComponent(urlParam('q').replace(/\+/g, '%20')));

});

function updateView() {
	if ( $( window ).width() < 600 ) {
		$('body').addClass('mini');
	}
	else {
		$('body').removeClass('mini');
	}
}

function urlParam(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results ? results[1] : '';
}
