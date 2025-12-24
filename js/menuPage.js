   $("#collapseCategory").click(function () {
        $("#collapseCategory").toggleClass('open');
        $(".category-list").toggleClass('collapsed');
    });
    $("#collapseBrand").click(function () {
        $("#collapseBrand").toggleClass('open');
        $(".brand-list").toggleClass('collapsed');
    });

    $(document).on('click', '.category-item, .brand-item, .categories-slider .item', function () {
        $('.category-item, .brand-item, .categories-slider .item').removeClass('active');
        $(this).addClass('active');
    });

    $('.has-child .parent-link').click(function(e) {
        e.preventDefault();
        const parentLi = $(this).closest('.has-child');
        parentLi.find('.sub-menu').slideToggle(300);
        parentLi.toggleClass('open');
    });

        if ($('.sidebar-overlay').length === 0) {
        $('body').append('<div class="sidebar-overlay"></div>');
    }

    $('#filterSidebarToggle').on('click', function(e) {
        e.preventDefault();
        $('#sidebarMenu').addClass('active');
        $('.sidebar-overlay').addClass('show');
        $('body').addClass('modal-open');
    });

    $('#closeSidebar, .sidebar-overlay').on('click', function() {
        $('#sidebarMenu').removeClass('active');
        $('.sidebar-overlay').removeClass('show');
        $('body').removeClass('modal-open');
    });