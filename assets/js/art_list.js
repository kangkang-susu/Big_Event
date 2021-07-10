const form = layui.form
$(function() {
    // 获取用于完成分页功能的laypage对象
    var laypage = layui.laypage
    var layer = layui.layer
        // 因为发送请求，没有返回的数据，于是使用临时的res对象模拟渲染效果
    let tmpres = {
            "status": 0,
            "message": "获取文章列表成功！",
            "data": [{
                    "Id": 1,
                    "title": "abab",
                    "pub_date": "2020-01-03 12:19:57.690",
                    "state": "已发布",
                    "cate_name": "最新"
                },
                {
                    "Id": 2,
                    "title": "666",
                    "pub_date": "2020-01-03 12:20:9.817",
                    "state": "已发布",
                    "cate_name": "股市"
                }
            ],
            "total": 5
        }
        // 定义之后发送请求所需要的使用的 请求对象
    let querryobj = {
            pagenum: 1,
            pagesize: 2,
            cate_id: "1",
            state: ""
        }
        // 添加时间格式的过滤器
    template.defaults.imports.dataFormat = function(date) {
        let todate = new Date(date)
        let y = todate.getFullYear()
        let m = constrZero(todate.getMonth() + 1)
        let dd = constrZero(todate.getDate())
        let hh = constrZero(todate.getHours())
        let mm = constrZero(todate.getMinutes())

        let ss = constrZero(todate.getSeconds())
        return y + "-" + m + "-" + dd + " " + hh + ":" + mm + ":" + ss + "."


    }
    initartList()
    initcateSelected()

    // 监听事件
    $("#seachForm").on("submit", function(e) {
        e.preventDefault()
            // console.log("submit")
        var cate_id = $("#seachForm select[name='cate_id']").val()
        var state = $("#seachForm select[name='state']").val()

        console.log(cate_id)
        console.log(state)
        querryobj.cate_id = cate_id
        querryobj.state = state
        initartList()
    })

    // 为文章列表中的编辑按钮，删除按钮添加事件代理
    $("tbody").on("click", ".layui-btn-danger", function() {
        // console.log("delete")
        var Id = $(this).attr("art-id")
            // console.log(Id)
        $.ajax({
            url: "/my/article/delete/" + Id,
            method: "get",
            success: function(res) {
                // console.log(res)
                layer.msg(res.message)
                if (res.status == 0) {
                    // 通过检测文章列表板块中的tr元素的数量 判断是否删除到了当前页的最后一个数据
                    let len = $("tbody tr").length
                    querryobj.pagenum = len > 1 ? querryobj.pagenum : (querryobj.pagenum > 1 ? querryobj.pagenum - 1 : 1)
                    initartList()
                    return
                }
            }
        })
    })


    // 定义对发布时间中的时间中的月，日，时，分等进行自动补0操作的函数
    function constrZero(data) {
        return data > 9 ? data : "0" + data
    }
    // 定义发送获取文章列表请求
    function initartList() {
        $.ajax({
            url: "/my/article/list",
            method: "get",
            data: querryobj,
            success: function(res) {
                console.log(res)
                    // console.log(querryobj)
                    // let artlist = template("artList", tmpres)
                var artList = template("artList", res)
                $("tbody").html(artList)
                renderPage(res.total)
            }
        })
    }
    // 定义动态初始化文章分类下拉表单的函数
    function initcateSelected() {
        $.ajax({
            url: "/my/article/cates",
            method: "get",
            success: function(res) {
                // console.log(res)
                var selected = template("art_cate_selected", res)
                $("select[name='cate_id']").html(selected)
                    // 在这个地方直接将动态获取的opthion元素放在selected标签中，layui监听不到其中的变化所以不会进行渲染
                    // 此处需要通过render方法进行手动渲染
                    // 将form表单域中的元素进行重新渲染
                form.render()
            }
        })


    }
    // 定义渲染分页的函数
    function renderPage(total) {
        // console.log("renderpage")
        laypage.render({
            elem: 'Page', //注意，这里的 Page 是 ID，不用加 # 号,
            count: total,
            // limit: querryobj.pagesize,
            // curr: querryobj.pagenum
            limit: querryobj.pagesize,
            curr: querryobj.pagenum,
            limits: [2, 4, 5, 7],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // jump回调函数，当分页组件触发页面切换的事件时就会触发jump回调函数
            // 注意:jump回调函数并不是只在发生分页切换的时候才执行，在分页组件初始化渲染的时候也会调用一次jump回调函数
            // 当limits 发生切换时 也会调用jump回调函数
            jump: function(obj, first) {
                // 我们可以通过返回的obj对象获取此时分页组件中的相关信息
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                querryobj.pagenum = obj.curr
                    // 获取每页需要显示的数据数量 limit
                querryobj.pagesize = obj.limit
                    // 将分页组件中的页码值拿到后不能直接调用初始化文章列表的函数，这样会进入死循环
                    // 在这里我们通过返回的first参数作为我们判断jump回调函数
                    // 调用方式的依据，first为true则表示jump函数是通过分页组件初始化渲染触发的
                    // first为undefine则表示，jump函数是通过触发分页切换事件触发的

                // 1.直接调用artlist初始化渲染方法，造成死循环
                // initartList()

                //2. 解决jump回调函数触发死循环的方式
                if (first == undefined) {
                    initartList()
                }
            }
        });

    }
})