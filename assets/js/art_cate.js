function initArtCateList() {
    $.ajax({
        url: "/my/article/cates",
        success: function(res) {
            console.log(res)
            var tbtemplate = template("tbcList", res)
            $("#tbody").html(tbtemplate)
        }
    })
}
$(function() {
    var layer = layui.layer
    var form = layui.form
    var edit_tanchu_index = 0
    initArtCateList();
    // 为文章类别中的编辑按钮添加事件代理
    $("#tbody").on("click", "tr .edit-btn", function() {
        // 通过tr标签获取自定义属性中的ID
        let domtr = $(this).parents("tr")[0]
        let Id = $(domtr).attr("cateId")
        edit_tanchu_index = layer.open({
            type: 1,
            title: '编辑类别',
            skin: "layui-layer-molv",
            area: ['500px', '300px'],
            content: $("#tanchu-form-edit").html()
        });
        $.ajax({
            url: "/my/article/cates/" + Id,
            method: "get",
            success: function(res) {
                // console.log(res)
                form.val("form-edit", res.data)

            }
        })

    })
    $("#tbody").on("click", "tr .layui-btn-danger", function() {
        // console.log("点击了删除")
        let that = this
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something

            if (index) {
                console.log(that)
                    // console.log(this) 此处的this代表的是confirm弹出框这个对象
                let domtr = $(that).parents("tr")[0]
                let Id = $(domtr).attr("cateId")
                $.ajax({
                    // 根据id删除文章类别这里，传递的参数采用了parame参数的url传参方式
                    url: "/my/article/deletecate/" + Id,
                    method: "get",
                    success: function(res) {
                        // console.log(res)
                        if (res.status == 0) {
                            layer.msg(res.message)
                            initArtCateList();
                            return
                        }
                        layer.msg(res.message)

                    }
                })

                // let domtr = $(this).parents("tr")[0]
                // console.log($(domtr).children(".visible").html())
            }


            layer.close(index);
        });






    })

    $("#addCateBtn").on("click", function() {
            layer.open({
                type: 1,
                title: '添加类别',
                skin: "layui-layer-molv",
                area: ['500px', '300px'],
                content: $("#tanchu-form").html()
            });
        })
        // 为类别增加表单添加位于body上的事件代理
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault()
            // console.log("触发了submit事件")
            // console.log(this.name.value)
            // console.log(this.alias.value)
        $.ajax({
            url: "/my/article/addcates",
            method: "post",
            data: {
                name: this.name.value,
                alias: this.alias.value
            },
            success: function(res) {
                // console.log(res)
                layer.msg(res.message)
                if (res.status == 0) {
                    initArtCateList()
                    $("button[type='reset']").click()
                        // $(this).children("button[type='reset']").click()
                }
            }
        })

    })
    $("body").on("submit", "#form-edit", function(e) {
        // console.log("edit submit")
        e.preventDefault()
        $.ajax({
            url: "/my/article/updatecate",
            method: "post",
            data: {
                Id: this.Id.value,
                name: this.name.value,
                alias: this.alias.value
            },
            success: function(res) {
                layer.msg(res.message)
                    // console.log(res.message)
                if (res.status == 0) {
                    initArtCateList();
                    // 根据弹出层index，关闭弹出层
                    layer.close(edit_tanchu_index)
                    return
                }

            }
        })
    })
})