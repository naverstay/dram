var about_tabs, spectacleSlider, presentSlider, presentSliderText, sitsRow;

$(function($){

  sitsRow = $('.sitsRow');

  $('.openReviewBtn').on('click', function(){
    var firedEl = $(this).parent();

    if(firedEl.hasClass('active')){
      firedEl.removeClass('active').find('> .review_block').slideUp();
    } else{
      firedEl.siblings().removeClass('active').find('> .review_block').slideUp();
      firedEl.addClass('active').find('> .review_block').slideDown();
    }

    return false;
  });

  isotop = $('#grid');

  isotop.imagesLoaded(function(){

    isotop.one('arrangeComplete', function(){
      if(isotop.is(':visible')) isotop.addClass('loaded');
    });

    isotop.isotope({
      layoutMode        : 'packery',
      transitionDuration: 0,
      packery           : {
        gutter: 0
      },
      itemSelector      : '.box',
      percentPosition   : true
    });

  });

  $('.clickRow').on('click', function(){
    sitsRow.removeClass('active_row');

    $(this).closest('.sitsRow').addClass('active_row');

    return false;
  });

  $('.clickCol').on('click', function(){
    var firedEl = $(this).closest('td');
    sitsRow.find('td').removeClass('active_col');

    firedEl.addClass('active_col');

    sitsRow.find('td:eq(' + firedEl.index() + ')').addClass('active_col');

    return false;
  });

});

$(window).on('load', function(){

  var testLink = $('a[href=' + window.location.hash + ']');

  var tabBlock = $('.tabBlock'),
      tabsSwiper = new Swiper('.filterListScroller', {
        setWrapperSize     : true,
        slidesPerView      : 'auto',
        paginationClickable: true,
        spaceBetween       : 0,
        freeMode           : true,
        wrapperClass       : 'filter_list',
        slideClass         : 'filter_item',
        onInit             : function(swiper){
          about_tabs = tabBlock.tabs({
            active    : 0,
            tabContext: tabBlock.data('tab-context'),
            activate  : function(e, ui){
              if(isotop.is(':visible')){
                isotop.addClass('loaded');
                isotop.isotope('arrange');
              }

              var scr = document.body.scrollTop;
              window.location.hash = ui.newPanel.selector;
              document.body.scrollTop = scr;
            }
          });

          if(testLink.length) tabBlock.tabs({active: testLink.parent().index()});

        }
      });

}).on('resize', function(){

});