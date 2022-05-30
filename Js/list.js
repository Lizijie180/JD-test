/*
 * @Author: lzj
 * @Date: 2022-05-23 11:44:35
 */
// 首页js

//头部鼠标移入事件
class List {
    constructor() {
        this.token = localStorage.getItem('token');
        this.id = localStorage.getItem('id');

        //默认获取提交商品列表的参数
        this.current = 1;   //当前页
        this.pagesize = 12;    //一页显示多少
        this.search = '';     //搜索
        this.filter = '';    //筛选
        this.saleType = 10;   //折扣
        this.sortType = 'id';   //排序
        this.sortMethod = 'ASC';   //正序倒序
        this.category = '';    //分类

        //设置防抖和节流的锁
        this.lock = false;

        //设置判断是否开启滚动事件
        this.isScroll = 1;

        //判断是否登录
        this.isLogin();

        //获取商品的分类
        this.getUl();

        //获取商品列表
        this.getGoods12();

        //点击事件
        this.eleThing();
    }

    //各种点击事件
    eleThing() {
        //分类的点击事件--委托
        //分类
        List.$('.ul1').addEventListener('click', this.categoryFn);
        //筛选
        List.$('.ul2').addEventListener('click', this.filterFn);
        //折扣
        List.$('.ul3').addEventListener('click', this.saleTypeFn);
        //排序
        List.$('.ul4').addEventListener('click', this.sortTypeFn);
        //搜索
        List.$('.searchBox .search button').addEventListener('click', this.searchFn)
        //立即抢购--跳转到加入购物车
        List.$('.list').addEventListener('click', this.goAllFn);
        // 设置滚动条事件
        window.addEventListener('scroll', this.scrollFn);
        // 设置分页的点击事件
        List.$('.page>.same1').addEventListener('click', this.pageFn);
    }

    //获取商品的分类信息
    getUl() {
        let str = `<li class="active">全部</li>`;
        axios.get('http://localhost:8888/goods/category').then(res => {
            if (res.status == 200 & res.data.code == 1) {
                let { list } = res.data;
                list.forEach(ele => {
                    str += `<li>${ele}</li>`
                });
                List.$('.content>.same1>.ul1').innerHTML = str;
            }
        })
    }

    //获取商品的列表 第n页12个数据
    getGoods12(isAppend = 1) {
        let str = '';
        let data = `current=${this.current}&pagesize=${this.pagesize}&search=${this.search}&filter=${this.filter}&saleType=${this.saleType}&sortType=${this.sortType}&sortMethod=${this.sortMethod}&category=${this.category}`;
        axios.get('http://localhost:8888/goods/list?' + data).then(res => {
            let { status, data } = res;
            if (status == 200 & data.code == 1) {
                this.maxPage = res.data.total;
                let current = 0;
                if (this.maxPage % 2) {
                    this.maxPage = (this.maxPage + 1) / 2;
                } else {
                    this.maxPage = this.maxPage / 2;
                }

                if (this.current % 2) {
                    current = (this.current + 1) / 2
                } else {
                    current = this.current / 2
                }

                //如果第一页，不让往左翻页
                if (current == '1') {
                    List.$('.page>.same1>.left').classList.add('disable');
                } else {
                    List.$('.page>.same1>.left').classList.remove('disable');
                }

                //如果是最后一页，不让往右翻页
                if (current == this.maxPage) {
                    List.$('.page>.same1>.right').classList.add('disable');
                } else {
                    List.$('.page>.same1>.right').classList.remove('disable');
                }



                //获取成功将页数渲染上去
                List.$('.page>.same1>.total').innerHTML = `${current} / ${this.maxPage}`;
                List.$('.page>.same1>.pageInput').value = current;


                let goodsLi = data.list;
                goodsLi.forEach(ele => {
                    let sale = ele.sale_type.split('%')[0] / 10;
                    str += `
                    <li class="goodsBox">
                        <img src="${ele.img_big_logo}" alt="" class='goodsImg' data-id="${ele.goods_id}">
                        <div class="title">${ele.title}</div>
                        <div class="info">
                            <div class="price">
                                <span class="nowPrice">￥${ele.current_price}</span>
                                <span class="sale">${sale}折</span>
                            </div>
                            <button class='goodsBtn'>立即抢购</button>
                        </div>
                    </li> 
                     `
                })
                if (isAppend) {
                    //如果是换页，就覆盖
                    List.$('.list').innerHTML = str;
                } else {
                    //如果是懒加载，就追加
                    List.$('.list').innerHTML += str;
                }

            }
        })
    }


    //分类的点击事件
    categoryFn = (eve) => {
        let target = eve.target
        if (target.nodeName == 'LI') {
            target.parentNode.querySelector('.active').classList.remove('active');
            target.className = 'active';
            this.category = target.innerHTML == '全部' ? '' : target.innerHTML;
            this.current = 1;
            this.pagesize = 12;
            this.isScroll = 1;
            this.getGoods12();
        }
    }

    //筛选的点击事件
    filterFn = (eve) => {
        let target = eve.target
        if (target.nodeName == 'LI') {
            target.parentNode.querySelector('.active').classList.remove('active');
            target.className = 'active';
            if (target.innerHTML == '全部') {
                this.filter = '';
            } else if (target.innerHTML == '折扣') {
                this.filter = 'sale';
            } else if (target.innerHTML == '热销') {
                this.filter = 'hot';
            }
            this.current = 1;
            this.pagesize = 12;
            this.isScroll = 1;
            this.getGoods12();
        }
    }
    //折扣的点击事件
    saleTypeFn = (eve) => {
        let target = eve.target
        if (target.nodeName == 'LI') {
            target.parentNode.querySelector('.active').classList.remove('active');
            target.className = 'active';
            this.saleType = target.innerHTML == '全部' ? 10 : target.innerHTML;
            this.current = 1;
            this.pagesize = 12;
            this.isScroll = 1;
            this.getGoods12();
        }
    }
    //排序的点击事件
    sortTypeFn = (eve) => {
        let target = eve.target
        if (target.nodeName == 'LI') {
            target.parentNode.querySelector('.active').classList.remove('active');
            target.className = 'active';
            this.sortType = target.getAttribute('type');   //排序
            this.sortMethod = target.getAttribute('method');   //正序倒序
            this.current = 1;
            this.pagesize = 12;
            this.isScroll = 1;
            this.getGoods12();
        }
    }

    //搜索事件
    searchFn = (eve) => {
        eve.preventDefault();
        //获取搜索框的内容
        let val = List.$('.searchBox .search #searchInput').value.trim();
        // console.log(val);
        //非空验证
        if (!val) {
            location.reload();
        }
        this.search = val;
        this.current = 1;
        this.pagesize = 12;
        this.isScroll = 1;
        this.getGoods12();
    }

    //点击商品列表的事件
    goAllFn = (eve) => {
        let target = eve.target;
        //点击的是商品信息
        if (target.nodeName == "IMG" || target.className == "title") {
            this.goGoodsFn(target);
        } else if (target.className == 'goodsBtn') {
            this.goCartFn(target);
        }

    }

    //去商品详情页面
    goGoodsFn = (target) => {
        let goodsId = target.parentNode.querySelector('img').dataset.id;
        localStorage.setItem('goodsId', goodsId);
        location.href = './goods.html';
    }

    //判断是否去购物车页面
    goCartFn = (target) => {
        let goodsId = target.parentNode.parentNode.querySelector('img').dataset.id;
        //根据token和id判断是否登录，登录就加入购物车，没登录就提醒然后跳转登录页
        if (!this.token && !this.id) {
            alert('未登录，点击确定跳转到登录页面');
            location.href = './login.html?list.html';
        } else {
            let data = `id=${this.id}&goodsId=${goodsId}`;
            axios.post('http://localhost:8888/cart/add', data).then(res => {
                this.getCartNum();
                alert('加入成功');
            })
        }
    }

    //懒加载---滚动条事件
    scrollFn = () => {
        //如果已经懒加载一次，就不能再懒加载了
        if (this.isScroll != 1) {
            return;
        }
        //获取滚动条高度
        let top = document.documentElement.scrollTop;
        //获取可视区的高度
        let seeHeight = document.documentElement.clientHeight;
        // 获取当前内容的高度
        let valHeight = List.$('.list').offsetHeight;
        if (top + seeHeight > (valHeight + 530)) {
            this.current = this.current + 1;
            if (this.lock) return;
            this.lock = true;

            setInterval(() => {
                this.lock = false;
            }, 2000)
            this.isScroll = 0;
            this.getGoods12(0);
        }
    }

    // 分页的事件委托
    pageFn = eve => {
        let target = eve.target;
        let nowCurrent = List.$('.page .total').innerHTML.split(' ')[0];
        if (target.className == 'right') {
            //点击上一页
            this.nextPage(nowCurrent);
        } else if (target.className == 'left') {
            //点击下一页
            this.beforePage(nowCurrent);
        } else if (target.className == 'go') {
            //点击跳转
            this.goPageFn();
        }
    }

    //下一页的方法
    nextPage = (nowCurrent) => {
        document.documentElement.scrollTop = 0;
        this.current = nowCurrent * 2 + 1;
        this.isScroll = 1;
        this.getGoods12();
    }

    //上一页的方法
    beforePage = (nowCurrent) => {
        document.documentElement.scrollTop = 0;
        this.current = (nowCurrent - 2) * 2 + 1;
        this.isScroll = 1;
        this.getGoods12();
    }

    //点击跳转的方法
    goPageFn = () => {
        let hopePage = Math.floor(List.$('.pageInput').value.trim());
        if (!hopePage || hopePage < 1 || hopePage > this.maxPage) {
            this.current = 1;
        } else {
            this.current = hopePage * 2 - 1;
        }
        document.documentElement.scrollTop = 0;
        this.isScroll = 1;
        this.getGoods12();
    }

    //判断是否登录
    isLogin() {
        //登录后做的事
        if (!this.token && !this.id) {
            //如果没登录
            List.$('.headerRi>.true_login').classList.remove('active');
            List.$('.headerRi>.no_login').classList.add('active');
            List.$('.searchAll>.cart').addEventListener('click', this.isCartFn.bind(this, 0));
        } else {
            //如果登录，获取用户信息
            axios.defaults.headers.common['authorization'] = this.token;
            axios.get('http://localhost:8888/users/info/' + this.id).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    //如果登录成功就渲染样式
                    this.loginTrue(data);

                    //登录的话，设置购物车的数量
                    this.getCartNum();
                    //点击我的购物车判断是否登录
                    List.$('.searchAll>.cart').addEventListener('click', this.isCartFn.bind(this, 1));
                }
            })
        }
    }

    //如果登录就渲染
    loginTrue(data) {
        List.$('.headerRi>.no_login').classList.remove('active');
        List.$('.headerRi>.true_login').classList.add('active');
        //获取用户昵称，追加到页面中
        List.$('.true_login a').innerHTML = data.info.nickname;
    }

    //点击我的购物车的跳转
    isCartFn(isTrue) {
        if (isTrue) {
            location.href = './cart.html';
        } else {
            location.href = './login.html?list.html';
        }
    }

    //获取购物车的数量
    getCartNum() {
        axios.defaults.headers.common['authorization'] = this.token;
        axios.get('http://localhost:8888/cart/list?id=' + this.id).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                List.$('.searchAll>.cart .poaGouWu').innerHTML = data.cart.length;
            }
        })
    }

    static $(tag) {
        let a = document.querySelectorAll(tag)
        return a.length == 1 ? a[0] : a;
    }

}

new List;