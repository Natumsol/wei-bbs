/**
 *@description:
 *@author: LiuJ
 *@date: 2016/1/15
 */
define(['moment',"zepto","moment-locale"], function(moment, $){
    moment.locale("zh_cn");
    function format(string) {
        return moment(new Date(string)).fromNow();
    }
    function PostData(url, data, callback) {
        $.ajax({
            url: url,
            data: data,
            type: "POST",
            dataType: "json",
            success: callback
        });
    }
    return {
        format: format,
        PostData: PostData
    }
});