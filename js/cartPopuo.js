function renderCartPopup() {
    const cart = getCart();
    const cartContainer = $('#cart-popup .cart-items-container');
    const subtotalEl = $('#cart-popup .subtotal');

    if (!cartContainer.length) return;

    const templateItem = cartContainer.find('.cart-item').first();
    if (!templateItem.length) return;

    templateItem.hide();
    cartContainer.find('.dynamic-item').remove();
    cartContainer.find('.empty-cart-msg').remove();

    let subtotal = 0;

    if (cart.length === 0) {
        cartContainer.append('<p class="empty-cart-msg" style="text-align: center; padding: 20px;">عربتك فارغة.</p>');
        subtotalEl.text('0.00 جنيه');
        return;
    }

    cart.forEach(product => {
        const newItem = templateItem.clone();
        newItem.addClass('dynamic-item');
        newItem.attr('data-id', product.id);
        newItem.find('img').attr('src', product.image).attr('alt', product.name);
        newItem.find('.item-name').text(product.name);
        newItem.find('.item-price').text(`${product.price.toFixed(2)} جنيه`);
        newItem.find('input[type="number"]').val(product.quantity);
        newItem.show();
        cartContainer.append(newItem);
        subtotal += (product.price * product.quantity);
    });

    subtotalEl.text(`${subtotal.toFixed(2)} جنيه`);
}
    if ($("#cartPopup").length > 0) {       
            function closeCartPopup() {
                $('#cart-popup').fadeOut(300);
                $('body').removeClass('modal-open');
            }

            $('.cart_link').click(function (e) {
                e.preventDefault();
                renderCartPopup();
                $('#cart-popup').fadeIn(300);
                $('body').addClass('modal-open');
            });

            $('.cart-close-btn').click(function () { closeCartPopup(); });
            $('.continue-shopping').click(function () { closeCartPopup(); });
            $('#cart-popup').click(function (e) {
                if ($(e.target).is('#cart-popup')) {
                    closeCartPopup();
                }
            });

            $('#cart-popup').on('click', '.remove-btn', function () {
                const cartItem = $(this).closest('.cart-item');
                const productId = cartItem.data('id');
                if (!productId) return;
                let cart = getCart();
                cart = cart.filter(p => p.id != productId);
                saveCart(cart);
                renderCartPopup();
                updateCartCount();
            });

            $('#cart-popup').on('change', 'input[type="number"]', function () {
                const cartItem = $(this).closest('.cart-item');
                const productId = cartItem.data('id');
                const newQuantity = parseInt($(this).val());
                if (!productId) return;
                let cart = getCart();
                const product = cart.find(p => p.id == productId);
                if (product && newQuantity > 0) {
                    product.quantity = newQuantity;
                }
                saveCart(cart);
                renderCartPopup();
                updateCartCount();
            });
        
    }