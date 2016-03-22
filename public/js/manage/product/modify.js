/**
 *@description:
 *@author: Sulfer
 *@date: 2/8 0008
 */

$(function(){
    var nameSpace = "/product";
    var uploadImg = new UploadImg({
        fileId:"productImage",
        container: "#productImgContainer",
        max:1,
        imgName:"image_url"
    });
    uploadImg.init();
    uploadImg.counter ++;
    var ue = UE.getEditor('note');
    setTimeout(function(){
        $("#note").css("visibility", "visible");
    }, 50);
    $("#submit").click(function(){
        $("#note").val(ue.getContent());
        var product = $("#addProduct").serialize();
        if($("#productName").val().trim() == "") {
            myalert("请输入产品名称！");
            return false;
        }
        $.post(nameSpace + "/modify", product, function(result){
            if(result.status == 1)
                myalert("修改成功！", function(){
                window.location.href = "/manage" + nameSpace + "/view?id=" + $("input[name='id']").val();
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