$(function() {
    var layer = layui.layer;
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    $("#uploadbtn").on("click", function() {
        $("#file").click();
    })
    $("#file").on("change", function(e) {
        if (e.target.files.length == 0) {
            layer.msg("你没有选择文件");
            return
        }
        // 获得文件域中的文件的url地址，并重新初始化裁剪区域
        let newImgURL = URL.createObjectURL(e.target.files[0])

        $image.cropper("destroy").attr("src", newImgURL).cropper(options)
            // $image
            //     .cropper('destroy') // 销毁旧的裁剪区域
            //     .attr('src', newImgURL) // 重新设置图片路径
            //     .cropper(options) // 重新初始化裁剪区域
            // console.log(URL.createObjectURL(e.target.files[0]))
            // console.log(e.target.files[0])
    })
    $("#surebtn").on("click", function() {
        //生成对应截取的图片部分的base64字符串，用于传输至后台
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            //    发送更换头像的请求
        $.ajax({
            method: "post",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                // console.log(res)
                if (res.status == 0) {
                    layer.msg(res.message)
                    window.parent.getUserInfo()
                    return
                }
                layer.msg(res.message)
            }
        })

    })
})