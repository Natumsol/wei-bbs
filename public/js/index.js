/**
 *@description:
 *@author: Sulfer
 *@date: 2/1 0001
 */
define(["zepto", "frozen"], function ($) {
    var slider = new fz.Scroll('#news-slider', {
        role: 'slider',
        indicator: true,
        autoplay: true,
        interval: 4000
    });
    $("#news-slider .title").show();
});