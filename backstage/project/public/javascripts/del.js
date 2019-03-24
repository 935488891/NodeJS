jQuery(function ($) {
    let obj = {};

    let fn4 = {
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

        del_search() {
            $("#btn_se").on('click', () => {
                obj = {};
                let name = $('#name_1').val();
                $.get('http://localhost:1000/users/find_per', { name: name },
                    (data) => {
                        console.log(data);
                        if (data.length >= 1) {
                            let str = data.map(function (item, idx) {
                                return `<tr class='guid_${idx}'>
                                        <td><input type='checkbox'/>${item._id}</td>
                                        <td class="0"><input type="text" value="${item.name}"></td>
                                        <td class="1"><input type="number" value="${item.age}"></td>
                                        <td class="2"><input type="text" value="${item.address}"></td>
                                        <td class="3"><input type="text" value="${item.rofessional}"></td>
                                        <td class="4"><input type="number" value="${item.contact}"></td>
                                    </tr>`
                            })
                            fn4.$content.html(str);
                        }
                        else if (data.length == 0) {
                            alert('未找到要删除人的信息');
                        }
                    }
                )
            })
        },

        del_delete() {
            $('#btn_3').on('click', function () {
                let drr = [];
                let ele = $(this).parent().prev().children('tbody').find(':checked');
                for (let i = 0; i < ele.length; i++) {
                    var _id = ele.eq(i).parent().text();
                    obj[`id_${i}`] = _id;
                    drr.push(ele.eq(i).parents('tr').attr('class'));
                }
                $.get('http://localhost:1000/users/del', obj,
                    (data) => {
                        console.log(obj);
                        if (data.n == 1) {
                            for (let i = 0; i < drr.length; i++) {
                                fn4.$content.children('.' + drr[`${i}`]).remove();
                            }
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
        let global = await fn4.token_s();
        if (global) {
            fn4.del_search();
            fn4.del_delete();
            fn4.get_img();
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