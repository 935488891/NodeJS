jQuery(function ($) {

    let fn2 = {
        $content: $('.content'),
        btn_1: $('#btn_1'),

        //校验token
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

        //选择创建信息表格的行数
        create_tab() {
            fn2.btn_1.on('click', () => {
                let num = fn2.btn_1.val();
                if (num <= 1) {
                    fn2.btn_1.val(1);
                }
            })
        },

        //生成n行表格
        generate() {
            $('#btn_2').on('click', () => {
                let num = Number(fn2.btn_1.val());
                let str = '';
                for (let i = 0; i < num; i++) {
                    str += `<tr class= guid_${i}>
                            <td><input type="text"></td>
                            <td><input type="number"></td>
                            <td><input type="text"></td>
                            <td><input type="text"></td>
                            <td><input type="number" class="tel"><span></span></td>
                        </tr>`
                }
                fn2.$content.html(str);
                fn2.tel();
            })
        },

        //电话正则
        tel() {
            $('.tel').blur(function () {
                let valu = $(this).val()
                if (!/^1[3-8]\d{9}$/.test(valu)) {
                    $(this).next().html('电话号码错误');
                } else {
                    $(this).next().html('');
                }
            })
        },

        //信息提交
        submits() {
            $('#btn_3').on('click', () => {
                let arr = [];
                let brr = ['name', 'age', 'address', 'rofessional', 'contact'];
                let num = Number(fn2.btn_1.val());
                for (i = 0; i < num; i++) {
                    let $guid = $(`.guid_${i}`);
                    let child = $guid.find('input');
                    let obj = {};
                    for (j = 0; j < child.length; j++) {
                        if (child.eq(j).val() == '') {
                            break;
                        } else {
                            obj[brr[j]] = child.eq(j).val();
                        }
                        if (j == 4) {
                            arr.push(obj);
                        }
                    }
                }
                $.get('http://localhost:1000/users/add', { arr: arr },
                    function (data) {
                        let ass = data.ops.length;
                        let num_1 = num - ass;
                        alert(`${ass}条信息提交成功，${num_1}条信息提交失败`);
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
        let global = await fn2.token_s();
        if (global) {
            fn2.tel();
            fn2.create_tab();
            fn2.generate();
            fn2.submits();
            fn2.get_img();
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
