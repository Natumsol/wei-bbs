/**
 *@description: 产品列表
 *@author: Sulfer
 *@date: 2/4 0004
 */
define(["zepto", "tools", "ejs","frozen"], function($, tools, ejs){
    var nameSpace = "/product";
    var count = 0;
    var drain = false;
    var callback = function(products){
        console.log(products);
        $(".ui-grid-trisect").append($(template.render(products)));
        count ++;
        if(products.products.length < 6) {
            drain = true;
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