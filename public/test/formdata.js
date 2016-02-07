/**
 *@description:
 *@author: Sulfer
 *@date: 2/5 0005
 */

var log = console.log.bind(console);

var config = {
    url: "/upload",
    fileId:"file",
    timeout:10000
};

$("#" + config.)
document.getElementById("file").addEventListener("change", function(){
    var file = this.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(e){
        var base64 = e.target.result || this.result,
            prevImgSrc,
            prveImgContainerId = 'div' + Math.random().toString().slice(2),
            prevImgInfoId = 'info' +  Math.random().toString().slice(2),
            xhr,
            formData,
            timeoutId;

        // ---------- 显示预览 ----------
        if (window.URL && window.URL.createObjectURL) {
            // 如果浏览器支持预览本地图片功能，则预览本地图片
            prevImgSrc = window.URL.createObjectURL(file);

            // 生成预览图片，设置半透明
            $("body").after(
                '<div class="previmg-container" id="' + prveImgContainerId + '">' +
                '   <p class="info" id="' + prevImgInfoId + '">上传中...</p>' +
                '	<img src="' + prevImgSrc + '" style="opacity:0.2; max-width:100%;"/>' +
                '</div>'
            );
        } else {
            // 如果浏览器不支持预览本地图片，则复制为一个配置的图片地址
            prevImgSrc = loadingImgUrl;

            // 生成预览图片
            $("body").after(
                '<div class="previmg-container" id="' + prveImgContainerId + '">' +
                '	<img src="' + prevImgSrc + '" style="max-width:100%;"/>' +
                '</div>'
            );
        }

        // ---------- 上传到服务器 ----------
        xhr = new XMLHttpRequest();
        formData = new FormData();

        // 访问超时
        function timeoutCallback() {

            alert('上传超时，请重试');

        }

        xhr.open('POST', "/upload", true);

        // 计时开始
        timeoutId = setTimeout(timeoutCallback, 10000);

        xhr.onload = function () {
            // 得到消息之后，清除计时
            clearTimeout(timeoutId);

            var resultSrc = xhr.responseText; //服务器端要返回图片url地址
            var erroInfo;
            var $prevImgContainer = $('#' + prveImgContainerId);
            var loadImg;
            var $loadImg;

            log('服务器端的返回数据为：' + resultSrc);

            // 返回数据错误
            if (resultSrc.indexOf('error|') === 0) {
                erroInfo = resultSrc.split('|')[1];
                log('很遗憾，后台返回error，错误信息为：' + erroInfo);

                // 提示错误
                alert('上传图片错误: \n' + erroInfo);

                // 移除预览图片
                $prevImgContainer.remove();

            } else {
                // 返回正确的图片地址

                };
                loadImg.onerror = function () {
                    log('图片加载失败，请确定这个url是否能成功得到图片：' + resultSrc);

                    alert('图片加载失败');
                    $prevImgContainer.remove();

                    // 保存内容
                    self.saveSourceCode();
                };
            }
        };

        // 添加图片数据
        // 1. 图片数据要经过 convertBase64UrlToBlob 转换
        // 2. wangEditorMobileFile 要和后台一致
        formData.append('wangEditorMobileFile', file);
        xhr.send(formData);
    };

    //读取文件
    reader.readAsDataURL(file);

   /* var xhr = new XMLHttpRequest();
    xhr.open("post","/upload", true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4) {
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                alert(xhr.responseText);
            } else {
                alert("Request was unsuccessful: " + xhr.status);
            }
        }
    };
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    var body = new FormData();
    body.append("wangEditorMobileFile", file);
    xhr.send(body);*/
});