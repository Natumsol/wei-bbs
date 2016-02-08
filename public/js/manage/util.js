/**
 *@description:实用函数
 *@author: Sulfer
 *@date: 2/8 0008
 */
window.myalert = function(content, callback) {
    dialog({
        title: "提示",
        content: content || "",
        width:"300",
        "okValue":"确定",
        "ok": function(){
            callback && callback();
        }
    }).showModal();
}; // 重写alert函数
window.myconfirm = function(content, confirmCallback, cancelCallback) {
    dialog({
        title: "提示",
        content: content || "",
        width:"200",
        "okValue":"确定",
        "ok": function(){
            confirmCallback && confirmCallback();
        },
        "cancelValue": "取消",
        "cancel": function(){
            cancelCallback && cancelCallback();
        }
    }).showModal();
}; // 重写confirm 函数
window.log = console.log.bind(console);