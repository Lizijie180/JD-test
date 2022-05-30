/*
 * @Author: lzj
 * @Date: 2022-05-27 20:03:27
 */
class Modify {

    constructor() {
        this.token = localStorage.getItem('token');
        this.id = localStorage.getItem('id');
        this.href = location.search.split('?')[1];
        this.getUser();
        //给修改按钮绑定点击事件
        Modify.$('button').addEventListener('click', this.modifyFn);
    }

    //获取用户数据
    getUser() {
        axios.defaults.headers.common['authorization'] = this.token;
        axios.get('http://localhost:8888/users/info/' + this.id).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                Modify.$('.headerRi>.true_login>a').innerHTML = data.info.nickname;
                Modify.$('.loginBox .nickname').value = data.info.nickname;
                Modify.$('.loginBox .user').disabled = 'false';
                Modify.$('.loginBox .user').value = data.info.username;
            }
        })
    }

    //修改密码的方法
    modifyFn = eve => {
        //阻止默认行为
        eve.preventDefault();
        //获取文本框内容
        this.nickname = Modify.$('.loginBox .nickname').value.trim();
        this.oldPassword = Modify.$('.loginBox .pwd').value.trim();
        this.newPassword = Modify.$('.loginBox .newpwd').value.trim();
        this.rNewPassword = Modify.$('.loginBox .repwd').value.trim();
        if (!this.nickname) {
            alert('不能为空');
        }

        axios.defaults.headers.common['authorization'] = this.token;
        let data = `id=${this.id}&nickname=${this.nickname}`
        axios.post('http://localhost:8888/users/update/', data).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                //修改密码---如果是空的，就是不修改密码，如果不是空的，再发送修改密码的请求
                if (!this.oldPassword || !this.newPassword || !this.rNewPassword) {
                    alert('修改成功，点击确定跳转页面')
                    if (this.href) {
                        location.href = this.href;
                        return
                    }
                    location.href = './index.html'
                } else {
                    this.modefyPwd();
                }
            }
        })
    }

    //
    modefyPwd() {
        axios.defaults.headers.common['authorization'] = this.token;
        let data = `id=${this.id}&nickname=${this.nickname}&oldPassword=${this.oldPassword}&newPassword=${this.newPassword}&rNewPassword=${this.rNewPassword}`
        axios.post('http://localhost:8888/users/rpwd/', data).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                //删除本地设置的token，id
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                alert('修改成功，点击确定跳转页面')
                if (this.href) {
                    location.href = this.href;
                    return
                }
                location.href = './index.html';
            }
        })
    }


    static $(tag) {
        let tagArr = document.querySelectorAll(tag);
        return tagArr.length == 1 ? tagArr[0] : tagArr;
    }
}

new Modify;
