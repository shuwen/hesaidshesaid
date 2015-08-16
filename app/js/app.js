// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(document).ready(function() {

	$( "#choose_your_story" ).addClass("move_down");

	/*=== Move Intro Screen into He/She Select ===*/

	/* $('#bgvid').on('ended',function() {    

		$( "#choose_your_story" ).addClass("move_down");
		$( ".fullscreen-bg" ).addClass("move_down_vid");

	}); */

	$('.cys_he_container').click(function() {
		$('#choose_your_story').addClass('header_transform');
		$('.fullscreen-bg').addClass('hide');
		$('.cys_he_container').addClass('header_transform');
		$('.cys_she_container').addClass('header_transform animated');
		$('.header_container').addClass('fadeOut');
		$('.main_screen_container').addClass('show');
		$('this').addClass('new_header_click');
	});
	
	$('.cys_he_container').click(function() {

		if ($("#choose_your_story").hasClass("header_transform")) {

			$("body").removeClass("she_toggled").addClass("he_toggled");
		}

	});

	$('.cys_she_container').click(function() {

		if ($("#choose_your_story").hasClass("header_transform")) {

			$("body").removeClass("he_toggled").addClass("she_toggled");
		}

	});

	/*=== Toggle Body Class ===*/

	$('.he_said_header').click(function() {

		$("body").removeClass("she_toggled").addClass("he_toggled");

	});

	$('.she_said_header').click(function() {

		$("body").removeClass("he_toggled").addClass("she_toggled");

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