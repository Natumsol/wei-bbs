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
    var editor = CKEDITOR.replace('newsContent',{
        language:"zh-CN"
    });
    $("#submit").click(function(){
        editor.updateElement();
        $.post(nameSpace + "/add", $("#addNews").serialize(), function(result){
            if(result.status == 1) {
                myalert("添加成功！！", function(){
                    location.href = "/manage" + nameSpace;
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