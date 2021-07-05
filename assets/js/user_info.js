$(function() {

    var form = layui.form;
    const layer = layui.layer;
    // 此处想要返回ajax请求返回的res对象，以便我们进行重置操作的时候使用，
    // 但是res对象的作用域在success中，外部访问不了，
    // 于是这里有两个方案解救此问题。
    // 1.利用闭包在外部访问函数内部变量。(利用闭包尝试，尝试未成功，返回的对象是undefine类型的)
    // 2.直接将res对象clone到外部进行使用(将res进行clone，此解决办法可行)
    var Res = {};
    getUserInfo(Res);
    // 为重置按钮监听事件，重置功能完成
    $("#reset").on("click", function(e) {

        e.preventDefault();
        form.val('userInfo', Res);
    })
    $("#submit").on("click", function(e) {
        // console.log($(".layui-form").serialize());
        e.preventDefault();
        console.log($('#form-id [name=id]').val());
        console.log($('#form-id [name=nickname]').val());
        console.log($('#form-id [name=email]').val());
        $.ajax({
            method: 'post',
            url: "/my/userinfo",
            // data: $(".layui-form").val(),
            data: {
                id: Number.parseInt($('#form-id [name=id]').val()),
                nickname: $('#form-id [name=nickname]').val(),
                email: $('#form-id [name=email]').val()
            },
            success: function(res) {
                // console.log("success");
                if (res.status !== 0) {
                    layer.msg("更新用户信息失败");
                    return;
                }
                layer.msg(res.message);
                // 后端更新数据之后，马上将用户信息的更新响应到后台主页上面
                window.parent.getUserInfo();


            },
            error: function(res) {
                console.log("erroer");
            }

            // complete: function(res) {
            //     console.log(res);
            // }

        })
    })


    form.verify({
        nickname: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户昵称不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户昵称首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户昵称不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户昵称不能为敏感词');
                return true;
            }
        }
    })

    function getUserInfo(Res) {
        $.ajax({
            method: 'get',
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("user请求数据失败");
                    return;
                }
                // 利用属性选择器选中input元素，向其赋初始值，这种办法比较麻烦，每个input标签都要进行一次选中
                // $(".layui-form input[name='username']").attr("value", res.data.username);
                // 于是我们可以使用layui中的表单赋值功能，完成对表单中元素的快速赋值

                form.val('userInfo', res.data);
                // 将向后台请求所得到的res.data对象传递给Res对象，让我们能够在函数外部使用其中的数据。
                Object.assign(Res, res.data);

            }

        })
    }
})