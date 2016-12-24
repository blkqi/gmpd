$(document).ready(function(){
    $(window).on('load', function(){ updateView() });
    $(window).on('resize', function(){ updateView() });
    $('div.frm input').focus(function(){ $(this).select(); });
});

function updateView() {
	if ($( window ).width() < 600)
        $('body').addClass('mini');
	else
        $('body').removeClass('mini');
}
