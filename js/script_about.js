var about_tabs, presentSlider, presentSliderText, filterSlider, isotop;

$(function($){

  isotop = $('#grid');

  isotop.imagesLoaded(function(){

    isotop.one('arrangeComplete', function(){
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

    $('.filterBtn').on('click', function(){
      var firedEl = $(this).parent();

      if(!firedEl.hasClass('active')){
        //isotop.removeClass('loaded');

        isotop.isotope({filter: $(this).attr('data-filter')});

        firedEl.addClass('active').siblings().removeClass('active');

        //isotop.addClass('loaded');

      }

      return false;
    });

  });

});

$(window).on('load', function(){

  filterSlider = new Swiper('.filterSlider', {
    loop          : false,
    setWrapperSize: true,
    slidesPerView : 'auto',
    freeMode      : true,
    spaceBetween  : 0
  });

  presentSlider = new Swiper('.presentSlider', {
    loop          : false,
    setWrapperSize: true,
    slidesPerView : 1,
    onlyExternal  : true,
    prevButton    : '#about_present_prev',
    nextButton    : '#about_present_next',
    spaceBetween  : 0
  });

  presentSliderText = new Swiper('.presentSliderText', {
    loop          : false,
    setWrapperSize: true,
    slidesPerView : 1,
    onlyExternal  : true,
    prevButton    : '#about_present_prev',
    nextButton    : '#about_present_next',
    spaceBetween  : 0
  });

  $('.aboutPresentW').swipe({
    excludedElements: "button, input, select, textarea, a:not(.fancybox-nav), .noSwipe",
    threshold       : 20,
    allowPageScroll : "vertical",
    tap             : function(e, w){
      var firedEl = $(w);

      if(firedEl.hasClass('swiper_btn')) firedEl.click();

    },
    swipe           : function(event, direction){
      if(direction === 'left' || direction === 'up'){
        presentSlider.slideNext();
        presentSliderText.slideNext();
      } else{
        presentSlider.slidePrev();
        presentSliderText.slidePrev();
      }
    }
  });

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
            activate  : function(e, u){
              isotop.isotope('arrange');
              $(e.target).find('.gridList').addClass('loaded');
              $(e.target).find('.swiper-container').each(function(ind){
                this.swiper.update();
              });
            }
          });
        }
      });

}).on('resize', function(){

  isotop.isotope('arrange');

});