let currentProductData = {};

function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var displayElement = document.querySelector("#displayYear");
    if (displayElement) {
        displayElement.innerHTML = currentYear;
    }
}

function myMap() {
    var mapElement = document.getElementById("googleMap");
    if (mapElement) {
        var mapProp = {
            center: new google.maps.LatLng(40.712775, -74.005973),
            zoom: 18,
        };
        var map = new google.maps.Map(mapElement, mapProp);
    }
}


function renderCartPage() {
    const cart = getCart();
    const tableBody = $('#cart-table-body');
    const templateRow = tableBody.find('.cart-item-template');
    const summary = $('#cart-summary');
    const emptyCartMsg = $('#empty-cart-message');
    const cartTable = $('.cart-table');
    const cartActions = $('.cart-page-actions');

    tableBody.find('.dynamic-item').remove();

    let subtotal = 0;

    if (cart.length === 0) {
        emptyCartMsg.show();
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
        const newRow = templateRow.clone();
        const itemTotal = product.price * product.quantity;

        newRow.removeClass('cart-item-template');
        newRow.addClass('dynamic-item');
        newRow.attr('data-id', product.id);

        newRow.find('img').attr('src', product.image).attr('alt', product.name);
        newRow.find('.product-name').text(product.name);
        newRow.find('.product-price').text(`${product.price.toFixed(2)} جنيه`);
        newRow.find('.quantity-input').val(product.quantity);
        newRow.find('.product-total').text(`${itemTotal.toFixed(2)} جنيه`);

        newRow.show();
        tableBody.append(newRow);
        subtotal += itemTotal;
    });

    summary.find('.subtotal-value').text(`${subtotal.toFixed(2)} جنيه`);
    summary.find('.total-value').text(`${subtotal.toFixed(2)} جنيه`);
}

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

$(window).on('load', function () {
    if ($(".grid").length > 0) {
        var $grid = $(".grid").isotope({
            itemSelector: ".all",
            layoutMode: "fitRows"
        });

        $('.filters_menu li').click(function () {
            $('.filters_menu li').removeClass('active');
            $(this).addClass('active');
            var data = $(this).attr('data-filter');
            $grid.isotope({
                filter: data
            });
        });
    }
});


$(document).ready(function () {

    var currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "") currentPage = "index.html";
    $('#header a[href="' + currentPage + '"]').addClass('active');
    updateCartCount();
    getYear();

    $(document).on('click', '#langBtn', function(e) {
        e.preventDefault();
        e.stopPropagation(); // يمنع وصول الضغطة للـ document فوراً
        
        $('#langPopup').toggleClass('show'); // تبديل كلاس show (فتح/غلق)
        $('.lang_box').toggleClass('active'); // لتلوين الأيقونة
    });

    // عند الضغط في أي مكان آخر في الصفحة (لإغلاق القائمة)
    $(document).on('click', function(e) {
        // لو الضغطة مش جوه الـ lang_box ولا جوه الـ Popup نفسه
        if (!$(e.target).closest('.lang_box').length) {
            $('#langPopup').removeClass('show');
            $('.lang_box').removeClass('active');
        }
    });

    $(document).on('click', '#dashboardBtn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // إغلاق أي بوب أب آخر مفتوح (مثل اللغة)
        $('#langPopup').removeClass('show'); 
        
        $('#dashboardPopup').toggleClass('show');
        $('.dashboard_box').toggleClass('active');
    });

    // إغلاق عند الضغط خارج القائمة
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dashboard_box').length) {
            $('#dashboardPopup').removeClass('show');
            $('.dashboard_box').removeClass('active');
        }
    });



    if ($("#cart-table-body").length > 0) {
        renderCartPage();

        $('#cart-table-body').on('click', '.remove-btn', function () {
            const cartItem = $(this).closest('tr');
            const productId = cartItem.data('id');
            let cart = getCart();
            cart = cart.filter(p => p.id != productId);
            saveCart(cart);
            renderCartPage();
            updateCartCount();
        });

        $('#cart-table-body').on('change', '.quantity-input', function () {
            const cartItem = $(this).closest('tr');
            const productId = cartItem.data('id');
            const newQuantity = parseInt($(this).val());
            let cart = getCart();

            if (newQuantity <= 0) {
                cart = cart.filter(p => p.id != productId);
            } else {
                const product = cart.find(p => p.id == productId);
                if (product) {
                    product.quantity = newQuantity;
                }
            }

            saveCart(cart);
            renderCartPage();
            updateCartCount();
        });
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

    const rating = 2.4;
    let fullStars = Math.floor(rating);
    $("#ratingStars span").each(function () {
        if ($(this).data("value") <= fullStars) {
            $(this).addClass("filled");
        }
    });

    // ==========================================
    //  Profile Page Logic
    // ==========================================

    // 1. زر حفظ البيانات
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();
        // هنا كود الـ API لحفظ البيانات
        alert('تم حفظ التغييرات بنجاح!');
    });

    // 2. زر تغيير كلمة المرور
    $('#passwordForm').on('submit', function(e) {
        e.preventDefault();
        alert('تم تحديث كلمة المرور بنجاح!');
        // تفريغ الحقول
        $(this).find('input').val('');
    });

    // 3. زر حذف الحساب (تأكيد)
    $('#deleteAccountBtn').on('click', function() {
        if(confirm('هل أنت متأكد تماماً أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            // هنا كود الـ API للحذف
            alert('تم حذف الحساب.');
            
            // مسح البيانات وتسجيل الخروج
            localStorage.removeItem('cart');
            // localStorage.removeItem('user_token'); 
            
            window.location.href = "index.html";
        }
    });

    // 4. زر تسجيل الخروج (من السايد بار أو الهيدر)
    $(document).on('click', '#logoutBtnSidebar, .logout', function(e) {
        e.preventDefault();
        
        // مسح بيانات الجلسة (اختياري حسب نظامك)
        // localStorage.removeItem('user_token');
        
        // توجيه لصفحة تسجيل الدخول
        window.location.href = "login.html";
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

    $(document).on('click', '.product-card .image-wrapper, .product-card .add-to-cart-btn', function (e) {
        e.preventDefault();

        const card = $(this).closest('.product-card, .product-card-modern');
        const btnData = card.find('.add-to-cart-btn');

        const baseId = btnData.data('id');
        const baseName = btnData.data('name');
        const basePrice = parseFloat(btnData.data('price'));
        const imageSrc = btnData.data('image');
        const category = btnData.data('category') || 'عام';
        const brand = btnData.data('brand') || 'غير محدد';
        const description = btnData.data('description') || 'تفاصيل المنتج غير متوفرة حالياً.';
        
        let variants = btnData.data('variants');
        if (typeof variants === 'string') {
            try {
                variants = JSON.parse(variants); 
            } catch(e) {
                variants = null; 
            }
        }

        currentProductData = {
            id: baseId,
            name: baseName,
            price: basePrice,
            image: imageSrc,
            quantity: 1,
            notes: '',
            hasVariants: false
        };

        $('#modal-product-image').attr('src', imageSrc);
        $('#modal-product-name').text(baseName);
        $('#modal-product-category').text(category);
        $('#modal-product-brand').text(brand);
        $('#modal-product-description').text(description);
        $('#modal-quantity-input').val(1);
        $('#modal-product-notes').val('');
        if(card.find('.rating').length > 0 || card.find('.rating-stars').length > 0){
             $('#modal-product-rating').html(card.find('.rating, .rating-stars').html());
        }

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
                         
                         <div class="custom-radio-ui"></div>
                         
                         <div class="variant-info">
                            <span class="v-name">${variant.name}</span>
                         </div>
                         
                         <div class="v-price">${variant.price} جنيه</div>
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
            let oldPrice = card.find('.original-price, .old-price').text().replace('جنيه', '').trim();
            updateModalPrice(basePrice, oldPrice);
        }

        $('#product-modal-overlay').addClass('show');
        $('body').addClass('modal-open');
    });

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

    $('.qty-btn').on('click', function() {
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
    $('.btn-direct-add').on('click', function () {
        
        const activeVariant = $('.variant-pill.active');
        const variantPrice = activeVariant.length ? parseFloat(activeVariant.data('price')) : 0;
        const variantName = activeVariant.length ? activeVariant.find('span').text().trim() : '';
        const baseId = $(this).data('id');
        const baseName = $(this).data('name');
        const imageSrc = $('#mainProductImg').attr('src');
        const qty = parseInt($('#product-qty').val()) || 1;
        const finalId = baseId + '-' + variantName.replace(/\s/g, ''); 
        const finalName = baseName + ' (' + variantName + ')';
        const productToAdd = {
            id: finalId,
            name: finalName,
            price: variantPrice,
            image: imageSrc,
            quantity: qty
        };
        let cart = getCart();
        const existingProduct = cart.find(p => p.id == productToAdd.id);

        if (existingProduct) {
            existingProduct.quantity += qty;
        } else {
            cart.push(productToAdd);
        }
        saveCart(cart);
        updateCartCount();
        showCartPopup(); 
        renderCartPopup();
    });

    $('.modal-close-btn, #product-modal-overlay').on('click', function (e) {
        if (e.target === this) {
            closeProductModal();
        }
    });

    //profile page js
    $('.toggle-pass').on('click', function() {
            let input = $(this).siblings('input');
            let icon = $(this).find('i');
            
            if (input.attr('type') === "password") {
                input.attr('type', 'text');
                icon.removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                input.attr('type', 'password');
                icon.removeClass('fa-eye-slash').addClass('fa-eye');
            }
        });
        $("#uploadProfile").change(function() {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function(e) {
                    // تغيير مصدر الصورة بالبيانات الجديدة
                    $('#profileImage').attr('src', e.target.result);
                }
                
                // قراءة الملف كـ رابط بيانات
                reader.readAsDataURL(this.files[0]);
            }
        });

    // if ($('select').length > 0) {
    //     $('select').niceSelect();
    // }

    if ($('.client_owl-carousel').length > 0) {
        $(".client_owl-carousel").owlCarousel({
            loop: true,
            margin: 0,
            dots: true,
            nav: false, 
            autoplay: true,
            autoplayHoverPause: true,
            rtl: true,
            responsive: {
                0: { items: 1 },
                768: { items: 2 }, 
                1000: { items: 3 } 
            }
        });
    }

    if ($('.category-slider').length > 0) {
        $(".category-slider").owlCarousel({
            loop: true,
            margin: 20,
            nav: true, 
            dots: false, 
            autoplay: false, 
            rtl: true,
            navText: ['<i class="fa fa-angle-right"></i>', '<i class="fa fa-angle-left"></i>'],
            autoWidth: true, 
            responsive: {
                0: { items: 2 },
                600: { items: 3 },
                1000: { items: 6 }
            }
        });
    }
    
    if ($(".thumbnails-list").length > 0) {
        $(".thumbnails-list").owlCarousel({
            loop: false,
            margin: 10,
            nav: true,
            dots: false,
            rtl: true,
            responsive: {
                0: { items: 3 },
                600: { items: 4 },
                1000: { items: 4 }
            }
        });
    }
});
