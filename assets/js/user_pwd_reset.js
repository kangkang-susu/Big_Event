$(function() {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function(value) {
            if (value == $("input[name='oldpwd']").val()) {
                return "新密码不能和原密码一致";
            }
        },
        surepwd: function(value) {
            if (value !== $("input[name='newpwd']").val()) {
                return "两次输入的新密码不一致";
            }
        }


    })
    $("#form-id").on("submit", function(e) {
        e.preventDefault();
        var data = form.val("pwdreset");

        $.ajax({
            url: "/my/updatepwd",
            method: "POST",
            data: {
                oldPwd: data.oldpwd,
                newPwd: data.newpwd
            },
            success: function(res) {
                console.log(res);
                layer.msg(res.message);
                $("#reset").click();
            }
        })
    })
})