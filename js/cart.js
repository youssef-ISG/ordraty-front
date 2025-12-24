function renderCartPage() {
    const cart = getCart();
    const tableBody = $('#cart-table-body');
    const summary = $('#cart-summary');
    const emptyCartMsg = $('#empty-cart-message');
    const cartTable = $('.cart-table');
    const cartActions = $('.cart-page-actions');

    tableBody.find('.dynamic-item').remove();

    let subtotal = 0;

    if (cart.length === 0) {
        emptyCartMsg.fadeIn();
        cartTable.hide();
        summary.hide();
        cartActions.hide();
        return;
    }

    emptyCartMsg.hide();
    cartTable.show();
    summary.show();
    cartActions.show();

    cart.forEach(product => {
        const itemTotal = product.price * product.quantity;
        subtotal += itemTotal;

        const rowHtml = `
            <tr class="dynamic-item" data-id="${product.id}">
                <td class="product-details">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info-text">
                        <p class="product-name">${product.name}</p>
                        ${product.notes ? `<small class="item-notes">${product.notes}</small>` : ''}
                    </div>
                </td>
                <td class="product-price">${product.price.toFixed(2)} جنيه</td>
                <td class="product-quantity">
                    <input type="number" value="${product.quantity}" min="1" class="quantity-input" />
                </td>
                <td class="product-total">${itemTotal.toFixed(2)} جنيه</td>
                <td class="product-remove">
                    <button class="remove-btn">إزالة</button>
                </td>
            </tr>
        `;
        tableBody.append(rowHtml);
    });

    $('.subtotal-value').text(`${subtotal.toFixed(2)} جنيه`);
    $('.total-value').text(`${subtotal.toFixed(2)} جنيه`);
}

$(document).ready(function() {
    if ($("#cart-table-body").length > 0) {
        renderCartPage();

        $('#cart-table-body').on('click', '.remove-btn', function () {
            const productId = $(this).closest('tr').data('id');
            let cart = getCart();
            cart = cart.filter(p => p.id != productId);
            saveCart(cart);
            renderCartPage();
            updateCartCount();
        });

        $('#cart-table-body').on('change', '.quantity-input', function () {
            const productId = $(this).closest('tr').data('id');
            let newQuantity = parseInt($(this).val());
            let cart = getCart();

            if (newQuantity <= 0 || isNaN(newQuantity)) newQuantity = 1;

            const product = cart.find(p => p.id == productId);
            if (product) {
                product.quantity = newQuantity;
            }

            saveCart(cart);
            renderCartPage();
            updateCartCount();
        });
    }
});