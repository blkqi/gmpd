$(document).ready(function(){

    var table = $('#table').DataTable( {
        columnDefs: [ {
            orderable: false,
            targets: [1,4]
        } ],
      paging: false,
      searching: false,
      "order": [[ 0, "desc" ]]
    });

  var width = $(window).width();
  $('#table').width(width);

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
    
    $('#table tbody tr td.num').on( 'click', function () {
        if ( $(this).parent('tr').hasClass('selected') ) {
            $(this).parent('tr').removeClass('selected');
            $(this).find('img').attr('src','img/unchecked.png');
        }
        else {
            $(this).parent('tr').addClass('selected');
            $(this).find('img').attr('src','img/checked.png');
        }
        if ( $('#table tbody tr.selected').length > 0 ) {
          $('button.track').prop('disabled', false);
        }
        else {
          $('button.track').prop('disabled', true);
        }
    } );
 
    $('button.track').click( function () {
      var mode = $(this).attr('data-mode');
      var tracks = new Array();
      $('#table tbody tr.selected').each(function() {
        var id = $(this).attr('id');
        tracks.push(id);
      });
      var data = {
        "mode": mode,
        "type": "track",
        "track": tracks,
        "id": null
      };
      $.post("load", data, function(data, status){
          $.notify(data,"success");
          $('#table tbody tr').removeClass('selected');
          $('#table tbody tr td.num img').attr('src','img/unchecked.png');
      });
    });
    
    
    $('button#select').click( function () {
      if ( $(this).text().match('Select All') ) {
        $('#table tbody tr').addClass('selected');
        $('#table tbody tr td.num').find('img').attr('src','img/checked.png');
        $(this).text("Deselect All");
      }
      else {
        $('#table tbody tr').removeClass('selected');
        $('#table tbody tr td.num').find('img').attr('src','img/unchecked.png');
        $(this).text("Select All");
      }
      if ( $('#table tbody tr.selected').length > 0 ) {
       $('button.track').prop('disabled', false);
      }
      else {
        $('button.track').prop('disabled', true);
      }
    });
    
    $('div.frm input').focus(function(){
    	$(this).select();
    	$(this).parent().addClass("focused");
	}).focusout(function(){
    	$(this).parent().removeClass("focused");
	});

});

$(window).resize(function() {
  var width = $(window).width();
  $('#table').width(width);
});
