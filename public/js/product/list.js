/**
 *@description: 产品列表
 *@author: Sulfer
 *@date: 2/4 0004
 */
define(["zepto", "tools", "ejs","frozen"], function($, tools, ejs){
    var nameSpace = "/product";
    var count = 0;
    var drain = false;
    var init = true;
    var callback = function(products){
        //console.log(products);
        $(".ui-grid-trisect").append($(template.render(products)));
        $(".product-img").height(function(){
            return $(this).width();
        });
        $(window).resize(function(){
            $(".product-img").height(function(){
                return $(this).width();
            });
        });
        $(".ui-loading-block").removeClass("show");
        $(".load-more-data").removeClass("util-hidden");
        count ++;
        if(products.products.length < 6) {
            drain = true;
            $(".load-more-data").addClass("util-hidden");
        }
        if(init) {
            if(products.products.length == 0) $(".ui-notice").show();
            else $(".ui-grid-trisect").css("border-width", "1px");
            init = !init;
        }
    };
    var template = new ejs({url: '/view/productList.ejs'}); // 数据模版

    var init = function(){
        tools.PostData(nameSpace + "/getProduct", {
            start:count * 6,
            limit: 6
        }, callback);
    };
    $(".load-more-data").click(function () {
        if(!drain) {
            $(".ui-loading-block").addClass("show");
            tools.PostData(nameSpace + "/getProduct", {
                start:count * 6,
                limit: 6
            }, callback);
        } else {
            $.tips({
                content:'已没有更多产品',
                stayTime:2000,
                type:"warn"
            })
        }
    });

    return {
        init:init
    }
});