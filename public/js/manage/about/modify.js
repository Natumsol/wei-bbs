/**
 *@description:
 *@author: Sulfer
 *@date: 2/8 0008
 */
$(function(){
    var nameSpace = "/about";

    var ue = UE.getEditor('newsContent');
    setTimeout(function(){
        $("#newsContent").css("visibility", "visible");
    }, 50);
    $("#submit").click(function(){
        $("#newsContent").val(ue.getContent());
        $.post(nameSpace + "/modify", $("#addNews").serialize(), function(result){
            if(result.status == 1) {
                myalert("修改成功！！", function(){
                    window.location.href = "/manage" + nameSpace;
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