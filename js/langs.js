function setupLanguageSwitcher() {


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

$(document).ready(function() {
    setupLanguageSwitcher(); 
});