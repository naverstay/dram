var body_var,
    global_window_Height,
    scrollTimer,
    first_section,
    nav_container,
    doc;

$(function($){

  body_var = $('body');
  global_window_Height = $(window).height();
  first_section = $('.slogan');
  doc = $(document);
  nav_container = $(".header");

  if($('.chosen-select').length){
    $('.chosen-select').chosen({width: "100%", className: "form_o_b_item form_o_b_value_edit_mode"});
  }

  $('.openMobMenu').on('click', function(){
    var firedEl = $(this);

    if(body_var.hasClass('dialog_open')){
      $('.ui-dialog-titlebar-close').click();
    } else{
      body_var.toggleClass('open_menu');
    }

    return false;
  });

  scroll_f();

  //all_dialog_close();

});

$(window).on('load', function(e){

  //initTabScroller();

}).on('scroll', function(){
  scroll_f();
});

function scroll_f(){

  clearTimeout(scrollTimer);

  if(doc != void 0){
    scrollTimer = setTimeout(function(){
      if(doc.scrollTop() > 25){
        nav_container.stop().addClass("sticky");
      } else{
        nav_container.stop().removeClass("sticky");
      }

      if(doc.scrollTop() > 60){
        nav_container.stop().addClass("sticky_border");
      } else{
        nav_container.stop().removeClass("sticky_border");
      }
    }, 10);
  }

}

function initTabScroller(){

  var tabBlock = $('.tabBlock'), tabs,
      tabsSwiper = new Swiper('.filterListScroller', {
        setWrapperSize     : true,
        slidesPerView      : 'auto',
        paginationClickable: true,
        spaceBetween       : 0,
        freeMode           : true,
        wrapperClass       : 'filter_list',
        slideClass         : 'filter_item',
        onInit             : function(swiper){
          tabs = tabBlock.tabs({
            active    : 0,
            tabContext: tabBlock.data('tab-context'),
            activate  : function(e, u){
              //windowScroll();
            }
          });
        }
      });
}

function all_dialog_close(){
  body_var.on('click', '.ui-widget-overlay', all_dialog_close_gl);
}

function all_dialog_close_gl(){
  $(".ui-dialog-content").each(function(){
    var $this = $(this);
    if(!$this.parent().hasClass('always_open')){
      $this.dialog("close");
    }
  });
}