$(document).ready(function () {

    let currentProductData = {};

    updateCartCount();

    // =========================================================
    // PRODUCT MODAL LOGIC
    // =========================================================

    // 1. Open Modal & Initialize Data
    $(document).on('click', '.product-card .image-wrapper, .product-card .add-to-cart-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($(this).closest('.product-card').hasClass('out-of-stock')) return;

        const btnData = $(this).closest('.product-card').find('.add-to-cart-btn');

        const baseId = btnData.data('id');
        const baseName = btnData.data('name');
        const basePrice = parseFloat(btnData.data('price'));
        const category = btnData.data('category');
        const brand = btnData.data('brand');
        const baseDesc = btnData.data('description') || 'لا يوجد وصف متاح.';
        const baseUnit = btnData.data('unit') || ''; 
        
        let defaultGallery = [];
        const galleryAttr = btnData.data('gallery');
        if (galleryAttr) {
            defaultGallery = galleryAttr.split(',');
        } else {
            defaultGallery = [btnData.data('image')]; 
        }

        let variants = null;
        try {
            variants = btnData.data('variants');
            if (typeof variants === 'string') variants = JSON.parse(variants);
        } catch (err) {
            variants = null;
        }

        // Set Initial Static Data
        $('#modal-product-category').text(category);
        $('#modal-product-brand').text(brand);
        $('#modal-quantity-input').val(1);
        $('#modal-product-notes').val('');

        // Set Initial Unit
        if(baseUnit) {
            $('#modal-product-unit').text(baseUnit).show();
        } else {
            $('#modal-product-unit').hide();
        }

        const variantsContainer = $('#modal-variants-container');
        const variantsSection = $('#modal-variants-section');
        variantsContainer.empty();

        if (variants && variants.length > 0) {
            variantsSection.show();
            currentProductData.hasVariants = true;

            variants.forEach((variant, index) => {
                const isSelected = index === 0 ? 'selected' : '';
                
                const vImages = (variant.images && variant.images.length > 0) ? variant.images : defaultGallery;
                const vDesc = variant.description || baseDesc;
                const vTitle = variant.full_title || baseName + ' ' + variant.name;
                const vUnit = variant.unit || baseUnit; // Get Variant Unit

                const variantHtml = `
                    <div class="variant-option-card ${isSelected}" 
                         data-v-id="${variant.id}" 
                         data-v-name="${vTitle}" 
                         data-v-price="${variant.price}"
                         data-v-old-price="${variant.old_price || ''}"
                         data-v-desc="${vDesc}"
                         data-v-unit="${vUnit}"
                         data-v-gallery='${JSON.stringify(vImages)}'>
                         
                         <div class="variant-radio"></div>
                         <div class="variant-info">
                            <span class="variant-name">${variant.name}</span>
                         </div>
                         <div class="variant-price-tag">${variant.price} ج.م</div>
                    </div>
                `;
                variantsContainer.append(variantHtml);

                if (index === 0) {
                    updateModalFullContent(vTitle, variant.price, variant.old_price, vDesc, vImages, vUnit);
                    currentProductData = {
                        id: variant.id,
                        name: vTitle,
                        price: variant.price,
                        image: vImages[0],
                        quantity: 1,
                        hasVariants: true
                    };
                }
            });

        } else {
            variantsSection.hide();
            let oldPriceText = $(this).closest('.product-card').find('.original-price').text().replace(/[^0-9.]/g, '');
            
            updateModalFullContent(baseName, basePrice, oldPriceText, baseDesc, defaultGallery, baseUnit);
            
            currentProductData = {
                id: baseId,
                name: baseName,
                price: basePrice,
                image: defaultGallery[0],
                quantity: 1,
                hasVariants: false
            };
        }

        $('#product-modal-overlay').addClass('show');
        $('body').addClass('modal-open');
    });

    // 2. Select Variant
    $(document).on('click', '.variant-option-card', function () {
        $('.variant-option-card').removeClass('selected');
        $(this).addClass('selected');

        const newId = $(this).data('v-id');
        const newName = $(this).data('v-name');
        const newPrice = parseFloat($(this).data('v-price'));
        const oldPrice = $(this).data('v-old-price');
        const newDesc = $(this).data('v-desc');
        const newUnit = $(this).data('v-unit'); // Get Unit from Variant
        
        let newGallery = $(this).data('v-gallery');
        if (typeof newGallery === 'string') {
             try { newGallery = JSON.parse(newGallery); } catch(e) { newGallery = [newGallery]; }
        }

        updateModalFullContent(newName, newPrice, oldPrice, newDesc, newGallery, newUnit);

        currentProductData.id = newId;
        currentProductData.name = newName;
        currentProductData.price = newPrice;
        currentProductData.image = newGallery[0];
    });

    // Helper: Update Modal Content
    function updateModalFullContent(name, price, oldPrice, desc, imagesArray, unit) {
        $('#modal-product-name').text(name);
        $('#modal-product-description').text(desc);
        $('#modal-product-final-price').text(parseFloat(price).toFixed(2) + ' جنيه');

        if (oldPrice && parseFloat(oldPrice) > parseFloat(price)) {
            $('#modal-product-original-price').text(parseFloat(oldPrice).toFixed(2) + ' جنيه').show();
        } else {
            $('#modal-product-original-price').hide();
        }

        // Update Unit Badge
        if(unit) {
            $('#modal-product-unit').text(unit).show();
        } else {
            $('#modal-product-unit').hide();
        }

        const mainImg = $('#modal-product-image');
        const firstImage = (imagesArray && imagesArray.length > 0) ? imagesArray[0] : mainImg.attr('src');
        
        if (mainImg.attr('src') !== firstImage) {
            mainImg.fadeOut(150, function () {
                $(this).attr('src', firstImage).fadeIn(150);
            });
        }

        const galleryContainer = $('#modal-product-gallery');
        galleryContainer.empty();

        if (imagesArray && imagesArray.length > 0) {
            imagesArray.forEach((imgSrc, index) => {
                const activeClass = index === 0 ? 'active' : '';
                galleryContainer.append(`
                    <div class="thumb-item ${activeClass}" data-src="${imgSrc}">
                        <img src="${imgSrc}" alt="thumb">
                    </div>
                `);
            });
        }
    }

    // 3. Gallery Thumbnail Click
    $(document).on('click', '.thumb-item', function () {
        const src = $(this).data('src');
        $('#modal-product-image').attr('src', src);
        $('.thumb-item').removeClass('active');
        $(this).addClass('active');
    });

    // 4. Quantity Logic
    $('.qty-btn').on('click', function () {
        const input = $('#modal-quantity-input');
        let val = parseInt(input.val());
        
        if ($(this).hasClass('plus')) {
            val++;
        } else {
            if (val > 1) val--;
        }
        
        input.val(val);
        currentProductData.quantity = val;
    });

    // 5. Add To Cart From Modal
    $('#modal-add-to-cart-btn').on('click', function () {
        let cart = getCart();
        const qty = parseInt($('#modal-quantity-input').val());
        const notes = $('#modal-product-notes').val().trim();

        const productToAdd = {
            id: currentProductData.id,
            name: currentProductData.name,
            price: currentProductData.price,
            image: currentProductData.image,
            quantity: qty,
            notes: notes
        };

        const existingIndex = cart.findIndex(p => p.id == productToAdd.id);
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += qty;
            if (notes) {
                cart[existingIndex].notes = (cart[existingIndex].notes ? cart[existingIndex].notes + " | " : "") + notes;
            }
        } else {
            cart.push(productToAdd);
        }

        saveCart(cart);
        updateCartCount();
        
        if (typeof renderCartPopup === "function") renderCartPopup();
        
        $('#product-modal-overlay').removeClass('show');
        $('body').removeClass('modal-open');
        $('#cart-popup').fadeIn();
    });

    // Close Modal
    $('.modal-close-btn, #product-modal-overlay').on('click', function (e) {
        if (e.target === this || $(this).hasClass('modal-close-btn')) {
            $('#product-modal-overlay').removeClass('show');
            $('body').removeClass('modal-open');
        }
    });

    // =========================================================
    // CART HELPER FUNCTIONS
    // =========================================================

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        $('#cart-count').text(count);
    }
});