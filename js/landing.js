
$(document).ready(function() {

    // STICKY NAV
    if ( $(window).width() > 800) {     
      var header = $(".site-header");
        $(window).scroll(function() {
            var scroll = $(window).scrollTop();

            if (scroll >= 566) {
                header.removeClass('site-header').addClass("sticky-nav");
            } else {
                header.removeClass("sticky-nav").addClass('site-header');
            }
        });
    }
    else {
        var header = $(".site-header");
            $(window).scroll(function() {
                var scroll = $(window).scrollTop();

                if (scroll >= 556) {
                    header.removeClass('site-header').addClass("sticky-nav");
                } else {
                    header.removeClass("sticky-nav").addClass('site-header');
                }
            });
    }
    
});