(function ($) {
 "use strict";

 /* meanmenu */
 $('#mobile-menu').meanmenu({
	 meanMenuContainer: '.mobile-menu',
	 meanScreenWidth: "767" 
 });


/* slider-active */
$('.slider-active').owlCarousel({
    loop:false,
    nav:true,
    dots:true,
    center:false,
    autoplay:false,
    navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
    responsive:{
        0:{
            items:1,
            dots:false
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})


  /* counter */

$('.counter').counterUp();

   /* scrollUp */

$.scrollUp({
    scrollName: 'scrollUp', // Element ID
    topDistance: '300', // Distance from top before showing element (px)
    topSpeed: 300, // Speed back to top (ms)
    animation: 'fade', // Fade, slide, none
    animationInSpeed: 200, // Animation in speed (ms)
    animationOutSpeed: 200, // Animation out speed (ms)
    scrollText: '<i class="fa fa-angle-up"></i>', // Text for element
    activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
  });



/* testimonial-active */
	
$('.testimonial-active').owlCarousel({
    loop:true,
    nav:false,
    navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
	dots:true,
    responsive:{
        0:{
            items:1,
			nav:false,
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})	
	




/* team-active */
$('.team-active').owlCarousel({
    loop:true,
    nav:true,
    navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
	dots:false,
    margin:30,
    responsive:{
        0:{
            items:1,
        },
        600:{
            items:1
        },
        768:{
            items:2,
			nav:false,
        },
        1000:{
            items:4
        }
    }
})	




// Using Bootstrap 5's built-in Collapse for FAQ accordion (no custom handler needed)

/*-------------------------------------------
    	02. wow js active
    --------------------------------------------- */
    new WOW().init();


})(jQuery);