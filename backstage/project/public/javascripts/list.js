jQuery(function ($) {
    
    let fn1 = {
        imgurl: "Upload\\abc-1547109905835.jpg",
        $content : $('.content'),

        token_s() {
            let global = false;
            return new Promise((resolve, reject) => {
                if (localStorage.getItem('token')) {
                    $.post('http://localhost:1000/users/tokens',
                        { key: localStorage.getItem('token') },
                        function (data) {
                            data.show ? global = true : global = false;
                            resolve(global);
                        }
                    )
                }
            })
        },

        all_rander() {
            //所有信息渲染
            $.get('http://localhost:1000/users/find_all',
                (data) => {
                    let str = data.map(function (item) {
                        return `<tr class="row">
                        <td class=" col-xs-2 ">${item._id}</td>
                        <td class=" col-xs-2 ">${item.name}</td>
                        <td class=" col-xs-2 ">${item.age}</td>
                        <td class=" col-xs-2 ">${item.address}</td>
                        <td class=" col-xs-2 ">${item.rofessional}</td>
                        <td class=" col-xs-2 ">${item.contact}</td>
                    </tr>`
                    })
                    fn1.$content.html(str);
                }
            )
        },

        one_rander() {
            //搜索个人信息
            $("#btn_se").on('click', () => {
                let name = $('#name_1').val();
                $.get('http://localhost:1000/users/find_per', { name: name },
                    (data) => {
                        if (data.length >= 1) {
                            let str = data.map(function (item) {
                                return `<tr class="row">
                                        <td class=" col-xs-2 ">${item._id}</td>
                                        <td class=" col-xs-2 ">${item.name}</td>
                                        <td class=" col-xs-2 ">${item.age}</td>
                                        <td class=" col-xs-2 ">${item.address}</td>
                                        <td class=" col-xs-2 ">${item.rofessional}</td>
                                        <td class=" col-xs-2 ">${item.contact}</td>
                                    </tr>`
                            })
                            fn1.$content.html(str);
                        }
                        else if (data.length == 0) {
                            alert('未找到要查找人的信息');
                        }
                    }
                )
            })
        },

        upload() {
            let file = $('#file')[0];
            
            file.onchange = function () {
                //构造form数据 你可以用它传输文件流 它是基于form-data的传输方案
                var data = new FormData();
                // 单图上传，默认选第一张，如果是多图的话，就要for循环遍历fileNode.files数组，并全部append到data里面传输
                data.append("abc", file.files[0]);
                console.log(file.files[0]);
                console.log(data);
                $.ajax({
                    url: 'http://localhost:1000/users/file_show',
                    type: 'POST',
                    cache: false, //不必须
                    data,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        let imgurl = data.file.filename;
                        fn1.img_save(imgurl);
                        $('#img_path').attr('src', `http://localhost:1000/${imgurl}`);
                    }
                })
            }
        },

        img_save(path) {
            $.get('http://localhost:1000/users/imgurl',
                { imgurl: path, img_token: localStorage.getItem('token') }
            )
        },

        get_img() {
            $.get('http://localhost:1000/users/get_img',
                { img_token: localStorage.getItem('token') },
                (res) => {
                    $('#img_path').attr('src', `http://localhost:1000/${res}`);
                }
            )
        }

    };

    (async () => {
        let global = await fn1.token_s();
        if (global) {
            fn1.all_rander();
            fn1.one_rander();
            fn1.upload();
            fn1.get_img();
        } else {
            alert('登陆过期');
            location.href = './sign.html';
        }
    })()

    let all = $('#all');
    let add = $('#add');
    let del = $('#del');
    let upd = $('#upd');
    all.on('click', () => {
        location.href = './list.html';
    })
    add.on('click', () => {
        location.href = './add.html';
    })
    del.on('click', () => {
        location.href = './del.html';
    })
    upd.on('click', () => {
        location.href = './update.html';
    })

})