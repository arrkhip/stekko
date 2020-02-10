$(function() {

	$('.js-header-sm__switch').click(function() {
		$('.header-sm__switch').toggleClass('open');
		$('.header-sm__inner').toggleClass('open');
		$('body').toggleClass('scroll-hidden');
	});

});