$(document).ready(function () {
    var myCarousel = $('#customCarousel1');

    myCarousel.carousel({
        interval: 5000, 
        pause: 'hover', 
        ride: 'carousel'
    });

    myCarousel.on('slide.bs.carousel', function (e) {
        var detailBox = $(e.relatedTarget).find('.detail-box');
        
        detailBox.css('opacity', '0').css('transform', 'translateY(5px)');
        
        setTimeout(function() {
            detailBox.animate({
                opacity: 1,
                transform: 'translateY(0)'
            }, 600);
        }, 200);
    });
});