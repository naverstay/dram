var mainSlider, posterSlider, newsSlider, actorSlider;

$(function ($) {

    

});

$(window).on('load', function (e) {

    var mainSlider = new Swiper('.mainSlider', {
        loop: false,
        setWrapperSize: true,
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 0,
        pagination: '.mainSlider .swiper-pagination'
    });

    var posterSlider = new Swiper('.posterSlider', {
        loop: false,
        setWrapperSize: true,
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 10,
        pagination: '.posterSlider .swiper-pagination'
    });

    var newsSlider = new Swiper('.newsSlider', {
        loop: false,
        setWrapperSize: true,
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 10,
        pagination: '.newsSlider .swiper-pagination'
    });

    var actorSlider = new Swiper('.actorSlider', {
        loop: false,
        setWrapperSize: true,
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 17,
        breakpoints: {
            480: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            960: {
                slidesPerView: 2,
                spaceBetween: 10
            }
        }
    });

});

