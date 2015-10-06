var carousel = function(node, reverse) {
    var $active = $(node + ' .active');
    if(reverse) {
        var $next = ($active.prev().length > 0) ? $active.prev() : $(node + ' img:last');
    } else {
        var $next = ($active.next().length > 0) ? $active.next() : $(node + ' img:first');
    }
    $next.css('z-index',2);//move the next image up the pile
    $active.fadeOut(1500,function(){//fade out the top image
        $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
        $next.css('z-index',3).addClass('active');//make the next image the top one
    });
};

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

$(window).load(function() {
    carousel('#slides-easier');
    var heroSlideCount = 3;
    var heroCounter = 1;
    setInterval(function () {
        carousel('#slides');
        carousel('#slides-easier');
        var targetIndex = (heroCounter % heroSlideCount);
        switch( targetIndex ) {
            case 0:
                $("#hero-slide0").fadeTo(1000, 1, function() {
                    for( var x = 1; x < heroSlideCount; x++ ) {
                        $("#hero-slide"+x).css('opacity', 1);
                    }
                    heroCounter++;
                });
                break;
            case 1:
                $("#hero-slide0").fadeTo(1000, 0, function() {
                    heroCounter++;
                });
                break;
            default:
                var targetId = "#hero-slide"+(targetIndex-1);
                $(targetId).fadeTo(1000, 0, function() {
                    heroCounter++;
                });
                break;
        }
    }, 5000);
    function getActiveNavItem() {
        for(var i=1; i<=heroSlideCount; i++) {
            if($('#slot' + i).hasClass('active')) return i;
        }
    }
    function populateNavbar() {
        for(var i=1; i<=heroSlideCount; i++) {
            var circleType = $('#slot' + i).hasClass('active') ? 'dark' : 'light';
            $('#slot' + i).attr({src: '/img/landing/' +  circleType + '-circle.png'});
        }
    }
    populateNavbar();
    $('#scrollTip').attr(
        {src: "/img/landing/swell_tips_03.jpg"}
        );
    var stepNavbar = function(increment) {
        var activeNavItem = getActiveNavItem();
        $('#slot' + activeNavItem).removeClass('active');
        var newIndex = increment ?
        (activeNavItem == NUM_SLOTS ? 1 : activeNavItem + 1) :
        (activeNavItem == 1 ? NUM_SLOTS : activeNavItem - 1);
        $('#slot' + newIndex).addClass('active');
        populateNavbar();
        $('#scrollTip').attr(
            {src: "/img/landing/swell_tips_0" + activeNavItem + ".jpg"}
            );
    }
    $("#left-arrow").click(function() {
        stepNavbar(false);
    });
    $("#right-arrow").click(function() {
        stepNavbar(true);
    });
    $("#enter-another-task").click(function(e) {
        e.preventDefault();
        $("#task").val('');
        $("#task-description").val('');
        $('.task-submit-success').hide();
        $('.task-submit').show();
    });
    $("#submit-task").click(function(e) {
        e.preventDefault();
        var email = $("#email-address").val();
        var description = $("#task-description").val();
        var errors = '';
        if(!email.length) {
            errors += "Email cannot be blank.\n"
        } else {
          var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
          if(!pattern.test(email)) {
              errors += "Email address is not valid.\n"
          }
        }
        if(!description.length) {
            errors += "The task field cannot be blank.\n"
        }
        if(errors) {
            alert(errors);
        } else {
            $.post('/authlesstask', { email: email, description: encodeURIComponent(description)}, function( data ) {
                $('.task-submit').hide();
                $('.task-submit-success').show();
            });
        }
    });
});