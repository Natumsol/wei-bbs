/**
 *@description: 新闻列表
 *@author: Sulfer
 *@date: 2/4 0004
 */
define(["zepto", "tools", "ejs","frozen"], function($, tools, ejs){
    var nameSpace = "/news";
    var count = 0;
    var drain = false;

    var callback = function(news){
        //console.log(news);
        $(".ui-list").append($(template.render(news)));
        count ++;
        $(".ui-loading-block").removeClass("show");
        $(".load-more-data").removeClass("util-hidden");
        if(news.news.length < 10) {
            drain = true;
            $(".load-more-data").addClass("util-hidden");
        }
        if(init) {
            if(news.news.length == 0) $(".ui-notice").show();
            else $(".ui-list").css("border-width", "1px");
            init = !init;
        }
    };
    var template = new ejs({url: '/view/newsList.ejs'}); // 数据模版

    var init = function(){
        tools.PostData(nameSpace + "/getNews", {
            start:count * 10,
            limit: 10
        }, callback);
    };
    $(".load-more-data").click(function () {
        if(!drain) {
            $(".ui-loading-block").addClass("show");
            tools.PostData(nameSpace + "/getNews", {
                start:count * 10,
                limit: 10
            }, callback);
        } else {
            $.tips({
                content:'已没有更多资讯',
                stayTime:2000,
                type:"warn"
            })
        }
    });
    return {
        init:init
    }
});