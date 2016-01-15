/**
 *@description: index.js
 *@author: LiuJ
 *@date: 2016/1/14
 */

define(["zepto", "loadMore", "ejs","tools"], function ($, loadMore, ejs, tools) {
    var getMoreDataFactory = loadMore.getMoreData; // 数据请求工厂函数
    var format = tools.format;
    var url = "/article/list_index"; // 文章请求链接
    var template = new ejs({url: '/view/index_article.ejs'});

    var callback = function (articles) {// 文章数据处理函数
        articles.articles.forEach(function (article, index, articles) {
            articles[index].createDate = format(article.createDate);
            article.comments.forEach(function (comment) {
                comment.date = format(comment.date);
            })
        });
        $(".index").html(template.render(articles));
    };


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

    // 懒加载监听函数
    var scrollListener = function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();

        function getMoreData() {
            if (scrollTop + windowHeight >= scrollHeight) {
                console.log("get data");
            }
        }

    };

    var init = function(){ // 初始化函数
        getMoreDataFactory(url,{
            start:0,
            limit: 5
        }, callback)();
    };

    return {
        init: init
    }
});
