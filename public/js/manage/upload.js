/**
 *@description:
 *@author: Sulfer
 *@date: 2/6 0006
 */
function UploadImg(options) {
    this.url = options.url || "/upload"; //上传url
    this.timeout = options.timeout || 10000; // 超时等待时间
    this.fileId = options.fileId || "file";
    this.container = options.container || "body";
    this.max = options.max || 5; // 最大上传量
    this.imgName = options.imgName || images; // 上传的图片表单名字
    this.counter = 0;
}

UploadImg.prototype.init = function () {
    var self = this;
    $("body").on("tap", ".remove-img", function () {
        $(this).parent().remove();
        self.counter --;
    });
    $("body").on("click", ".remove-img", function () {
        $(this).parent().remove();
        self.counter --;
    });
    $("#" + this.fileId).change(function () {
        if(self.counter >= self.max) {
            alert("最多上传" + self.max + "图片");
            return false;
        }
        var file = this.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
            var xhr,
                formData,
                timeout = self.timeout,
                imgSrc;
            var imgContainer = $("<div class='img' style='opacity:0.2;'><li class='fa fa-remove remove-img'></li><span class='img-loading'>上传中..</span></div>")
            var img = $("<img />");
            self.counter ++;
            // ---------- 显示预览 ----------
            if (window.URL && window.URL.createObjectURL) {
                imgSrc = window.URL.createObjectURL(file);
                img.attr("src", imgSrc);
                img.appendTo(imgContainer);
                imgContainer.prependTo($(self.container));

            } else {
                console.log("不支持预览。。");
                //    TODO
            }
            xhr = new XMLHttpRequest();
            formData = new FormData();

            function timeoutCallback() {

                alert('上传超时，请重试');
                $(".img-loading", imgContainer).text("上传失败！");

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
                    imgContainer.css("opacity", "1");
                    $(".img-loading", imgContainer).hide();
                    $("<input name='" + self.imgName + "' type='hidden'/>").val(resultSrc).appendTo(imgContainer);
                }
            };
            formData.append('myImage', file);
            xhr.send(formData);
        };
        reader.readAsDataURL(file);
    });
};

