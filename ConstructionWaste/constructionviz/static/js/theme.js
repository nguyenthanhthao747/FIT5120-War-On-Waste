/*
 Description: This js file is for suggestion page. Let user to choose the filters.
 */

(function($) {
    //========================
    // filters function
    //========================
    $(window).load(function() {
        if ($(".loaderWrap").length > 0)
        {
            $(".loaderWrap").delay(500).fadeOut("slow");
        }

        if ($("#folioGrid2").length > 0)
        {

            var $grid = $('#folioGrid2');
            $grid.shuffle({
                itemSelector: '.folioItem2' // the selector for the items in the grid
            });

            /* reshuffle when user clicks a filter item */
            $('#filter li').on('click', function() {

                // set active class
                $('#filter li').removeClass('active');
                $(this).addClass('active');

                // get group name from clicked item
                var groupName = $(this).attr('data-group');

                // reshuffle grid
                $grid.shuffle('shuffle', groupName);
            });
        }
        if ($("#folioGrid1").length > 0)
        {
            var $grid = $('#folioGrid1');
            $grid.shuffle({
                itemSelector: '.fol1' // the selector for the items in the grid
            });
        }
    });
})(jQuery);