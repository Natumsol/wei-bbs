/**
 *@description: add article
 *@author: LiuJ
 *@date: 2016/1/18
 */

define(["zepto", "upload", "zepto-touch","editor",],function($, upload){
    var init = function (){
       /* // ___E 三个下划线
        var editor = new ___E('article');
        // 自定义配置
        editor.config.uploadImgUrl = '/upload';

        // editor.config.menus = ['bold', 'quote', 'list','img'];

        // 初始化
        editor.init();*/


        (new upload.UploadImg({
            container: ".img-container" ,
            fileId: "upload-img",
            max:2,
            callback: function(counter, max){
                $(".weui_cell_ft").text(counter + "/" + max);
            }
        })).init();// 初始化图片上传组件

        $(".submit-article").click(function () {
            if($("#form-add-article input[name='title']").val() == "") {
                alert("标题不能为空！")
                return;
            }
            var data = $("#form-add-article").serialize();
            $.post("/bbs/add", data, function(result){
               if(result.status) {
                   location.href = "/bbs/view?id=" + result.id;
               } else {
                   alert(result.errInfo);
               }
            });
        });

        var elem =  $("textarea.weui_textarea");

        // Save current value of element
        elem.attr('oldVal', elem.val());

        // Look for changes in the value
        elem.on("change click keyup input paste", function(event){
            // If value has changed...
            if(elem.val().length > 200){
                elem.val(function(){
                    return elem.val().substr(0, 200);
                })
                alert("最多输入200个字符！");
            }
            if (elem.attr('oldVal') != elem.val()) {
                // Updated stored value
                elem.attr('oldVal', elem.val());

                // Do action
                $(".weui_textarea_counter span").text(elem.val().length);
            }
        });
    };
    return {
        init: init
    };
});