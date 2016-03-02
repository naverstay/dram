var about_tabs, presentSlider, presentSliderText;

$(function($){

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

});

$(window).on('load', function(){

}).on('resize', function(){

});