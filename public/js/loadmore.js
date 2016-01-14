/**
 *@description: 滑动加载更多
 *@author: LiuJ
 *@date: 2016/1/12
 */

define();
$(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();

    function getMoreData() {
        if (scrollTop + windowHeight >= scrollHeight) {
            console.log("get data");
        }
    }

    getMoreData();

});