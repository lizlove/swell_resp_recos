$(document).ready(function() {

    // STICKY NAV
    if ( $(window).width() > 800) {     
      var header = $(".site-header");
        $(window).scroll(function() {
            var scroll = $(window).scrollTop();

            if (scroll >= 500) {
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

                if (scroll >= 400) {
                    header.removeClass('site-header').addClass("sticky-nav");
                } else {
                    header.removeClass("sticky-nav").addClass('site-header');
                }
            });
    }
    
});

$(document).ready(function() {
    var initialLeftPosition = $('#carousel-slides').position();
    var initialLeft = parseInt(initialLeftPosition.left);
    $("#carousel-arrow-next").click(function(event) {
        event.preventDefault();
        var innerOffset = $('#carousel-slides').position();
        var leftOffset = parseInt(innerOffset.left);
        var innerWidth = parseInt($('#carousel-slides').width());
        var containerWidth =  parseInt($('#carousel-inner').width());
        var diffWidth = $($('.carousel-item')[0]).outerWidth(true);
        var targetLeft = leftOffset - diffWidth - initialLeft;
        if( targetLeft < containerWidth-innerWidth ) {
            targetLeft = containerWidth-innerWidth;
        }
        $('#carousel-slides').animate({
            left: targetLeft
        });
    });

    $("#carousel-arrow-previous").click(function(event) {
        event.preventDefault();
        var innerOffset = $('#carousel-slides').position();
        var leftOffset = parseInt(innerOffset.left);
        var diffWidth = $($('.carousel-item')[0]).outerWidth(true);
        var targetLeft = leftOffset + diffWidth - initialLeft;
        if( targetLeft > 0 ) {
            targetLeft = 0;
        }
        $('#carousel-slides').animate({
            left: targetLeft
        });
    });
});

$(document).ready(function() {
    var initialLeftPosition = $('#carousel-slides-02').position();
    var initialLeft = parseInt(initialLeftPosition.left);
    $("#carousel-arrow-next-02").click(function(event) {
        event.preventDefault();
        var innerOffset = $('#carousel-slides-02').position();
        var leftOffset = parseInt(innerOffset.left);
        var innerWidth = parseInt($('#carousel-slides-02').width());
        var containerWidth =  parseInt($('#carousel-inner-02').width());
        var diffWidth = $($('#carousel-item')[0]).outerWidth(true);
        var targetLeft = leftOffset - diffWidth - initialLeft;
        if( targetLeft < containerWidth-innerWidth ) {
            targetLeft = containerWidth-innerWidth;
        }
        $('#carousel-slides-02').animate({
            left: targetLeft
        });
    });

    $("#carousel-arrow-previous-02").click(function(event) {
        event.preventDefault();
        var innerOffset = $('#carousel-slides-02').position();
        var leftOffset = parseInt(innerOffset.left);
        var diffWidth = $($('#carousel-item')[0]).outerWidth(true);
        var targetLeft = leftOffset + diffWidth - initialLeft;
        if( targetLeft > 0 ) {
            targetLeft = 0;
        }
        $('#carousel-slides-02').animate({
            left: targetLeft
        });
    });
});