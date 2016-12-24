$(document).ready(function(){
    
    $(window).on('load', function(){ updateView() });
    $(window).on('resize', function(){ updateView() });
    
    $('.btn.track').click( function () {
      var data = {
        "mode": $(this).attr('data-mode'),
        "type": "track",
        "track": [ $(this).attr('data-track') ],
        "id": null
      };
      $.post("load", data, function(data, status){
          //$.notify(data,"success");
          alert('success');
      });
    });
    
    $('div.frm input').focus(function(){
    	$(this).select();
	});
	
    //$("form#search input").val(decodeURIComponent(urlParam('q').replace(/\+/g, '%20')));

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
