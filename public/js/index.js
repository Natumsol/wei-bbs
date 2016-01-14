/**
 *@description: index.js
 *@author: LiuJ
 *@date: 2016/1/14
 */
define(["zepto", "loadMore", "ejs"], function ($, loadMore, ejs) {
    var getMoreDataFactory = loadMore.getMoreData; // 数据请求工厂函数
    var url = "/article/list"; // 文章请求链接
    var callback = function (articles) {

    } // 文章数据处理函数
    console.log(ejs);
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

    // 懒加载
    var scrollListener = function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();

        function getMoreData() {
            if (scrollTop + windowHeight >= scrollHeight) {
                console.log("get data");
            }
        }

        getMoreData();
    }
});
