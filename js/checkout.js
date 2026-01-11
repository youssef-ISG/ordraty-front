function renderCheckoutPage() {
    const cart = getCart();
    const itemsListContainer = $('#checkout-items-list');

    if (cart.length === 0) {
        if(itemsListContainer.length > 0) itemsListContainer.html('<p>لا يوجد منتجات.</p>');
        return;
    }

    itemsListContainer.html('');

    let subtotal = 0;
    const deliveryFee = 15.00;

    cart.forEach(product => {
        const itemTotal = product.price * product.quantity;
        subtotal += itemTotal;

        const itemHtml = `
        <div class="summary-item">
            <span>(${product.quantity}x) ${product.name}</span>
            <span>${itemTotal.toFixed(2)} جنيه</span>
        </div>
        `;
        itemsListContainer.append(itemHtml);
    });

    const total = subtotal + deliveryFee;

    $('#checkout-subtotal').text(`${subtotal.toFixed(2)} جنيه`);
    $('#checkout-delivery').text(`${deliveryFee.toFixed(2)} جنيه`);
    $('#checkout-total').text(`${total.toFixed(2)} جنيه`);
}

    if ($(".checkout-container").length > 0) {
        renderCheckoutPage();

        $("#checkout-form").on("submit", function (e) {
            e.preventDefault();

            const customerDetails = {
                name: $("#checkout-name").val(),
                phone: $("#checkout-phone").val(),
                address: $("#checkout-address").val(),
                notes: $("#checkout-notes").val(),
                paymentMethod: $("input[name='paymentMethod']:checked").val()
            };

            const cart = getCart();
            const total = $("#checkout-total").text();

            saveCart([]);
            updateCartCount();
            window.location.href = "index.html";
        });

        
    }

    $(document).ready(function() {
    // 1. التحكم في إظهار خيارات الدفع أونلاين
    $('input[name="paymentMethod"]').on('change', function() {
        const $onlineOptions = $('#online-options');
        
        if ($(this).val() === 'card') {
            // إظهار الخيارات الفرعية بحركة انسيابية
            $onlineOptions.slideDown(400);
        } else {
            // إخفاء الخيارات وتفريغ الحقول عند اختيار الدفع عند الاستلام
            $onlineOptions.slideUp(300, function() {
                $('.payment-detail-form').hide();
                $('.sub-option').removeClass('active');
            });
        }
    });

    // 2. التحكم في تبديل (فوري / كارد)
    $('.sub-option').on('click', function() {
        // إضافة الكلاس النشط وتغيير الشكل
        $('.sub-option').removeClass('active');
        $(this).addClass('active');

        // جلب الهدف وإظهار الفورم الخاص به بـ Fade effect
        const target = '#' + $(this).data('target');
        
        $('.payment-detail-form').stop().fadeOut(200, function() {
            $(target).fadeIn(300);
        });
    });

    // 3. إضافة تفاعل (UX) عند كتابة رقم الكارد (تنسيق تلقائي)
    $('.custom-input[placeholder*="****"]').on('input', function() {
        let val = $(this).val().replace(/\D/g, '');
        val = val.replace(/(.{4})/g, '$1 ').trim();
        $(this).val(val.substring(0, 19));
    });
});