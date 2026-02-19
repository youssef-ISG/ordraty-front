$(document).ready(function () {
    let currentProductData = {};

    updateCartCount();

    function updateMainBtnState(isOutOfStock) {
        const btn = $('#modal-add-to-cart-btn');
        if (isOutOfStock) {
            btn.prop('disabled', true)
               .addClass('disabled-btn')
               .html('<span>غير متوفر حالياً</span> <i class="fa-solid fa-circle-xmark"></i>');
        } else {
            btn.prop('disabled', false)
               .removeClass('disabled-btn')
               .html('<span>أضف إلى السلة</span> <i class="fa-solid fa-cart-shopping"></i>');
        }
    }

    $(document).on('click', '.product-card .image-wrapper, .product-card .add-to-cart-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

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

        $('#modal-product-category').text(category);
        $('#modal-product-brand').text(brand);
        $('#modal-quantity-input').val(1);
        $('#modal-product-notes').val('');

        const variantsContainer = $('#modal-variants-container');
        const variantsSection = $('#modal-variants-section');
        variantsContainer.empty();

        if (variants && variants.length > 0) {
            const visibleVariants = variants.filter(v => v.is_hidden !== true && v.is_hidden !== 1);

            if (visibleVariants.length > 0) {
                variantsSection.show();
                currentProductData.hasVariants = true;

                visibleVariants.forEach((variant, index) => {
                    const isOutOfStock = variant.stock <= 0;
                    const firstAvailable = visibleVariants.find(v => v.stock > 0) || visibleVariants[0];
                    const isSelected = variant.id === firstAvailable.id ? 'selected' : '';
                    const stockClass = isOutOfStock ? 'out-of-stock-variant' : '';
                    
                    const vImages = (variant.images && variant.images.length > 0) ? variant.images : defaultGallery;
                    const vDesc = variant.description || baseDesc;
                    const vTitle = variant.full_title || baseName + ' ' + variant.name;
                    const vUnit = variant.unit || baseUnit;

                    const variantHtml = `
                        <div class="variant-option-card ${isSelected} ${stockClass}" 
                             data-v-id="${variant.id}" 
                             data-v-name="${vTitle}" 
                             data-v-price="${variant.price}"
                             data-v-old-price="${variant.old_price || ''}"
                             data-v-desc="${vDesc}"
                             data-v-unit="${vUnit}"
                             data-v-stock="${variant.stock}"
                             data-v-gallery='${JSON.stringify(vImages)}'>
                             <div class="variant-radio"></div>
                             <div class="variant-info">
                                <span class="variant-name">${variant.name} ${isOutOfStock ? '(نفد)' : ''}</span>
                             </div>
                             <div class="variant-price-tag">${variant.price} ج.م</div>
                        </div>
                    `;
                    variantsContainer.append(variantHtml);

                    if (variant.id === firstAvailable.id) {
                        updateModalFullContent(vTitle, variant.price, variant.old_price, vDesc, vImages, vUnit);
                        updateMainBtnState(isOutOfStock);
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
            }
        } else {
            variantsSection.hide();
            let oldPriceText = $(this).closest('.product-card').find('.original-price').text().replace(/[^0-9.]/g, '');
            const isOutOfStock = btnData.data('stock') <= 0;
            
            updateModalFullContent(baseName, basePrice, oldPriceText, baseDesc, defaultGallery, baseUnit);
            updateMainBtnState(isOutOfStock);
            
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

    $(document).on('click', '.variant-option-card', function () {
        $('.variant-option-card').removeClass('selected');
        $(this).addClass('selected');

        const isOut = parseInt($(this).data('v-stock')) <= 0;
        updateMainBtnState(isOut);

        const newId = $(this).data('v-id');
        const newName = $(this).data('v-name');
        const newPrice = parseFloat($(this).data('v-price'));
        const oldPrice = $(this).data('v-old-price');
        const newDesc = $(this).data('v-desc');
        const newUnit = $(this).data('v-unit');
        
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

    function updateModalFullContent(name, price, oldPrice, desc, imagesArray, unit) {
        $('#modal-product-name').text(name);
        $('#modal-product-description').text(desc);
        $('#modal-product-final-price').text(parseFloat(price).toFixed(2) + ' جنيه');

        if (oldPrice && parseFloat(oldPrice) > parseFloat(price)) {
            $('#modal-product-original-price').text(parseFloat(oldPrice).toFixed(2) + ' جنيه').show();
        } else {
            $('#modal-product-original-price').hide();
        }

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

    $(document).on('click', '.thumb-item', function () {
        const src = $(this).data('src');
        $('#modal-product-image').attr('src', src);
        $('.thumb-item').removeClass('active');
        $(this).addClass('active');
    });

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

    $('.modal-close-btn, #product-modal-overlay').on('click', function (e) {
        if (e.target === this || $(this).hasClass('modal-close-btn')) {
            $('#product-modal-overlay').removeClass('show');
            $('body').removeClass('modal-open');
        }
    });

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