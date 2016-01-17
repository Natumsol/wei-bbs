/**
 *@description: index.js
 *@author: LiuJ
 *@date: 2016/1/14
 */

define(["zepto", "loadMore", "ejs", "tools"], function ($, loadMore, ejs, tools) {
    var getMoreDataFactory = loadMore.getMoreData; // 数据请求工厂函数
    var format = tools.format;
    var url = "/article/list_index"; // 文章请求链接
    var template = new ejs({url: '/view/index_article.ejs'}); // 数据模版
    var counter = 0;
    var noMoreData = false;
    var callback = function (articles) {// 文章数据处理函数
        if(articles.articles.length) {
            counter ++;
            articles.articles.forEach(function (article, index, articles) {
                articles[index].createDate = format(article.createDate);
                article.comments.forEach(function (comment) {
                    comment.date = format(comment.date);
                })
            });
            $(".index").append($(template.render(articles)));

        } else {
            noMoreData = true;
        }
        $(".ui-loading-block").removeClass("show");

    };


    // 懒加载监听函数
    var scrollListener = function () {

            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();

            if (scrollTop + windowHeight >= scrollHeight ) {
                if(!noMoreData) {
                    $(".ui-loading-block").addClass("show");
                    console.log("get data");
                    getMoreDataFactory(url, {
                        start: 5 * counter,
                        limit: 5 * counter + 5
                    }, callback)();
                } else {

                }

            }


    };

    var init = function () {
        $(".ui-loading-block").addClass("show");
        // 取得首页帖子数据
        getMoreDataFactory(url, {
            start: 0,
            limit: 5
        }, callback)();
        counter ++ ;
        // 事件绑定
        $("#menu").click(function () {
            $('.ui-actionsheet').addClass('show');
        });

        $("#cancel").click(function () {
            $('.ui-actionsheet').removeClass('show');
        });

        $(".select-top").click(function () {
            $('.ui-actionsheet').removeClass('show');
            location.reload();
        });

        $(".userCenter").click(function () {
            location.href = "user/";
        });

        $(".view-all-topics").click(function () {
            location.href = "nav.html";
        });

        window.addEventListener("scroll", scrollListener); // 绑定滚动事件
    };

    return {
        init: init
    }
});
