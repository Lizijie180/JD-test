/*
 * @Author: lzj
 * @Date: 2022-05-27 12:18:43
 */
// 登录页面
class Logo {
    constructor() {
        this.href = location.search.split('?')[1];
        // 点击事件
        this.eleData();

    }

    eleData() {
        //点击扫码、账户登录显示的互换
        Logo.$('.loginText').addEventListener('click', this.cliFn);

        //点击登录
        Logo.$('button').addEventListener('click', this.btnFn);
    }

    //显示互换的方法
    cliFn = (eve) => {
        // console.log(eve.target);
        if (eve.target.className == 't1') {
            Logo.$('.loginText>.t1').classList.add('active');
            Logo.$('.loginText>.t1+span').classList.remove('active');
            Logo.$('.loginBox>.scan').classList.add('active');
            Logo.$('.loginBox>form').classList.remove('active');
        } else if (eve.target.className == 't2') {
            Logo.$('.loginText>.t1').classList.remove('active');
            Logo.$('.loginText>.t1+span').classList.add('active');
            Logo.$('.loginBox>.scan').classList.remove('active');
            Logo.$('.loginBox>form').classList.add('active');
        }
    }

    //点击登录
    btnFn = (eve) => {
        //停止默认行为
        eve.preventDefault();
        //获取文本框内容
        let username = Logo.$('#user').value.trim();
        let password = Logo.$('#pwd').value.trim();
        if (!username || !password) {
            alert('不能为空')
        }
        //开始验证
        this.startJudge(username, password);



    }

    //开始验证
    startJudge(username, password) {
        let thisLogin = this;
        //显示验证框   
        Logo.$('.judge').style.opacity = '1';
        var diff = 0;
        var maxX = Logo.$('.judge .long').offsetWidth - Logo.$('.judge .small').offsetWidth
        Logo.$('.judge .small').onmousedown = function (eve) {
            let startX = eve.clientX;
            document.onmousemove = function (eve) {
                let nowX = eve.clientX;
                diff = nowX - startX;
                if (diff < 0) {
                    diff = 0;
                } else if (diff >= maxX) {
                    diff = maxX;
                }
                Logo.$('.judge .small').style.left = diff + 'px';
                Logo.$('.judge .change').style.width = diff + 44 + 'px';
            }
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            if (diff < maxX) {
                Logo.$('.judge .small').style.left = 0 + 'px';
                Logo.$('.judge .change').style.width = 44 + 'px';
            } else {
                Logo.$('.judge .small').onmousedown = null;
                Logo.$('.judge').style.opacity = '0';
                Logo.$('.judge .small').style.left = 0 + 'px';
                Logo.$('.judge .change').style.width = 44 + 'px';
                //验证成功，发送请求
                thisLogin.isJudgeFn(username, password);
            }
        }

    }

    //验证成功后的方法
    isJudgeFn(username, password) {
        let data = `username=${username}&password=${password}`
        axios.post('http://localhost:8888/users/login', data).then(res => {
            let { status, data } = res;
            //如果登录成功，设置token，用户id，并跳转来的页面
            if (status == 200 && data.code == 1) {
                //设置token，id
                localStorage.setItem('token', data.token);
                localStorage.setItem('id', data.user.id);
                alert('登录成功，点击确定跳转页面')
                //返回之前页面
                if (this.href) {
                    location.href = this.href;
                    return
                }
                location.href = './index.html'
            } else {
                //显示不匹配，请重新输入
                Logo.$('.noLogo').style.display = 'block'
            }
        })
    }


    static $(tag) {
        let tagArr = document.querySelectorAll(tag);
        return tagArr.length == 1 ? tagArr[0] : tagArr;
    }

}

new Logo;