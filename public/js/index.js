/**
 *@description:
 *@author: Sulfer
 *@date: 2/1 0001
 */
define(["zepto", "zepto-touch", "frozen"], function ($) {
    var slider = new fz.Scroll('#news-slider', {
        role: 'slider',
        indicator: true,
        autoplay: true,
        interval: 4000
    });
    $("#news-slider .title").show();
    $(".slider-tap").tap(function(){
        window.location.href = $("a", this).attr("href");
    });
   /* setTimeout(function(){
        $(".ui-panel-product").css("visibility", "visible");
    },50);
    $(".product-img").height(function(){
        return $(this).width();
    });
    $(window).resize(function(){
        $(".product-img").height(function(){
            return $(this).width();
        });
    });*/
});