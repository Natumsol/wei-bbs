/**
 *@description:
 *@author: Sulfer
 *@date: 2/6 0006
 */
define(['zepto', "zepto-touch"], function($){
    function UploadImg(options){
        this.url = options.url || "/upload";
        this.timeout = options.timeout || 10000;
        this.fileId = options.fileId || "file";
        this.container = options.container || "body";
        this.imgTemplate = '<li class="weui_uploader_file weui_uploader_status"> <span class="remove-img weui_icon_clear"></span>'
                                +'<div class="weui_uploader_status_content"></div>'
                         + '</li>';
    }
    function isInteger(obj) {
        return typeof obj === 'number' && obj % 1 === 0
    }
    UploadImg.prototype.init = function() {
        var self = this;
        $("body").on("tap",".remove-img", function(){
            $(this).parent().remove();
        });
        $("body").on("click",".remove-img", function(){
            $(this).parent().remove();
        });
        $("#" + this.fileId).change(function(){
            var file = this.files[0];
            if(!file) return;
            var reader = new FileReader();
            reader.onload = function(){
                var xhr,
                    formData,
                    timeout = self.timeout,
                    imgSrc;
                var img = $(self.imgTemplate).clone();
                // ---------- 显示预览 ----------
                if (window.URL && window.URL.createObjectURL) {
                    imgSrc = window.URL.createObjectURL(file);
                    img.css("background", "url(" + imgSrc + ")");
                    img.prependTo($(self.container));

                } else {
                    img.prependTo($(self.container));
                }
                xhr = new XMLHttpRequest();
                formData = new FormData();

                function timeoutCallback() {
                    img.find(".weui_uploader_status_content").html('<i class="weui_icon_warn"></i>');
                }

                xhr.open('POST', "/upload", true);

                // 计时开始
                timeoutId = setTimeout(timeoutCallback, self.timeout);

                xhr.onprogress = function(evt){
                    var progress = (evt.loaded / evt.total)*100;
                    if(isInteger(progress)) {
                        img.find(".weui_uploader_status_content").text("%" + progress);
                    } else {
                        img.find(".weui_uploader_status_content").html('<i class="weui_icon_warn"></i>');
                    }
                };

                xhr.onload = function () {
                    // 得到消息之后，清除计时
                    clearTimeout(timeoutId);

                    var resultSrc = xhr.responseText; //服务器端要返回图片url地址
                    var erroInfo;

                    console.log('服务器端的返回数据为：' + resultSrc);

                    // 返回数据错误
                    if (resultSrc.indexOf('error|') === 0) {
                        erroInfo = resultSrc.split('|')[1];
                        // 提示错误
                        alert('上传图片错误: \n' + erroInfo);
                    } else {
                        // 返回正确的图片地址
                        img.removeClass("weui_uploader_status");
                        img.find(".weui_uploader_status_content").text("");
                        if(img.css("background-image") == "none") {
                            img.css("background-image", "url(" + resultSrc.replace("images", "temp") + ")");
                        }
                        $("<input name='images' type='hidden'/>").val(resultSrc).appendTo(img);
                    }
                };
                formData.append('myImage', file);
                xhr.send(formData);
            };
            reader.readAsDataURL(file);
        });
    };
    return {
        UploadImg: UploadImg
    }
});

