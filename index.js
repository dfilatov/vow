$(document)
    .on('click', '.details__opener', function(e) {
        e.stopImmediatePropagation();
        var details = $(this)
                .closest('.details')
                .toggleClass('details_shown'),
            detailsContent = details.find('.details__content:first');

        details.hasClass('details_shown')?
            detailsContent.slideDown() :
            detailsContent.slideUp();
    })
    .on('click', '.action', function() {
        var expandAll = $(this).hasClass('action_type_expand-all'),
            details = $('.details'),
            detailsContents = $('.details__content');

        details.toggleClass('details_shown', expandAll);
        expandAll? detailsContents.show() : detailsContents.hide();
    });

