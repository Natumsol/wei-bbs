/**
 *@description: 新闻列表
 *@author: Sulfer
 *@date: 2/4 0004
 */
define(["zepto", "tools", "ejs","frozen"], function($, tools, ejs){
    var nameSpace = "/news";
    var count = 0;
    var drain = false;
    var init = true;

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

    var initial = function(){
        tools.PostData(nameSpace + "/getNews", {
            start:count * 10,
            limit: 10,
            keyword: $("#keyword").val()
        }, callback);
    };

    $(".load-more-data").click(function () {
        if(!drain) {
            $(".ui-loading-block").addClass("show");
            tools.PostData(nameSpace + "/getNews", {
                start:count * 10,
                limit: 10,
                keyword: $("#keyword").val()
            }, callback);
        } else {
            $.tips({
                content:'已没有更多资讯',
                stayTime:2000,
                type:"warn"
            })
        }
    });

    function doSearch(){
        count = 0;
        drain = false;
        init = true;
        $(".ui-notice").hide();
        $(".ui-list").empty();
        initial();
    }
    $('.ui-searchbar').tap(function(){
        $('.ui-searchbar-wrap').addClass('focus');
        $('.ui-searchbar-input input').focus();
    });
    $('.ui-searchbar-cancel').tap(function(){
        $('.ui-searchbar-wrap').removeClass('focus');
    });
    $('.ui-icon-close').tap(function(){
        $("#keyword").val("");
        doSearch();
    });
    /*$('.ui-searchbar').click(function(){
        $('.ui-searchbar-wrap').addClass('focus');
        $('.ui-searchbar-input input').focus();
    });
    $('.ui-searchbar-cancel').click(function(){
        $('.ui-searchbar-wrap').removeClass('focus');
    });
    $('.ui-icon-close').click(function(){
        $("#keyword").val("");
        doSearch();
    });*/
    var elem =  $("#keyword");

    // Save current value of element
    elem.attr('oldVal', elem.val());

    // Look for changes in the value
    elem.bind("change click keyup input paste", function(event){
        // If value has changed...
        if (elem.attr('oldVal') != elem.val()) {
            // Updated stored value
            elem.attr('oldVal', elem.val());

            // Do action
            doSearch();
        }
    });

    return {
        init:initial
    }
});