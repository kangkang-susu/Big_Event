$(function() {
    // 调用获取响应数据的函数并在其中完成用户名，头像的渲染
    const layer = layui.layer;
    // 定义在jquerry入口函数中的函数的所属对象不是 window
    // 在入口函数之外定义的函数 所属的对象才是window。
    window.rrr(); //测试代码
    getUserInfo();

    // 为退出按钮监听退出事件
    $("#loginOutBtn").on("click", function() {
        layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // console.log("点击了确定");
            sessionStorage.removeItem("token");
            location.href = "/login.html";
            layer.close(index);
        });

    })

    function rrr() {
        console.log("正在测试");
    }

})

function rrr() {
    console.log("正在测试");
}
// 渲染用户名，用户头像的函数
function renderUserInfo(res) {
    let data = res.data;
    if (res.status == 0) {
        let name = data.nickname || data.username;
        $("#welcome-user").html(name);
        // console.log(data);
        if (data.user_pic !== null) {
            $(".layui-nav-img").attr('src', data.user_pic).show();
            $(".text-avatar").hide();
        } else {
            $(".layui-nav-img").hide();
            $(".text-avatar").html(name.slice(0, 3)).show();
        }

    } else {
        return
    }
}

// 获取ajax请求的响应数据，并对获取的数据进行渲染。
function getUserInfo() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        // 请求头配置对象
        // headers: {
        //     Authorization: sessionStorage.getItem("token")
        // },
        success: function(res) {
            renderUserInfo(res);
        },
        complete: function(res) {
            var responseJSON = res.responseJSON;
            // console.log("这是complete函数");
            if (responseJSON.status == 1 && responseJSON.message == "身份认证失败！") {
                sessionStorage.removeItem("token");
                location.href = "/login.html"
            }
        }


    });
}