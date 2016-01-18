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
    };
    return {
        init: init
    };
});