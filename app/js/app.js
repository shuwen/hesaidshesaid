// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(document).ready(function() {

	$('#bgvid').on('ended',function() {    

		$( "#choose_your_story" ).load( "chooseyourstory.html" );

	});

});

$(window).load(function() {
  $('.flexslider').flexslider({
    animation: "fade",
    controlNav: false,
    directionNav: false,
    slideshowSpeed: 2000
  });
});