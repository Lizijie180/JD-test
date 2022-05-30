/*
 * @Author: lzj
 * @Date: 2022-05-23 19:14:40
 */
// 首页
class Index1 {

    //定义大轮播图所需属性
    nowN = 0;    //现在的第几个图片
    lastN = 0;    //上一个是第几个图片
    timesImg = '';   //大定时器
    //定义小轮播图所需属性
    nowSmallN = 0;    //现在的第几个图片
    lastSmallN = 0;    //上一个是第几个图片
    timeSmallImg = ''; //右侧小定时器
    timesGo = '';    //走马灯定时器
    x = 0;    //走马灯位移
    cont = 0;   //走马灯计数

    constructor() {
        this.token = localStorage.getItem('token');
        this.id = localStorage.getItem('id');
        //事件
        this.thingAll();
        //商品走马灯
        this.getGoodsLight();
        //京东秒杀
        this.endTime();
        //判断是否登录
        this.isLogin();

    }

    //各种事件
    thingAll() {
        //中间大轮播图
        //点击图片自动刷新
        Index1.$('.searchBox .searchLe img').addEventListener('click', this.imgCliFn.bind(this));
        Index1.$('.searchBox .searchRi img').addEventListener('click', this.imgCliFn.bind(this));
        //轮播图左右翻页
        Index1.$('.autoImg>.rightImg').addEventListener('click', this.rightCliImg.bind(this));
        Index1.$('.autoImg>.leftImg').addEventListener('click', this.leftCliImg.bind(this));
        //轮播图索引翻页
        Index1.$$('.autoImg>ol>li').forEach((ele, key) => {
            ele.addEventListener('mouseover', this.oloverFn.bind(this, key));
        });
        //自动播放轮播图事件
        this.autoImgFn();
        //移入暂停自动播放
        Index1.$('.autoImg').addEventListener('mouseover', this.stopAutoImg.bind(this));
        //移出开始自动播放
        Index1.$('.autoImg').addEventListener('mouseout', this.startAutoImg.bind(this));

        //右侧小轮播图
        //轮播图左右翻页
        Index1.$('.grop-img>.rightImg').addEventListener('click', this.rightCliImgSmall.bind(this));
        Index1.$('.grop-img>.leftImg').addEventListener('click', this.leftCliImgSmall.bind(this));

        //自动播放轮播图事件
        this.autoImgSmallFn();
        //移入暂停自动播放
        Index1.$('.grop-img').addEventListener('mouseover', this.stopAutoImgSmall.bind(this));
        //移出开始自动播放
        Index1.$('.grop-img').addEventListener('mouseout', this.startAutoImgSmall.bind(this));

        //点击退出则 退出登录
        Index1.$('.top_text>.ul2 a').addEventListener('click', this.exitFn);
    }


    //判断是否登录，设置用户名，购物车内容数量
    isLogin() {
        //登录后做的事
        if (!this.token && !this.id) {
            //如果没登录
            Index1.$('.top_text>.span2').classList.remove('active');
            Index1.$('.top_text>.span1').classList.add('active');
            Index1.$('.top_text>.ul2').classList.remove('active');
            Index1.$('.top_text>.ul1').classList.add('active');
            Index1.$('.searchCenTop form+div').addEventListener('click', this.isCartFn.bind(this, 0));
        } else {
            //如果登录，获取用户信息
            axios.defaults.headers.common['authorization'] = this.token;
            axios.get('http://localhost:8888/users/info/' + this.id).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    Index1.$('.top_text>.span1').classList.remove('active');
                    Index1.$('.top_text>.span2').classList.add('active');
                    Index1.$('.top_text>.ul1').classList.remove('active');
                    Index1.$('.top_text>.ul2').classList.add('active');
                    //获取用户昵称，追加到页面中
                    Index1.$('.top_text>.span2').innerHTML = 'Hi~ ' + data.info.nickname;

                    //登录的话，设置购物车的数量
                    this.getCartNum();
                    //点击我的购物车判断是否登录
                    Index1.$('.searchCenTop form+div').addEventListener('click', this.isCartFn.bind(this, 1));
                }
            })
        }
    }

    //跳转登录页或者事购物车页面
    isCartFn(isTrue) {
        if (isTrue) {
            location.href = './cart.html';
        } else {
            alert('您未登录，请点击确定跳转登录页面');
            location.href = './login.html?index.html';
        }
    }

    //获取购物车的数量
    getCartNum() {
        axios.defaults.headers.common['authorization'] = this.token;
        axios.get('http://localhost:8888/cart/list?id=' + this.id).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                Index1.$('.poaGouWu').innerHTML = data.cart.length;
            }
        })
    }

    //退出登录
    exitFn = () => {
        axios.defaults.headers.common['authorization'] = this.token;
        axios.get('http://localhost:8888/users/logout/' + this.id).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                //退出成功则删除token，id
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                //刷新页面
                location.href = './login.html'
            }
        })
    }

    //搜索框点击自动刷新
    imgCliFn() {
        location.reload();
    }

    //大轮播图
    rightCliImg() {    //点击右
        this.lastN = this.nowN;
        this.nowN++;

        if (this.nowN == 8) {
            this.nowN = 0
        }
        this.changeImg();
    }

    leftCliImg() {   //点击左
        this.lastN = this.nowN;
        this.nowN--;

        if (this.nowN == -1) {
            this.nowN = 7;
        }
        this.changeImg();
    }

    oloverFn(key) {    //移入小点点
        this.lastN = this.nowN;
        this.nowN = key;

        this.changeImg();
    }

    //暂停自动播放
    stopAutoImg() {
        clearInterval(this.timesImg);
    }
    //开始自动播放
    startAutoImg() {
        this.autoImgFn();
    }

    //自动播放的方法
    autoImgFn() {
        this.timesImg = setInterval(function name(params) {
            this.rightCliImg();
        }.bind(this), 3000)
    }

    //轮播图更改的方法
    changeImg() {
        Index1.$$('.autoImg>ul>li')[this.nowN].className = 'go';
        Index1.$$('.autoImg>ul>li')[this.lastN].className = '';
        Index1.$$('.autoImg>ol>li')[this.nowN].className = 'changeW';
        Index1.$$('.autoImg>ol>li')[this.lastN].className = '';
    }



    //**************************小轮播图
    rightCliImgSmall() {
        this.lastSmallN = this.nowSmallN;
        this.nowSmallN++;

        if (this.nowSmallN == 3) {
            this.nowSmallN = 0
        }
        this.changeImgSmall();
    }

    leftCliImgSmall() {
        this.lastSmallN = this.nowSmallN;
        this.nowSmallN--;

        if (this.nowSmallN == -1) {
            this.nowSmallN = 2;
        }
        this.changeImgSmall();
    }

    oloverFnSmall(key) {
        this.lastSmallN = this.nowSmallN;
        this.nowSmallN = key;
        this.changeImgSmall();
    }

    //暂停自动播放
    stopAutoImgSmall() {
        clearInterval(this.timeSmallImg);
        Index1.$('.grop-img>.leftImg').classList.add('show');
        Index1.$('.grop-img>.rightImg').classList.add('show');

    }
    //开始自动播放
    startAutoImgSmall() {
        this.autoImgSmallFn();
        Index1.$('.grop-img>.leftImg').classList.remove('show');
        Index1.$('.grop-img>.rightImg').classList.remove('show');
    }

    //自动播放的方法
    autoImgSmallFn() {
        this.timeSmallImg = setInterval(function () {
            this.rightCliImgSmall();
        }.bind(this), 5000)
    }

    //轮播图更改的方法
    changeImgSmall() {
        Index1.$$('.grop-img>ul')[this.nowSmallN].className = 'goRi';
        Index1.$$('.grop-img>ul')[this.lastSmallN].className = '';
    }


    /**************走马灯*******************/
    //获取商品列表
    getGoodsLight() {
        axios.get('http://localhost:8888/goods/list?pagesize=12').then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                this.addGoodsUl(data.list);
            } else {
                throw new Error('获取商品列表失败');
            }
        })
    }

    // 将获取的数据图片标题追加到走马灯中
    addGoodsUl(arr) {
        let str = '';
        let str1 = '';
        arr.forEach(ele => {
            str += `
            <li data-id='${ele.goods_id}'>
                <img src="${ele.img_big_logo}" alt="">
                <span class="title">${ele.title}</span>
             </li>
            `;
            str1 +=
                `
                <li data-id='${ele.goods_id}'>
                    <img src="${ele.img_big_logo}" alt="">
                    <div class="titleSmall">
                        <p>${ele.title}</p>
                    </div>
                </li>
            `;
        });
        Index1.$('.clickImg>ul').innerHTML = str;
        Index1.$('.bannerSmBox .bannerBox>ul').innerHTML = str1;

        //追加后干的事
        this.afterAppend();
    }

    //追加后干的事
    afterAppend() {
        //走马灯开始
        this.autoGo();
        //鼠标放上去
        Index1.$('.clickImg>ul').addEventListener('mouseover', this.mouseOverFn.bind(this));
        //鼠标移出
        Index1.$('.clickImg>ul').addEventListener('mouseout', this.mouseOutFn.bind(this));
        //走马灯点击获取信息并跳转
        Index1.$('.clickImg ul').addEventListener('click', this.clickFn.bind(this));
        //走马灯下面点击获取信息并跳转
        Index1.$('.bannerSmBox ul').addEventListener('click', this.clickFn.bind(this));
    }

    //走马灯效果
    autoGo() {
        this.timesGo = setInterval(() => {
            let ul = Index1.$('.clickImg>ul');
            this.x -= 1;
            ul.style.left = this.x + 'px';
            if (this.cont % 200 == 0) {
                let liArr = ul.querySelectorAll('li');
                let addId = liArr[this.cont / 200].dataset.id;
                let first = liArr[this.cont / 200].innerHTML;
                var li = document.createElement('li');
                li.innerHTML = first;
                li.dataset.id = addId;
                ul.appendChild(li);
            }
            this.cont++;
        }, 20)

    }

    //鼠标移入事件
    mouseOverFn() {
        clearInterval(this.timesGo);
    }

    //鼠标移出事件
    mouseOutFn() {
        this.autoGo();
    }

    //点击获取信息
    clickFn(eve) {
        let target = eve.target;
        if (target.parentNode.nodeName == 'LI' || target.nodeName == 'LI') {
            let id = target.parentNode.dataset.id ? target.parentNode.dataset.id : target.dataset.id;
            this.getGoodeGo(id)
        } else if (target.parentNode.parentNode.nodeName == 'LI' && target.nodeName == 'P') {
            let id = target.parentNode.parentNode.dataset.id
            this.getGoodeGo(id)
        }
    }

    //获取商品信息并跳转
    getGoodeGo(id) {
        axios.get('http://localhost:8888/goods/item/' + id).then(res => {
            localStorage.setItem('goodsId', id);
            location.href = './goods.html';
        });
    }

    //秒杀方法
    endTime() {

        setInterval(() => {
            this.runTime();
        }, 1000)
    }

    runTime() {
        let nowTime = new Date();
        let hours = nowTime.getHours();
        if (hours % 2) {
            hours--
        }
        //追加到页面
        if (hours < 10) {
            hours = '0' + hours;
        }
        Index1.$('.startTime').innerHTML = hours;

        let setTime = new Date();
        setTime.setHours(hours);
        setTime.setMinutes(0);
        setTime.setSeconds(0);
        //当前时间和预计时间的差值
        let diff = (+setTime) - (+nowTime);
        let hour = (2 + parseInt(diff / (60 * 60 * 1000))) == 1 ? 0 : 1;
        let mintes = 59 + parseInt((diff / 1000) % (60 * 60) / 60);
        let seco = 59 + parseInt((diff / 1000) % 60);
        if (mintes < 10) {
            mintes = '0' + mintes;
        }

        if (seco < 10) {
            seco = '0' + seco;
        }
        Index1.$('.hoursTime').innerHTML = '0' + hour;
        Index1.$('.minuteTime').innerHTML = mintes;
        Index1.$('.secondTime').innerHTML = seco;
    }

    //获取节点的方法
    static $(tag) {
        return document.querySelector(tag);
    }

    static $$(tag) {
        return document.querySelectorAll(tag);
    }
}

new Index1;