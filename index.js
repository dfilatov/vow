$(document).on('click', '.details__opener', function(e) {
    e.stopImmediatePropagation();
    $(this)
        .closest('.details')
        .toggleClass('details_shown')
        .find('.details__content:first')
            .slideToggle();
});