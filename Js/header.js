/*
 * @Author: lzj
 * @Date: 2022-05-23 11:44:35
 */
// 首页js


//头部鼠标移入事件
class Index {
    constructor() {
        this.token = localStorage.getItem('token');
        this.id = localStorage.getItem('id');
        this.city = localStorage.getItem('city')
        if (this.city) {
            Index.$('.nowCity span').innerHTML = this.city;
        }

        //城市内部点击事件
        Index.$('.hoverCity>ul').addEventListener('click', this.headerClick.bind(this));
        //判断是否登录
        this.isLogin();
    }

    //城市点击
    headerClick(eve) {
        //判断是否点击的li
        if (eve.target.nodeName == 'LI') {
            //获取点击的文本内容
            this.nowText = eve.target.innerHTML;
            //将获取的内容放到上面，渲染
            Index.$('.nowCity>span').innerHTML = this.nowText;
            Index.$('.hoverCity .active').classList.remove('active')
            eve.target.className = 'active';
            this.city = localStorage.setItem('city', this.nowText);
            location.reload()
        }
    }

    //判断是否登录
    isLogin() {
        //登录后做的事
        if (!this.token && !this.id) {
            //如果没登录
            Index.$('.headerRi>.true_login').classList.remove('active');
            Index.$('.headerRi>.no_login').classList.add('active');
        } else {
            //如果登录，获取用户信息
            axios.defaults.headers.common['authorization'] = this.token;
            axios.get('http://localhost:8888/users/info/' + this.id).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    Index.$('.headerRi>.no_login').classList.remove('active');
                    Index.$('.headerRi>.true_login').classList.add('active');
                    //获取用户昵称，追加到页面中
                    Index.$('.true_login a').innerHTML = data.info.nickname;
                }
            })


        }





    }

    static $(tag) {
        let a = document.querySelectorAll(tag)
        return a.length == 1 ? a[0] : a;
    }

}

new Index