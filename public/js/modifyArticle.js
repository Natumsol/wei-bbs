/**
 *@description: add article
 *@author: LiuJ
 *@date: 2016/1/18
 */

define(["zepto", "zepto-touch","editor"],function($){
    var init = function (){
        // ___E 三个下划线
        var editor = new ___E('article');
        // 自定义配置
        editor.config.uploadImgUrl = '/upload';

        // editor.config.menus = ['bold', 'quote', 'list','img'];

        // 初始化
        editor.init();

        console.log(editor.$txt);
        $(".submit-article").click(function () {
            var data = $("#form-add-article").serialize();
            $.post("/article/modify", data, function(result){
               if(result.status) {
                   location.href = "/article/view?id=" + result.id;
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