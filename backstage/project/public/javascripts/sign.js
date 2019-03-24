jQuery(function ($) {
    let $email = $('#inputEmail');
    let $password = $('#inputPassword');
    let $btn = $('#btn');

    let fn = {
        
        token_s() {
            return new Promise((resolve, reject) => {
                let global = true;
                if (localStorage.getItem('token')) {
                    let data = localStorage.getItem('token');
                    $.post('http://localhost:1000/users/tokens',
                        { key: data },
                        function (data) {
                            data.show ? global = false : global = true;
                            resolve(global);
                        }
                    )
                }else{
                    resolve(global);
                }
            })
        },

        blur() {
            $email.blur(() => {
                let _$email = $email.val();
                let sp1 = $('#sp1');
                if (!/^[a-zA-Z][\w\-\.]*@[\da-z\-]{1,63}(\.[a-z]{2,3})+$/.test(_$email)) {
                    sp1.html("你的用户名不满足条件");
                } else {
                    $.post('http://localhost:1000/users/find_user',
                        { name: _$email },
                        (data) => { sp1.html(data) }
                    )
                }
            })
        },

        click() {
            $btn.on('click', () => {
                let _$email = $email.val();
                let _$password = $password.val();
                $.post('http://localhost:1000/users/find_pass',
                    { name: _$email, password: _$password },
                    (data) => {
                        if (data.show == 1) {
                            localStorage.setItem('token', data.token2);
                            location.href = './list.html';
                            console.log(data);
                        }else{
                            alert('密码错误');
                        }
                    }
                )
            })
        }
    };
    (async function () {
        let global = await fn.token_s();
        if (global) {
            fn.blur();
            fn.click();
        }else{
            location.href = './list.html';
        }
    })()
})