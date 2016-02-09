/**
 *@description:
 *@author: Sulfer
 *@date: 2/8 0008
 */

$(function(){
    var nameSpace = "/news";
   $("#delete").click(function(){
       var id = this.dataset.id;
       $.post(nameSpace + "/delete", {id: id}, function(result){
           var toList = function(){
               window.location.href = "/manage/news";
           };
            if(result.status == 1) {
                myalert("删除成功！！",toList);
            } else {
                myalert(result.errInfo, toList);
            }
       });
   });

});