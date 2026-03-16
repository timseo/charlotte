$(document).ready(function() {
    $(window).scroll(function() {
        var wScroll = $(this).scrollTop();
        $('.cc-para img').each(function() {
            if (wScroll >= $(this).offset().top - $(window).height()) {
                var top = (wScroll - $(this).offset().top + $(window).height()) * (15 / ($(window).height() + $(this).height()));
                $(this).css({
                    'transform': 'translate(0%, -' + top + '%) scale(1.17)',
                });
            }
        })
    })
    $('#shopify-section-1597713329899 .halo-column__item:nth-child(1) .logo__link').html('<h3>Interiors</h3>');
    $('#shopify-section-1597713329899 .halo-column__item:nth-child(2) .logo__link').html('<h3>Print Store</h3>');
    $('#shopify-section-1597713329899 .halo-column__item:nth-child(3) .logo__link').html('<h3>Branding</h3>');

    var $grid = $('.cc-container').masonry({
      itemSelector: '.cc-div',
      percentPosition: true,
      gutter: 70,
    });
  
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress( function() {
      $grid.masonry();
    });
  
    var message="Right-click has been disabled";
  
    function clickIE() {
        if (document.all) {
            (message);
            return false;
        }
    }
  
    function clickNS(e) {
        if (document.layers || (document.getElementById && !document.all)) {
            if (e.which == 2||e.which == 3) {
                (message);
                return false;
            }
        }
    }
  
    if (document.layers) {
        document.captureEvents(Event.MOUSEDOWN);
        document.onmousedown = clickNS;
    } else {
        document.onmouseup = clickNS;
        document.oncontextmenu = clickIE;
    }
  
    document.oncontextmenu = new Function("return false");
    document.getElementsByClassName('my-img').ondragstart = function() { return false; };  
});