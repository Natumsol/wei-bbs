/**
 *@description: 帖子查看
 *@author: Sulfer
 *@date: 1/17 0017
 */
define(["zepto", "ejs", "tools"], function ($, ejs, tools) {
    var nameSpace = "/bbs";
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
            tools.PostData(nameSpace + "/addComment", {
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
            tools.PostData(nameSpace + "/deleteComment", {
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
            $.post(nameSpace + "/delete", {id: $("#articleId").val()}, function(result){
                if(result.status) {
                    location.href = nameSpace;
                } else {
                    alert(result.errInfo);
                }
            });
        });

        $(".modify-article").click(function(){
            location.href = nameSpace + "/modify?id=" + $("#articleId").val();
        });
    }
    return {
        init: init
    }
});