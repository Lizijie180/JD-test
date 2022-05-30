/*
 * @Author: lzj
 * @Date: 2022-05-29 18:28:39
 */
class Goods {

    constructor() {
        this.token = localStorage.getItem('token');
        this.id = localStorage.getItem('id');
        this.goodsId = localStorage.getItem('goodsId');
        this.isLogo = 0;

        //判断是否登录
        this.isLogin();
        //获取商品详细信息
        this.getGoods();
        // 我的购物车
        Goods.$('.searchBox .cartBtn span').addEventListener('click', this.goCartFn)
    }

    //渲染到页面
    appendHtml(data) {
        let fl = data.info.category;
        Goods.$('.title .center span').innerHTML = fl;
        let str = '';
        let info = data.info
        str = `
            <div class="bigChange">
                <div class="smallBox"></div>
                <img src="${info.img_big_logo}" alt="">
            </div>
            <div class="bigBox">
                <img src="${info.img_big_logo}" alt="">
            </div>
            <div class="textGoods">
                <p class="titleText">
                   ${info.title}
                </p>
                <div class="priceGoods">
                    优惠价：<span class="nowPrice">￥${info.current_price}</span>
                </div>
                <button>加入购物车</button>
            </div>
            `;
        Goods.$('.goods').innerHTML = str;
        //所有事件
        this.eveThing();
    }

    //所有事件
    eveThing() {
        //加入到购物车事件
        Goods.$('.goods .textGoods button').addEventListener('click', this.addCart);
        //鼠标移入事件
        Goods.$('.goods>.bigChange').addEventListener('mouseover', this.mouseOverFn);
        //鼠标移出事件
        Goods.$('.goods>.bigChange').addEventListener('mouseout', this.mouseOutFn);
        //鼠标移动事件
        Goods.$('.goods>.bigChange').addEventListener('mousemove', this.mouseMoveFn);
    }

    //加入购物车事件
    addCart = () => {
        let data = `id=${this.id}&goodsId=${this.goodsId}`
        if (this.isLogo == 1) {
            axios.post('http://localhost:8888/cart/add?', data).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    alert('加入购物车成功，点击确定跳转到购物车页面');
                    location.href = './cart.html';
                }
            })
        } else {
            alert('点击确定跳转登录页面');
            location.href = './login.html?goods.html';
        }
    }

    //鼠标移入事件
    mouseOverFn = () => {
        // console.log(1);
        Goods.$('.goods .bigChange .smallBox').style.display = 'block';
        Goods.$('.goods .bigBox').style.display = 'block';
    }

    //鼠标移出事件
    mouseOutFn = () => {
        // console.log(2);
        Goods.$('.goods .bigChange .smallBox').style.display = 'none';
        Goods.$('.goods .bigBox').style.display = 'none';
    }

    //鼠标移动事件
    mouseMoveFn = (eve) => {
        //获取鼠标距离文档页面左边和上边的距离
        let mouseX = eve.pageX;
        let mouseY = eve.pageY;
        //获取盒子距离父元素的距离
        let getSmallL = Goods.$('.goods').offsetLeft;
        let gerSmallT = Goods.$('.goods').offsetTop;
        //获取遮罩的宽高
        let setSmallW = Goods.$('.goods .smallBox').offsetWidth;
        let setSmallH = Goods.$('.goods .smallBox').offsetHeight;
        //设置遮罩左边和上边距离盒子的坐标
        let xSpace = mouseX - getSmallL - setSmallW / 2;
        let ySpace = mouseY - gerSmallT - setSmallH / 2;
        //设置遮罩距离左边和上边的最大距离
        let maxL = Goods.$('.goods .bigChange').offsetWidth - setSmallW;
        let maxT = Goods.$('.goods .bigChange').offsetHeight - setSmallH;
        //设置右边的图片距离左边和上边移动的最大距离
        let bigMaxL = Goods.$('.goods .bigBox>img').offsetWidth - Goods.$('.goods .bigBox').offsetWidth;
        let bigMaxT = Goods.$('.goods .bigBox>img').offsetHeight - Goods.$('.goods .bigBox').offsetHeight;

        //判断遮罩距离盒子的距离
        if (xSpace < 0) {
            Goods.$('.goods .smallBox').style.left = 0 + 'px';
        } else if (xSpace > maxL) {
            Goods.$('.goods .smallBox').style.left = maxL + 'px'
        } else {
            Goods.$('.goods .smallBox').style.left = xSpace + 'px'
        }

        //判断遮罩距离盒子的距离
        if (ySpace < 0) {
            Goods.$('.goods .smallBox').style.top = 0 + 'px';
        } else if (ySpace > maxT) {
            Goods.$('.goods .smallBox').style.top = maxT + 'px'
        } else {
            Goods.$('.goods .smallBox').style.top = ySpace + 'px'
        }

        //根据比例求右边盒子内的图片移动距离
        Goods.$('.goods .bigBox>img').style.left = - Goods.$('.goods .smallBox').offsetLeft / maxL * bigMaxL + 'px';
        Goods.$('.goods .bigBox>img').style.top = -Goods.$('.goods .smallBox').offsetTop / maxT * bigMaxT + 'px';
    }

    //去购物车界面
    goCartFn = () => {
        if (this.isLogo == 1) {
            location.href = './cart.html';
        } else {
            alert('点击确定跳转登录页面');
            location.href = './login.html?goods.html';
        }
    }

    //将购物车内的商品数量渲染到页面
    getCartNum() {
        axios.defaults.headers.common['authorization'] = this.token;
        axios.get('http://localhost:8888/cart/list?id=' + this.id).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                Goods.$('.poaGouWu').innerHTML = data.cart.length;
            }
        })
    }

    //获取商品详细信息
    getGoods() {
        axios.get('http://localhost:8888/goods/item?id=' + this.goodsId).then(res => {
            let { status, data } = res;
            if (status = 200 && data.code == 1) {
                //渲染到页面
                this.appendHtml(data);
            }
        })
    }

    //判断是否登录
    isLogin() {
        //登录后做的事
        if (!this.token && !this.id) {
            //如果没登录
            Goods.$('.headerRi>.true_login').classList.remove('active');
            Goods.$('.headerRi>.no_login').classList.add('active');
            this.isLogo = 0;
        } else {
            //如果登录，获取用户信息
            axios.defaults.headers.common['authorization'] = this.token;
            axios.get('http://localhost:8888/users/info/' + this.id).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    this.isLogo = 1;
                    //如果登录成功就渲染样式
                    this.loginTrue(data);
                }
            })
        }
    }

    //如果登录就渲染
    loginTrue(data) {
        Goods.$('.headerRi>.no_login').classList.remove('active');
        Goods.$('.headerRi>.true_login').classList.add('active');
        //获取用户昵称，追加到页面中
        Goods.$('.true_login a').innerHTML = data.info.nickname;

        //获取购物车数量
        //获取购物车的数量
        this.getCartNum();
    }

    //获取节点的方法
    static $(tag) {
        let a = document.querySelectorAll(tag)
        return a.length == 1 ? a[0] : a;
    }

}

new Goods;