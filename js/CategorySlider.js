$(document).ready(function () {
    $(".category-slider").owlCarousel({
        rtl: true,               
        loop: true,              
        margin: 20,              
        nav: false,              
        dots: true,              
        autoplay: true,          
        autoplayTimeout: 5000,   
        autoplayHoverPause: true,
        smartSpeed: 800,         
        responsive: {            
            0: {
                items: 1,
                margin: 10
            },
            576: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });
});