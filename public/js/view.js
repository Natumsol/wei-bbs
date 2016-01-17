/**
 *@description: 帖子查看
 *@author: Sulfer
 *@date: 1/17 0017
 */
define(["zepto", "ejs", "tools"], function ($, ejs, tools) {
    function init(){
        $("#menu").click(function(){
            $('.ui-actionsheet').addClass('show');
        });
        $("#cancel").click(function(){
            $('.ui-actionsheet').removeClass('show');
        });
        $(".select-top").click(function(){
            $('.ui-actionsheet').removeClass('show');
            location.reload();
        });

        $(".addComment").click(function(){
            location.href = "/article/addComment?id=" + $("#articleId").val()
        });
    }
    return {
        init: init
    }
});