/**
 *@description:
 *@author: Sulfer
 *@date: 2/8 0008
 */

$(function(){
    var nameSpace = "/product";
    (new UploadImg({
        fileId:"productImage",
        container: "#productImgContainer",
        max:1,
        imgName:"image_url"
    })).init();// 初始化图片上传

    $("#submit").click(function(){
        var product = $("#addProduct").serialize()
        $.post(nameSpace + "/add", product, function(result){
            var toList = function(){

            }
            if(result.status == 1)
                myalert("添加成功！", function(){
                window.location.href = "/manage" + nameSpace;
            });
            else {
                myalert(result.errInfo, function(){
                    window.location.reload();
                });
            }

        });
        return false;
    });

});