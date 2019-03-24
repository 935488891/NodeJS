jQuery(function ($) {

    let obj = {};
    let obj_id = {};

    let fn3 = {
        $content: $('.content'),

        token_s() {
            return new Promise((resolve, reject) => {
                let global = false;
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

        one_render() {
            $("#btn_se").on('click', () => {
                obj = {};
                obj_id = {};
                let name = $('#name_1').val();
                $.get('http://localhost:1000/users/find_per', { name: name },
                    (data) => {
                        if (data.length >= 1) {
                            let str = data.map(function (item) {
                                return `<tr>
                                    <td>${item._id}</td>
                                    <td class="0"><input type="text" value="${item.name}"></td>
                                    <td class="1"><input type="number" value="${item.age}"></td>
                                    <td class="2"><input type="text" value="${item.address}"></td>
                                    <td class="3"><input type="text" value="${item.rofessional}"></td>
                                    <td class="4"><input type="number" value="${item.contact}"></td>
                                </tr>`
                            })
                            fn3.$content.html(str);
                        }
                        else if(data.length == 0){
                            alert('未找到要修改人的信息');
                        }
                    }
                )
            })
        },

        con_click() {
            fn3.$content.on('click', 'input', function (event) {
                let brr = ['name', 'age', 'address', 'rofessional', 'contact'];
                event.stopPropagation();
                let valu = $(this).val();
                $(this).on('blur', function (e) {
                    e.stopPropagation();
                    console.log($(this));
                    if ($(this).val() != valu) {
                        let parent = $(this).parents('tr');
                        let id = parent.children().eq(0).html();
                        let idx = $(this).parent('td').attr('class');
                        obj[brr[idx]] = $(this).val();
                        obj_id._id = id;
                        console.log(obj);
                    }
                })
            })
        },

        one_update() {
            $('#btn_3').on('click', () => {
                $.get('http://localhost:1000/users/upd', { obj, obj_id },
                    (data) => {
                        if (data.nModified == 1) {
                            alert('信息修改成功');
                        } else {
                            alert('信息修改失败');
                        }
                    }
                )
            })
        },

        //头像渲染
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
        let global = await fn3.token_s();
        if (global) {
            fn3.one_render();
            fn3.con_click();
            fn3.one_update();
            fn3.get_img();
        } else {
            alert('登陆过期');
            location.href = './sign.html'
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