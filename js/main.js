// 1. وظائف السلة الأساسية (تعمل في كل الصفحات)
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((t, p) => t + (p.quantity || 0), 0);
    $("#cart-count").text(count);
}

function getYear() {
    var currentYear = new Date().getFullYear();
    $("#displayYear").text(currentYear);
}
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

$(document).ready(function () {
    updateCartCount();
    getYear();

    const pageId = $('body').attr('id'); 
    if (pageId) {
        const pageName = pageId.replace('-page', '') + '.html';
        $('.nav-item').removeClass('active');
        $(`.nav-link[href*="${pageName}"]`).closest('.nav-item').addClass('active');
    }

    $(document).on('click', '#dashboardBtn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        $('#langPopup').removeClass('show'); 
        
        $('#dashboardPopup').toggleClass('show');
        $('.dashboard_box').toggleClass('active');
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dashboard_box').length) {
            $('#dashboardPopup').removeClass('show');
            $('.dashboard_box').removeClass('active');
        }
    });
});