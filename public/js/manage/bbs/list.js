/**
 *@description:
 *@author: Sulfer
 *@date: 2/7 0007
 */

$(function() {
    var nameSpace = "/bbs";

    var table = $('#productList').DataTable({
        "ajax": {
            "url": nameSpace + "/getArticles",
            "data": {
                start: 0,
                limit: 10000
            },
            "type": "post",
            "dataSrc": "articles"
        },
        "autoWidth": false,
        "info": false,
        "columns": [{
            "width": "10px",
            "bSortable": false // 禁止某一列排序
        }, {
            "width": "30px"
        },{
            "data": "title"
        }, {
            "data": "author.nickname"
        }, {
            "data": "createDate",
            "width": "150px"
        }],
        "columnDefs": [{
            "targets": 0,
            "data": null,
            "render": function(data, type, full, meta) {
                return '<input type="checkbox" name="entityId" id="' + full._id + '"/>';
            }
        },{
            "targets": 1,
            "data": null,
            "render": function(data, type, full, meta) {
                return meta.row + 1;
            }
        },{
            "targets": 2,
            "data": null,
            "render": function(data, type, full, meta) {
                return "<a href = '/manage/bbs/view?id=" + full._id + "'>" + data + "</a>";
            }
        }],
        "oLanguage" : {
            "sLengthMenu" : "每页显示 _MENU_ 条记录",
            "sZeroRecords" : "对不起，查询不到任何相关数据",
            "sInfo" : "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sInfoEmtpy" : "找不到相关数据",
            "sInfoFiltered" : "数据表中共为 _MAX_ 条记录",
            "sProcessing" : "正在加载中...",
            "sSearch" : "搜索：",
            "sUrl" : "", // 多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
            "oPaginate" : {
                "sFirst" : "首页",
                "sPrevious" : " 前一页 ",
                "sNext" : " 后一页 ",
                "sLast" : " 尾页 "
            }
        }
    });
    table.column( '1:visible' ).order( 'asc' );
    table.on("draw", function(){
        $("#productList_wrapper .row").eq(2).find(".col-sm-5").append($("#product-action-bar").show());
    })

    $("input[name='selectAll']").click(function(){
        var value = this.checked;
        $("input[name='entityId']").each(function(){
            this.checked = value;
        });
    }); // 全选

    $("#add").click(function(){
        window.location.href = "/manage" + nameSpace + "/add";
    });

    $("#modify").click(function(){
        var selected = $("input[name='entityId']:checked");
        if(!selected.length) return myalert("请选择！");
        else if(selected.length != 1) return myalert("每次只能修改一个！");
        window.location.href = "/manage" + nameSpace + "/modify?id=" + selected.attr("id") ;
    });

    $("#delete").click(function(){
        var selected = $("input[name='entityId']:checked");
        if(!selected.length) return myalert("请选择！");
        var id = [];
        selected.each(function(){
            id.push(this.id);
        });
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
                        myalert("删除成功！",table.ajax.reload);
                    } else {
                        myalert(result.errInfo,table.ajax.reload);
                    }
                }
            });
        };
        myconfirm("确定删除所选数据？", myconfirmCallback);
    });

});