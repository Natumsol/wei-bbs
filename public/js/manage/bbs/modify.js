/**
 *@description:
 *@author: Sulfer
 *@date: 2/8 0008
 */
$(function(){
    var nameSpace = "/bbs";
    var uploadImg = new UploadImg({
        fileId:"productImage",
        container: "#productImgContainer",
        max:9,
        imgName:"images"
    });
    uploadImg.init()// 初始化图片上传
    uploadImg.counter = $("#productImgContainer")[0].dataset.imgcounter;

    $("input[name='isSlider']").change(function(){
        if(this.value == "true") {
            $("#form-slider-image").show();
        } else {
            $("#form-slider-image").hide();
        }
    });
    var ue = UE.getEditor('postContent');
    setTimeout(function(){
        $("#postContent").css("visibility", "visible");
    }, 50);
    $("#submit").click(function(){
        $("#postContent").val(ue.getContent());
        if($("#postTitle").val().trim() == "") {
            myalert("请输入标题！");
            return false;
        }
        $.post(nameSpace + "/modify", $("#addPost").serialize(), function(result){
            if(result.status == 1) {
                myalert("修改成功！！", function(){
                    window.location.href = "/manage" + nameSpace + "/view?id=" + $("input[name='id']").val();
                });
            } else {
                myalert(result.errInfo, function(){
                    location.reload();
                })
            }
        });
        return false;
    });
});