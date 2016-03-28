/**
 *@description: add article
 *@author: LiuJ
 *@date: 2016/1/18
 */

define(["zepto","upload", "zepto-touch","editor"],function($, upload){
    var nameSpace = "/bbs";
    var init = function (){
       /* // ___E 三个下划线
        var editor = new ___E('article');
        // 自定义配置
        editor.config.uploadImgUrl = '/upload';

        // editor.config.menus = ['bold', 'quote', 'list','img'];

        // 初始化
        editor.init();
        */

        (new upload.UploadImg({
            container: ".img-container" ,
            fileId: "upload-img"
        })).init(); // 初始化图片上传组件

        $(".submit-article").click(function () {
            if($("#form-add-article input[name='title']").val() == "") {
                alert("标题不能为空！")
                return;
            }
            var data = $("#form-add-article").serialize();
            $.post(nameSpace + "/modify", data, function(result){
               if(result.status) {
                   location.href = nameSpace + "/view?id=" + result.id;
               } else {
                   alert(result.errInfo);
               }
            });
        });
    };
    return {
        init: init
    };
});