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
        // Ensure animations run on mobile too
        new WOW({ mobile: true, live: true, offset: 0 }).init();

        // Animate trust-strip items when horizontally scrolled into view on mobile
        (function() {
            if (window.matchMedia('(max-width: 767px)').matches) {
                var scroller = document.querySelector('.trust-strip .row');
                if (!scroller || !('IntersectionObserver' in window)) return;
                var io = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var el = entry.target;
                            // Add animation classes and ensure visibility
                            el.classList.add('animated');
                            if (!el.classList.contains('a-fade-up') && !el.classList.contains('a-fade-in')) {
                                el.classList.add('a-fade-up');
                            }
                            el.style.visibility = 'visible';
                            io.unobserve(el);
                        }
                    });
                }, { root: scroller, threshold: 0.6 });
                Array.prototype.forEach.call(scroller.children, function(child) {
                    io.observe(child);
                });
            }
        })();

            // Auto-scroll trust-strip to next item every 2 seconds on mobile
            (function() {
                var mql = window.matchMedia('(max-width: 767px)');
                var scroller = null;
                var items = [];
                var timer = null;
                var currentIndex = 0;

                function centerTo(index) {
                    if (!scroller || !items.length) return;
                    var el = items[index];
                    var left = el.offsetLeft - (scroller.clientWidth - el.clientWidth) / 2;
                    if (left < 0) left = 0;
                    scroller.scrollTo({ left: left, behavior: 'smooth' });
                }

                function findNearestIndex() {
                    if (!scroller || !items.length) return 0;
                    var viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
                    var best = 0, bestDist = Infinity;
                    for (var i = 0; i < items.length; i++) {
                        var el = items[i];
                        var elCenter = el.offsetLeft + el.offsetWidth / 2;
                        var d = Math.abs(elCenter - viewportCenter);
                        if (d < bestDist) { bestDist = d; best = i; }
                    }
                    return best;
                }

                function start() {
                    stop();
                    scroller = document.querySelector('.trust-strip .row');
                    if (!scroller) return;
                    items = Array.prototype.filter.call(scroller.children, function(node){ return node.nodeType === 1; });
                    if (items.length <= 1) return;
                    currentIndex = findNearestIndex();
                    timer = setInterval(function() {
                        currentIndex = (currentIndex + 1) % items.length;
                        centerTo(currentIndex);
                    }, 2000);

                    // Stop auto-scroll while user interacts, resume after a short delay
                    var pauseRestart = function() {
                        stop();
                        clearTimeout(pauseRestart._t);
                        pauseRestart._t = setTimeout(function(){ if (mql.matches) start(); }, 5000);
                    };
                    scroller.addEventListener('touchstart', pauseRestart, { passive: true });
                    scroller.addEventListener('mousedown', pauseRestart);
                    scroller.addEventListener('wheel', pauseRestart, { passive: true });
                }

                function stop() {
                    if (timer) { clearInterval(timer); timer = null; }
                }

                // Initialize based on current viewport
                if (mql.matches) start();

                // Re-evaluate on viewport changes
                if (mql.addEventListener) {
                    mql.addEventListener('change', function(e){ e.matches ? start() : stop(); });
                } else if (mql.addListener) {
                    // Older browsers
                    mql.addListener(function(e){ e.matches ? start() : stop(); });
                }
            })();

                    // Display flash message based on URL ?status using a toast; also set inline message as fallback
                    (function() {
                        function ensureToastContainer() {
                            var c = document.querySelector('.hr-toast-container');
                            if (!c) {
                                c = document.createElement('div');
                                c.className = 'hr-toast-container';
                                document.body.appendChild(c);
                            }
                            return c;
                        }

                        function showToast(message, type) {
                            var container = ensureToastContainer();
                            var toast = document.createElement('div');
                            toast.className = 'hr-toast ' + (type || 'success');
                            toast.setAttribute('role', 'status');
                            toast.setAttribute('aria-live', 'polite');
                            toast.innerHTML = '<span class="hr-toast-icon"><i class="fa ' + (type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle') + '"></i></span>' +
                                                                '<div class="hr-toast-message"></div>' +
                                                                '<button class="hr-toast-close" aria-label="Close">&times;</button>';
                            toast.querySelector('.hr-toast-message').textContent = message;
                            container.appendChild(toast);
                            // trigger animation
                            requestAnimationFrame(function(){ toast.classList.add('show'); });

                            var remove = function() {
                                toast.classList.remove('show');
                                setTimeout(function(){ if (toast.parentNode) toast.parentNode.removeChild(toast); }, 250);
                            };
                            var timer = setTimeout(remove, 5000);
                            toast.querySelector('.hr-toast-close').addEventListener('click', function(){ clearTimeout(timer); remove(); });
                        }

                        try {
                            var params = new URLSearchParams(window.location.search);
                            var status = params.get('status');
                            if (!status) return;
                            var isSuccess = status === 'success';
                            var msg = isSuccess ? 'Thanks, your message has been sent.' : 'Sorry, we could not send your message right now. Please try again later.';

                            // Show toast
                            showToast(msg, isSuccess ? 'success' : 'error');

                            // Inline fallback near form if present
                            var target = document.querySelector('.form-messege');
                            if (target) {
                                target.textContent = msg;
                                target.classList.remove('error','success');
                                target.classList.add(isSuccess ? 'success' : 'error');
                            }
                        } catch (e) {}
                    })();


})(jQuery);