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
                var imgContainer = $("<div class='img' style='opacity:0.2;'><li class='fa fa-remove remove-img'></li><span class='img-loading'>上传中..</span></div>")
                var img = $("<img />");
                // ---------- 显示预览 ----------
                if (window.URL && window.URL.createObjectURL) {
                    imgSrc = window.URL.createObjectURL(file);
                    img.attr("src", imgSrc);
                    img.appendTo(imgContainer);
                    imgContainer.prependTo($(self.container));

                } else {
                    img.appendTo(imgContainer);
                    imgContainer.prependTo($(self.container));
                }
                xhr = new XMLHttpRequest();
                formData = new FormData();

                function timeoutCallback() {

                    alert('上传超时，请重试');
                    $(".img-loading",imgContainer).text("上传失败！");

                }

                xhr.open('POST', "/upload", true);

                // 计时开始
                timeoutId = setTimeout(timeoutCallback, self.timeout);

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
                        imgContainer.css("opacity","1");
                        if(!img.attr("src")) {
                            img.attr("src", resultSrc.replace("images", "temp"));
                        }
                        $(".img-loading",imgContainer).hide();
                        $("<input name='images' type='hidden'/>").val(resultSrc).appendTo(imgContainer);
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

