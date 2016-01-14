/**
 *@description: 滑动加载更多
 *@author: LiuJ
 *@date: 2016/1/12
 */

define(["zepto"], function ($) {
    var getMoreData = function (url, params, callback) {
        return function () {
            $.ajax({
                url: url,
                data: params,
                dataType: "json",
                type: "POST",
                success: callback
            });
        }
    };

    return {
        getMoreData: getMoreData
    }
});
