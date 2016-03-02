var filterSlider;

$(function ($) {

    $('.calendarBtn').on('click', function () {
        var firedEl = $(this).parent();

        if (firedEl.hasClass('active')) {
            firedEl.removeClass('active').find('.aside_sub_menu').slideUp();
        } else {
            firedEl.siblings().removeClass('active').find('.aside_sub_menu').slideUp();
            firedEl.addClass('active').find('.aside_sub_menu').slideDown();
        }

        return false;
    });

    $('.filterBtn').on('click', function () {
        var firedEl = $(this).parent(), filter = $(this).attr('data-filter');

        if (!firedEl.hasClass('active')) {

            var blogList = firedEl.closest('.filterParent').find('.blogList');

            if (filter == '*') {
                blogList.find('> *').show();
            } else {
                blogList.find('> *').hide();
                blogList.find('> ' + filter).show();
            }

            firedEl.addClass('active').siblings().removeClass('active');

        }

        return false;
    });

    abc_scroller();

    update_abc_scroller();

});

function set_active_abc(abc_link) {
    abc_link.parent().addClass('active').siblings().removeClass('active');
}

function abc_scroller() {

    body_var.delegate('.scrollTo', 'click', function () {

        var firedEl = $(this);

        doc_scroll($(firedEl.attr('href')), 500, function () {
            set_active_abc(firedEl);
        });

        return false;

    });


}

function update_abc_scroller() {

    $('.blogList').each(function (ind) {

        var blogList = $(this), curUnit,
            abcScroller = blogList.closest('.filterParent').find('.abcScroller');

        blogList.find('.blog_unit').each(function (ind) {
            var unit = $(this);

            if (curUnit == void 0 && unit.offset().top + 100 >= body_var.scrollTop()) {
                curUnit = unit;
            }

        });

        if (curUnit.length) {
            var activeLink = abcScroller.find('.scrollTo[href=#' + curUnit.attr('id') + ']');

            set_active_abc(activeLink);
        }
        
    });

}

function doc_scroll(item, time, callback) {

    if (item.length) {
        $('html, body').animate({'scrollTop': item.offset().top - 100}, time, function () {
            console.log(item);
            if (typeof callback == 'function') callback();
        });
    }

}


$(window).on('load', function () {

    filterSlider = new Swiper('.filterSlider', {
        loop: false,
        setWrapperSize: true,
        slidesPerView: 'auto',
        freeMode: true,
        spaceBetween: 0
    });

    var tabBlock = $('.tabBlock'),
        tabsSwiper = new Swiper('.filterListScroller', {
            setWrapperSize: true,
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 0,
            freeMode: true,
            wrapperClass: 'filter_list',
            slideClass: 'filter_item',
            onInit: function (swiper) {
                about_tabs = tabBlock.tabs({
                    active: 0,
                    tabContext: tabBlock.data('tab-context'),
                    activate: function (e, u) {
                        update_abc_scroller();
                        $(e.target).find('.swiper-container').each(function (ind) {
                            this.swiper.update();
                        });
                    }
                });
            }
        });

}).on('scroll', function (e) {

    update_abc_scroller();

});