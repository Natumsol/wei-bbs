/**
 *@description:
 *@author: Sulfer
 *@date: 2/8 0008
 */

$(function(){
    var nameSpace = "/bbs";
   $("#delete").click(function(){
       var id = this.dataset.id;
       var toList = function(){
           window.location.href = "/manage/bbs";
       };
       var myconfirmCallback = function (){
           $.ajax({
               url: nameSpace + "/delete",
               data:{
                   id: id
               },
               type: "POST",
               dataType: "json",
               success: function(result){
                   if(result.status == 1){
                       myalert("删除成功！",toList);
                   } else {
                       myalert(result.errInfo,toList);
                   }
               }
           });
       };

       myconfirm("确定删除？", myconfirmCallback);

   });

});