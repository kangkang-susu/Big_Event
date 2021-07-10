$(function() {
    let form = layui.form
        // 初始化封面裁剪区域
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    let art_state = "已发布"
        // 3. 初始化裁剪区域
    $image.cropper(options)
    initartCateSele()
        // 初始化富文本编辑器
    initEditor()



    function initartCateSele() {
        $.ajax({
            url: "/my/article/cates",
            method: "get",
            success: function(res) {
                var sele = template("artCate_sele", res)
                $("select[name='cate_id']").html(sele)
                form.render()

            }
        })
    }
    $("#chose-btn").on("click", function() {
        $("#hid-file").click()
    })
    $("#hid-file").on("change", function(e) {
        // 获取用户上传的第一个文件
        var file = e.target.files[0]
            // 创建该文件的url地址，让我们能够获取到
        var newImgURL = URL.createObjectURL(file)
            // 裁剪区域重新初始化
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    $(".layui-btn-primary").on("click", function() {
        art_state = "草稿"
    })
    $("#artForm").on("submit", function(e) {
        e.preventDefault()
            // 利用form对象创建FormData对象
        var formdata = new FormData($(this)[0])

        formdata.append("state", art_state)


        // 获取截取的封面
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                formdata.append("cover_img", blob)
                    // formdata.forEach(function(v, k) {
                    //         console.log(v, k)
                    //     })
                $.ajax({
                    url: "/my/article/add",
                    method: "post",
                    data: formdata,
                    // 如果ajax请求发送的data是 FormData类型的则需要增加下面两个配置项
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        layer.msg(res.message)
                            // 完成后跳转到list页面
                        location.href = "/article/art_list.html"
                    }
                })

            })
    })

})