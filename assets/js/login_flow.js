$(function() {
    // 实现登录模块与注册模块的切换
    $("#to_reg,#to_login").on("click", function() {
            $(this).parent().toggleClass("block-visible").siblings().toggleClass("block-visible");
        })
        // 向layui中添加自定义表单验证
    const layer = layui.layer
    let form = layui.form
    form.verify({
            password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            username: [/^[\w]{6,12}$/, '用户名必须由6-12位的字母或数字组成'],
            checkpwd: function(value, item) {
                var inputval = $(".reg-box input[name='pwd']").val();
                if (value !== inputval) {
                    return "密码输入不一致";
                }
            }
        })
        // 实现真实的在服务器中的用户注册功能
    $("#reg-form").on("submit", function(e) {
            e.preventDefault();
            let username = this[name = "username"].value;
            let password = this[name = "pwd"].value;
            let data = {
                username: username,
                password: password
            };
            $.post("/api/reguser",
                data,
                function(res) {
                    if (res.status !== 0) {
                        layer.open({
                            title: '注册信息',
                            content: res.message
                        });
                        return;
                    }
                    layer.open({
                        title: '注册信息',
                        content: res.message
                    });
                    $("#to_login").click();
                    $(".login-box input[name='username']").attr({
                        value: username
                    });
                    $(".login-box input[name='pwd']").attr({
                        value: password
                    });
                    console.log(username);
                    console.log(password);

                })

        })
        // 实现登录功能
    $("#login-form").on("submit", function(e) {
        e.preventDefault();
        // console.log($(this).serialize());
        // console.log(typeof($(this).serialize()));
        let data = {
            username: this[name = "username"].value,
            password: this[name = "pwd"].value
        }
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            // data: $(this).serialize(),
            data: data,
            success: function(res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                    // localStorage.setItem('token', res.token)
                sessionStorage.setItem('token', res.token);
                //     // 跳转到后台主页
                location.href = '/index.html'
            }

        })
    })
})