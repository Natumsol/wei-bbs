/**
 *@description:
 *@author: Sulfer
 *@date: 2/8 0008
 */
$(function(){
    var nameSpace = "/news";
    (new UploadImg({
        fileId:"productImage",
        container: "#productImgContainer",
        max:1,
        imgName:"sliderImg"
    })).init();// 初始化图片上传

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
        //editor.updateElement();
        $("#newsContent").val(ue.getContent());
        if($("#newsTitle").val().trim() == "") {
            myalert("请输入资讯名称！");
            return false;
        }
        $.post(nameSpace + "/add", $("#addNews").serialize(), function(result){
            if(result.status == 1) {
                myalert("添加成功！！", function(){
                    window.location.href = "/manage" + nameSpace + "/view?id=" + result.id;
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