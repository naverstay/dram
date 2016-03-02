var about_tabs, spectacleSlider, presentSlider, presentSliderText;

$(function($){

});

$(window).on('load', function(){

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
  
  spectacleSlider = new Swiper('.spectacleSlider', {
    loop               : false,
    setWrapperSize     : true,
    slidesPerView      : 2,
    paginationClickable: true,
    spaceBetween       : 20,
    breakpoints        : {
      480: {
        slidesPerView: 1,
        spaceBetween : 10
      },
      960: {
        slidesPerView: 2,
        spaceBetween : 10
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
              $(e.target).find('.swiper-container').each(function(ind){
                this.swiper.update();
              });
            }
          });
        }
      });

}).on('resize', function(){

});