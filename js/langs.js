// ===============================================
//        I N T E R N A T I O N A L I Z A T I O N 
// ===============================================

let translations = {};
let currentLang = 'en';

/**
 * @param {string} langCode -
 * @param {string} pageName - 
 */
function loadLanguage(langCode, pageName) {
    currentLang = langCode;
    const commonPath = `/locals/${langCode}/common.${langCode}.json`;
    const pagePath = `/locals/${langCode}/${pageName}.${langCode}.json`;
    return $.when(
        $.getJSON(commonPath),
        $.getJSON(pagePath)
    )
    .done(function(commonData, pageData) {
        const commonTranslations = commonData[0];
        const pageTranslations = pageData[0];
        
        translations = $.extend({}, commonTranslations, pageTranslations);
        
        console.log(`✅ Languages loaded for: ${pageName}`);
    })
    .fail(function(jqxhr, textStatus, error) {
        console.error(`❌ Error loading language files: ${textStatus}, ${error}`);
    });
}

function translate(key) {
    return translations[key] || key;
}

function applyTranslations() {
    $('[data-i18n]').each(function() {
        const key = $(this).attr('data-i18n');
        $(this).text(translate(key));
    });
    $('[data-i18n-ph]').each(function() {
        const placeholderKey = $(this).attr('data-i18n-ph');
        if (placeholderKey) {
            $(this).attr('placeholder', translate(placeholderKey));
        }
    });

    $('meta[name="description"]').attr('content', translate('head.description'));
    $('meta[name="keywords"]').attr('content', translate('head.keywords'));
    if (currentLang === 'ar') {
        $('body').attr('dir', 'rtl').addClass('rtl-mode');
        $('html').attr('lang', 'ar'); 
    } else {
        $('body').attr('dir', 'ltr').removeClass('rtl-mode');
        $('html').attr('lang', 'en'); 
    }
}

function updateSwitcherText(lang) {
    $('.lang_item').removeClass('active');
    $(`.lang_item[data-lang="${lang}"]`).addClass('active');

    const activeText = (lang === 'ar') ? 'العربية' : 'English';
    const $langBtn = $('#langBtn');
    
    if ($langBtn.find('span').length === 0) {
        $langBtn.append('<span class="ms-1"></span>');
    }
    $langBtn.find('span').text(activeText);
}

function setupLanguageSwitcher() {
    const page = determinePageName();

    $('.lang_item').on('click', function(e) {
        e.preventDefault();
        const targetLang = $(this).attr('data-lang');

        if (!targetLang || targetLang === currentLang) return;

        localStorage.setItem('appLang', targetLang);

        loadLanguage(targetLang, page)
            .then(function() {
                applyTranslations();
                updateSwitcherText(targetLang);
                $('#langPopup').hide();
            });
    });

    $('#langBtn').on('click', function(e) {
        e.preventDefault();
        $('#langPopup').fadeToggle(200);
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.lang_box').length) {
            $('#langPopup').fadeOut(200);
        }
    });
}

function determinePageName() {
    const bodyId = document.body.id;

    if (bodyId && bodyId.includes('-page')) {
        return bodyId.replace('-page', '');
    }

    return 'index'; 
}

// ===============================================
//           I N I T I A L I Z A T I O N
// ===============================================

$(document).ready(function() {
    const preferredLang = localStorage.getItem('appLang') || 'en';
    const page = determinePageName(); 

    loadLanguage(preferredLang, page)
        .then(function() {
            applyTranslations(); 
            updateSwitcherText(preferredLang); 
            setupLanguageSwitcher(); 
        });
});