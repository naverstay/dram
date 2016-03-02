var filterSlider;

$(function($){

  blogList = $('.blogList');

  $('.calendarBtn').on('click', function(){
    var firedEl = $(this).parent();

    if(firedEl.hasClass('active')){
      firedEl.removeClass('active').find('.aside_sub_menu').slideUp();
    } else{
      firedEl.siblings().removeClass('active').find('.aside_sub_menu').slideUp();
      firedEl.addClass('active').find('.aside_sub_menu').slideDown();
    }

    return false;
  });

  $('.filterBtn').on('click', function(){
    var firedEl = $(this).parent(), filter = $(this).attr('data-filter');

    if(!firedEl.hasClass('active')){

      var blogList = firedEl.closest('.filterParent').find('.blogList');

      if(filter == '*'){
        blogList.find('> *').show();
      } else{
        blogList.find('> *').hide();
        blogList.find('> ' + filter).show();
      }

      firedEl.addClass('active').siblings().removeClass('active');

    }

    return false;
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

}).on('resize', function(){

});