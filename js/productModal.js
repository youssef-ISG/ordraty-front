function closeProductModal() {
    $('#product-modal-overlay').removeClass('show');
    $('body').removeClass('modal-open');
}

function updateModalPrice(price, oldPrice) {
    $('#modal-product-final-price').text(`${parseFloat(price).toFixed(2)} جنيه`);
    $('#modal-btn-price').text(`${parseFloat(price).toFixed(2)} جنيه`);

    if (oldPrice && oldPrice > 0) {
        $('#modal-product-original-price').text(`${parseFloat(oldPrice).toFixed(2)} جنيه`).show();
    } else {
        $('#modal-product-original-price').hide();
    }
}

function changeImage(element) {
    document.getElementById('mainProductImg').src = element.src;
    $('.thumb-item').removeClass('active');
    $(element).parent().addClass('active');
}

function selectVariant(element) {
    $('.variant-pill').removeClass('active');
    $(element).addClass('active');
    
    const price = element.getAttribute('data-price');
    const oldPrice = element.getAttribute('data-old');
    
    document.getElementById('display-price').innerText = price + ' جنيه';
    if(oldPrice) {
        document.getElementById('display-old-price').innerText = oldPrice + ' جنيه';
        document.getElementById('display-old-price').style.display = 'inline-block';
    } else {
        document.getElementById('display-old-price').style.display = 'none';
    }
}

function updateQty(change) {
    const input = document.getElementById('product-qty');
    let val = parseInt(input.value);
    if (change === 1) val++;
    else if (val > 1) val--;
    input.value = val;
}
$(document).ready(function () {
    let currentProductData = {};

    // 1. وظيفة فتح المودال وتعبئة البيانات
    $(document).on('click', '.product-card .image-wrapper, .product-card .add-to-cart-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const card = $(this).closest('.product-card');
        const btnData = card.find('.add-to-cart-btn');

        // سحب البيانات من الـ Card
        const baseId = btnData.data('id');
        const baseName = btnData.data('name');
        const basePrice = parseFloat(btnData.data('price'));
        const imageSrc = btnData.data('image');
        const category = btnData.data('category') || 'عام';
        const brand = btnData.data('brand') || 'غير محدد';
        const description = btnData.data('description') || 'تفاصيل المنتج غير متوفرة حالياً.';
        const galleryData = btnData.data('gallery') || ""; 
        
        // معالجة الفارينتس (JSON)
        let variants = btnData.data('variants');
        if (typeof variants === 'string') {
            try { variants = JSON.parse(variants); } catch(err) { variants = null; }
        }

        // تهيئة بيانات المنتج الحالي
        currentProductData = {
            id: baseId,
            name: baseName,
            price: basePrice,
            image: imageSrc,
            quantity: 1,
            notes: '',
            hasVariants: false
        };

        // ملء العناصر النصية
        $('#modal-product-image').attr('src', imageSrc);
        $('#modal-product-name').text(baseName);
        $('#modal-product-category').text(category);
        $('#modal-product-brand').text(brand);
        $('#modal-product-description').text(description);
        $('#modal-quantity-input').val(1);
        $('#modal-product-notes').val('');

        // نقل التقييم (النجوم)
        if(card.find('.rating').length > 0){
             $('#modal-product-rating').html(card.find('.rating').html());
        }

        // --- بناء معرض الصور (Gallery) ---
        const galleryContainer = $('#modal-product-gallery');
        galleryContainer.empty();
        let allImages = [imageSrc];
        if (galleryData) {
            allImages = allImages.concat(galleryData.split(','));
        }
        allImages.forEach((img, index) => {
            const isActive = index === 0 ? 'active' : '';
            galleryContainer.append(`
                <div class="thumb-item ${isActive}" data-src="${img}">
                    <img src="${img}" alt="thumbnail" />
                </div>
            `);
        });

        // --- بناء الفارينتس ---
        const variantsContainer = $('#modal-variants-container');
        const variantsSection = $('#modal-variants-section');
        variantsContainer.empty(); 

        if (variants && variants.length > 0) {
            currentProductData.hasVariants = true;
            variantsSection.show();

            variants.forEach((variant, index) => {
                const isSelected = index === 0 ? 'selected' : '';
                const variantHtml = `
                    <div class="variant-option-card ${isSelected}" 
                         data-v-id="${variant.id}" 
                         data-v-name="${variant.name}" 
                         data-v-price="${variant.price}"
                         data-v-old-price="${variant.old_price || ''}">
                         <div class="variant-radio"></div>
                         <div class="variant-info">
                            <span class="variant-name">${variant.name}</span>
                         </div>
                         <div class="variant-price-tag">${variant.price} جنيه</div>
                    </div>
                `;
                variantsContainer.append(variantHtml);

                if (index === 0) {
                    updateModalPrice(variant.price, variant.old_price);
                    currentProductData.id = variant.id; 
                    currentProductData.variantName = variant.name; 
                    currentProductData.price = variant.price;
                }
            });
        } else {
            currentProductData.hasVariants = false;
            variantsSection.hide();
            let oldPriceText = card.find('.original-price').text().replace('جنيه', '').trim();
            updateModalPrice(basePrice, oldPriceText);
        }

        // إظهار المودال
        $('#product-modal-overlay').addClass('show');
        $('body').addClass('modal-open');
    });

    $(document).on('click', '.thumb-item', function() {
        const newSrc = $(this).data('src');
        $('#modal-product-image').fadeOut(200, function() {
            $(this).attr('src', newSrc).fadeIn(200);
        });
        $('.thumb-item').removeClass('active');
        $(this).addClass('active');
    });

    // 3. اختيار الفارينت
    $(document).on('click', '.variant-option-card', function() {
        $('.variant-option-card').removeClass('selected');
        $(this).addClass('selected');

        const newId = $(this).data('v-id');
        const newPrice = parseFloat($(this).data('v-price'));
        const oldPrice = $(this).data('v-old-price');
        const variantName = $(this).data('v-name');

        currentProductData.id = newId;
        currentProductData.price = newPrice;
        currentProductData.variantName = variantName;

        updateModalPrice(newPrice, oldPrice);
    });

    // 4. التحكم في الكمية
    $('.qty-btn').on('click', function() {
        const input = $('#modal-quantity-input');
        let val = parseInt(input.val());
        if ($(this).hasClass('plus')) { val++; } 
        else { if (val > 1) val--; }
        input.val(val);
        currentProductData.quantity = val;
    });

    // 5. وظيفة تحديث السعر
    function updateModalPrice(price, oldPrice) {
        $('#modal-product-final-price').text(price + ' جنيه');
        if (oldPrice) {
            $('#modal-product-original-price').text(oldPrice + ' جنيه').show();
        } else {
            $('#modal-product-original-price').hide();
        }
    }

    $('#modal-add-to-cart-btn').on('click', function () {
        let cart = getCart();

        const qty = parseInt($('#modal-quantity-input').val());
        const notes = $('#modal-product-notes').val().trim();
        
        let finalName = currentProductData.name;
        if (currentProductData.hasVariants && currentProductData.variantName) {
            finalName = `${currentProductData.name} (${currentProductData.variantName})`;
        }

        const productToAdd = {
            id: currentProductData.id, 
            name: finalName,
            price: currentProductData.price,
            image: currentProductData.image,
            quantity: qty,
            notes: notes
        };

        const existingProduct = cart.find(p => p.id == productToAdd.id);

        if (existingProduct) {
            existingProduct.quantity += qty;
            if (notes) {
                existingProduct.notes = (existingProduct.notes ? existingProduct.notes + " | " : "") + notes;
            }
        } else {
            cart.push(productToAdd);
        }

        saveCart(cart);
        updateCartCount();
        showCartPopup();
        renderCartPopup();
        closeProductModal();
    });

    $('.modal-close-btn, #product-modal-overlay').on('click', function (e) {
        if (e.target === this) closeProductModal();
    });
});

