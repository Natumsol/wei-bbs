/**
 *@description:
 *@author: Sulfer
 *@date: 2/8 0008
 */
$(function(){
    var nameSpace = "/news";
    var uploadImg = new UploadImg({
        fileId:"productImage",
        container: "#productImgContainer",
        max:1,
        imgName:"sliderImg"
    });
    uploadImg.init()// 初始化图片上传
    uploadImg.counter ++;

    $("input[name='isSlider']").change(function(){
        if(this.value == "true") {
            $("#form-slider-image").show();
        } else {
            $("#form-slider-image").hide();
        }
    });
    var ue = UE.getEditor('newsContent');
    setTimeout(function(){
        $("#newsContent").css("visibility", "visible");
    }, 50);

    $("#submit").click(function(){
        $("#newsContent").val(ue.getContent());
        if($("#newsTitle").val().trim() == "") {
            myalert("请输入资讯名称！");
            return false;
        }
        $.post(nameSpace + "/modify", $("#addNews").serialize(), function(result){
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