$(document).ready(function(){

    $.contextMenu({
        selector: '.context-menu-one', 
        trigger: 'left',
    	callback: function(key, opt){ 
    	    var tracks = new Array();
    	    tracks.push(opt.$trigger.attr("data-track"));
      		var data = {
       		  "mode": key.split('-')[1],
       		  "type": key.split('-')[0],
       		  "id": opt.$trigger.attr("data-id"), //remove - this is redundant with album id
       		  "album": opt.$trigger.attr("data-album"),
       		  "artist": opt.$trigger.attr("data-artist"),
       		  "track": tracks
      		};
      		$.post("load", data, function(data, status){
          		$.notify(data,"success");
      		});
        },
        items: {
            "album-add": {name: "Add Album", icon: "add"},
            "album-play": {name: "Play Album", icon: "fa-play"},
            "track-add": {name: "Add Track", icon: "add"},
            "track-play": {name: "Play Track", icon: "fa-play"},
            "radio-play": {name: "Play Radio", icon: "fa-feed"}
        }
    });
    
    $('div.frm input').focus(function(){
    	$(this).select();
	});
    
    $("form#search input").val($.urlParam('q'));

    var width = $(window).width();
    $('#table').width(width);

});

$(window).resize(function() {
  var width = $(window).width();
  $('#table').width(width);
});

$.urlParam = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results ? results[1] : '';
}
