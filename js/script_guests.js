var filterSlider, dlg;

$(function($){

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

  dlg = new dialog('#comment_form', 'dialog_global dialog_g_size_2 dialog_close_butt_mod_1', '.popupBtn', false, 810, true);

  all_dialog_close();
  
});

$(window).on('load', function(){

}).on('resize', function(){

});
