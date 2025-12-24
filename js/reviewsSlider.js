$(document).ready(function () {
        const $owl = $('.client_owl-carousel');
        if ($owl.data('owl.carousel')) {
            $owl.owlCarousel('destroy');
        }

        $owl.owlCarousel({
            loop: true,
            margin: 20,
            dots: true,
            nav: false,
            autoplay: true,
            autoplayHoverPause: true,
            rtl: true, 
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                1000: {
                    items: 3
                }
            }
        });
    })