/**
 *@description:
 *@author: Sulfer
 *@date: 2/8 0008
 */

$(function(){
    var nameSpace = "/product";
   $("#delete").click(function(){
       var id = this.dataset.id;
       $.post(nameSpace + "/delete", {id: id}, function(result){
           var toList = function(){
               window.location.href = "/manage/product";
           };
            if(result.status == 1) {
                alert("删除成功！！",toList);
            } else {
                alert(result.errInfo, toList);
            }
       });
   });

});