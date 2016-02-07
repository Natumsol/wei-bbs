/**
 *@description: index.js
 *@author: LiuJ
 *@date: 2016/1/14
 */

define(["zepto", "loadMore", "ejs", "tools"], function ($, loadMore, ejs, tools) {
    var getMoreDataFactory = loadMore.getMoreData; // 数据请求工厂函数
    var format = tools.format;
    var url = "/bbs/getArticles"; // 文章请求链接
    var template = new ejs({url: '/view/articleList.ejs'}); // 数据模版
    var counter = 0;
    var noMoreData = false;
    var callback = function (articles) {// 文章数据处理函数
        if (articles.articles.length) {
            counter++;
            var userId = $("#userId").val();
            articles.articles.forEach(function (article, index, articles) {
                articles[index].createDate = format(article.createDate);
                article.comments.forEach(function (comment) {
                    comment.date = format(comment.date);
                });
            });

            console.log(articles);
            $(".index").append($(template.render(articles)));

        } else {
            noMoreData = true;
        }
        $(".ui-loading-block").removeClass("show");

    };


    // 懒加载监听函数
    var scrollListener = function () {

        var scrollTop = this.scrollTop;
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();

        if (scrollTop + windowHeight >= scrollHeight) {
            if (!noMoreData) {
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

    var initData = function () {
        // 状态变量初始化
        counter = 0;
        noMoreData = false;
        $(".index").html("");

        $(".ui-loading-block").addClass("show");
        // 取得首页帖子数据
        getMoreDataFactory(url, {
            start: 0,
            limit: 5
        }, callback)();
        counter++;

    };

    var eventBind = function(){
        // 事件绑定
        $(".userCenter").click(function () {
            location.href = "user/";
        });

        $(".add-article").click(function(){
            location.href = "/bbs/add";
        });

        $("body").on("click", ".view-all-comments-link", function(){
            var commentWrapper = $(this).parent().parent().find(".comment-wrapper");
            console.log(commentWrapper);
            $(".all-comments-container", $(this).parent()).appendTo(commentWrapper).show();
            $(this).parent().hide();
            return false;
        });


        $("body").on("click", ".addComment", function(){
            var comment = $(this).parent().find(".add-comment").val()
            tools.PostData("/bbs/addComment", {
                body:comment,
                id: this.dataset.articleid
            }, function(result){
                if(result.status){
                    alert("评论成功！");
                } else {
                    alert("评论失败！");
                }
                initData();
            });
        });

        window.addEventListener("scroll", scrollListener); // 绑定滚动事件
    };
    return {
        initData: initData,
        eventBind: eventBind
    }
});
