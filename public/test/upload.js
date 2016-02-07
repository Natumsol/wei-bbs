/**
 *@description:
 *@author: Sulfer
 *@date: 2/6 0006
 */
function Uploadimg(options){
    this.url = options.url || "/upload";
    this.timeout = options.timeout || 10000;
    this.fileId = options.fileId || "file";
    this.container = options.container || "body";
}

Uploadimg.prototype.init = function() {
    var self = this;
    $("#" + this.fileId).change(function(){
        var file = this.files[0];
        if(!file) return;
        var reader = new FileReader();
        reader.onload = function(){
            var xhr,
                formData,
                timeout = self.timeout,
                imgSrc;
            var imgContainer = $("<div class='img-container' style='opacity:0.2;'><span clas='img-loading'>上传中..</span></div>")
            var img = $("<img />");
            // ---------- 显示预览 ----------
            if (window.URL && window.URL.createObjectURL) {
                imgSrc = window.URL.createObjectURL(file);
                img.attr("src", imgSrc);
                img.appendTo(imgContainer);
                imgContainer.appendTo($(self.container));
            } else {
                console.log("不支持预览。。");
            //    TODO
            }

            xhr = new XMLHttpRequest();
            formData = new FormData();

            function timeoutCallback() {

                alert('上传超时，请重试');

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
                }
            };
            formData.append('wangEditorMobileFile', file);
            xhr.send(formData);
        };
        reader.readAsDataURL(file);
    });
};

$(function(){
    var uploadimg = new Uploadimg({});
    uploadimg.init();
});