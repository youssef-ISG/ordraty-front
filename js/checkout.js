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