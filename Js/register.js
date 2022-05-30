/*
 * @Author: lzj
 * @Date: 2022-05-27 16:00:33
 */
class Register {

    constructor() {
        this.getUser();
    }

    getUser() {
        Register.$('button').addEventListener('click', this.regiFn);
    }

    regiFn = (eve) => {
        eve.preventDefault();
        let form = document.forms[0];
        let username = form.user.value;
        let password = form.pwd.value;
        let rpassword = form.repwd.value;
        let nickname = form.nickname.value;
        if (!username || !password || !rpassword || !nickname) {
            alert('不能为空')
        }
        let data = `username=${username}&password=${password}&rpassword=${rpassword}&nickname=${nickname}`;
        axios.post('http://localhost:8888/users/register/', data).then(res => {
            console.log(res);
            let { status, data } = res
            if (status == 200 && data.code == 1) {
                location.href = './login.html';
            } else {
                let str = data.message;
                Register.$('.bannerImg .noLogo div').innerHTML = str;
                Register.$('.bannerImg .noLogo').style.display = 'block'
            }
        })
    }



    static $(tag) {
        let tagArr = document.querySelectorAll(tag);
        return tagArr.length == 1 ? tagArr[0] : tagArr;
    }
}

new Register;