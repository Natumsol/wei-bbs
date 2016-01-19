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
            var comment = $("#comment").val();
            tools.PostData("/article/addComment", {
                body:comment,
                id: $("#articleId").val()
            }, function(result){
                if(result.status){
                    alert("评论成功！");
                } else {
                    alert("评论失败！");
                }
                location.reload();
            });
        });
        $(".deleteComment").click(function(){
            var id = $(this).attr("id");
            tools.PostData("/article/deleteComment", {
                id: id
            }, function(result){
                if(result.status){
                    alert("评论删除成功！");
                } else {
                    alert("评论删除失败！");
                }
                location.reload();
            });

        });

        $(".delete-article").click(function(){
            $.post("/article/delete", {id: $("#articleId").val()}, function(result){
                if(result.status) {
                    location.href = "/";
                } else {
                    alert(result.errInfo);
                }
            });
        });

        $(".modify-article").click(function(){
            location.href = "/article/modify?id=" + $("#articleId").val();
        });
    }
    return {
        init: init
    }
});