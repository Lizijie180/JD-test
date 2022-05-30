/*
 * @Author: lzj
 * @Date: 2022-05-29 11:18:44
 */
// 购物车页面的js
class Cart {

    constructor() {

        this.token = localStorage.getItem('token');
        this.id = localStorage.getItem('id');

        //判断是否登录
        this.isLogin();
        //获取购物车列表
        this.getGoodsList();
        //包含事件的方法
        this.eleThing();
    }

    //包含事件的方法
    eleThing() {

        //搜索框的按钮点击
        Cart.$('.search>button').addEventListener('click', this.stopGo);
        //li内所有的事件委托给ul
        Cart.$('.goodsCart').addEventListener('click', this.ulEve);
        //修改数量的事件
        Cart.$('.goodsCart').addEventListener('change', this.ulSetNum);
        //点击全选按钮的事件
        Cart.$('.title #checkAll').addEventListener('click', this.checkAllFn);
        // 结算框的委托
        Cart.$('.goPay').addEventListener('click', this.goPayFn);
    }

    //阻止默认事件
    stopGo = eve => {
        eve.preventDefault();
    }

    //ul的委托事件
    ulEve = eve => {
        let target = eve.target;
        //点击复选按钮
        if (target.nodeName == 'INPUT' && target.id == 'checkBtn') {
            this.checkFn(target);
        }
        //点击图片和介绍
        if (target.nodeName == 'IMG' || target.className == 'titleGoods') {
            this.goGoodsFn(target);
        }
        //点击+ -按钮
        if (target.nodeName == 'BUTTON' && target.parentNode.className == 'goodsNum') {
            this.DownUpFn(target);
        }
        //点击删除
        if (target.className == 'delGoods') {
            this.delOneFn(target);
        }
    }

    //复选按钮的方法
    checkFn(target) {

        let goodsId = target.parentNode.dataset.id;
        let data = `id=${this.id}&goodsId=${goodsId}`
        axios.post('http://localhost:8888/cart/select', data).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                this.getGoodsList();
            }
        })
    }

    //点击图片和商品介绍跳转到商品详情
    goGoodsFn(target) {
        let goodsId = target.parentNode.dataset.id;
        axios.get('http://localhost:8888/goods/item/' + goodsId).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                localStorage.setItem('goodsId', goodsId);
                location.href = './goods.html';
            }
        })
    }

    DownUpFn(target) {
        let nowVal = target.parentNode.querySelector('input').value;
        let goodsId = target.parentNode.parentNode.dataset.id;
        if (target.innerHTML == '-') {
            //如果是-号
            if (nowVal == 1) return;
            nowVal--;
        } else if (target.innerHTML == '+') {
            //如果是+号
            nowVal++;
        }

        //发送请求修改数量
        this.setNum(goodsId, nowVal);
    }

    //修改购买数量
    ulSetNum = eve => {
        let target = eve.target;
        let nowVal = Math.floor(target.value.trim());
        if (nowVal < 1) {
            nowVal = 1;
        }
        let goodsId = target.parentNode.parentNode.dataset.id;
        this.setNum(goodsId, nowVal);
    }

    //修改数量的请求
    setNum(goodsId, number) {
        let data = `id=${this.id}&goodsId=${goodsId}&number=${number}`;
        axios.post('http://localhost:8888/cart/number', data).then(res => {
            let { status, data } = res
            if (status == 200 && data.code == 1) {
                this.getGoodsList()
            }
        })
    }

    //删除当前商品的方法
    delOneFn(target) {
        let goodsId = target.parentNode.dataset.id;
        this.delOneAjaxFn(goodsId);
    }

    //删除一条商品的请求
    delOneAjaxFn(goodsId) {
        let data = `id=${this.id}&goodsId=${goodsId}`;
        axios.get('http://localhost:8888/cart/remove?' + data).then(res => {
            let { status, data } = res
            if (status == 200 && data.code == 1) {
                alert('删除成功')
                this.getGoodsList()
            }
        })
    }

    //根据商品是否全部选中来决定全选按钮的状态
    isCheckedFn() {
        let checkArr = Cart.$('.goodsCart #checkBtn');
        let length = checkArr.length > 1 ? checkArr.length : 1;
        let isChecked = 0;
        if (length > 1) {
            checkArr.forEach(ele => {
                if (ele.checked) {
                    isChecked++;
                }
            })
        } else {
            checkArr.checked == true ? isChecked = 1 : isChecked = 0;
        }

        if (isChecked == length) {
            Cart.$('.title #checkAll').checked = true;
        } else {
            Cart.$('.title #checkAll').checked = false;
        }
    }

    //全选按钮的事件
    checkAllFn = (eve) => {
        let target = eve.target;
        let type = 0;
        if (target.checked == true) {
            type = 1;
        } else {
            type = 0;
        }
        let data = `id=${this.id}&type=${type}`
        axios.post('http://localhost:8888/cart/select/all', data).then(res => {
            let { status, data } = res;
            if (status == 200 && data.code == 1) {
                this.getGoodsList();
            }
        })
    }

    //结算框的委托
    goPayFn = eve => {
        let target = eve.target;
        //点击删除选中
        if (target.className == 'delCheck') {
            axios.get('http://localhost:8888/cart/remove/select?id=' + this.id).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    alert('删除选中成功')
                    this.getGoodsList();
                }
            })
        } else if (target.className == 'delAll') {
            // 点击清空购物车
            axios.get('http://localhost:8888/cart/clear?id=' + this.id).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    alert('购物车清空成功')
                    this.getGoodsList();
                }
            })
        } else if (target.nodeName == 'BUTTON') {
            axios.get('http://localhost:8888/cart/clear?id=' + this.id).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    alert('结算成功')
                    this.getGoodsList();
                }
            })
        }
    }


    //获取购物车列表
    getGoodsList() {
        axios.get('http://localhost:8888/cart/list?id=' + this.id).then(res => {
            console.log(res);
            let { status, data } = res;
            if (status == 200 & data.code == 1) {
                this.appendHtml(data);
            }
        })
    }

    //追加到页面中
    appendHtml(data) {
        let str = ``;
        let goodsArr = data.cart;
        if (goodsArr.length) {
            Cart.$('.cartAll').classList.remove('noShow');
            Cart.$('.noGoods').classList.add('noShow');


            Cart.$('.cartAll .goodsNum').innerHTML = goodsArr.length;
            let selectSum = 0;
            let selectPrice = 0;
            goodsArr.forEach(ele => {
                //如果该商品是选中的话
                if (ele.is_select) {
                    selectSum += ele.cart_number;
                    selectPrice += ele.current_price * ele.cart_number;
                }
                str += `
                    <li data-id='${ele.goods_id}'>
                        <input type="checkbox" name="" id="checkBtn" ${ele.is_select == true ? 'checked' : ''}>
                        <img src="${ele.img_small_logo}" alt="" >
                        <div class="titleGoods">${ele.title}</div>
                        <div class="goodsOne">￥${ele.current_price}</div>
                        <div class="goodsNum">
                            <button class='downCart ${ele.cart_number == 1 ? 'disable' : ''}'>-</button>
                            <input type="text" value="${ele.cart_number}" class="nowNum">
                            <button class='upCart'>+</button>
                        </div>
                        <div class="goodsSum">￥${(ele.current_price * ele.cart_number).toFixed(2)}</div>
                        <div class="delGoods">删除</div>
                    </li>
                    `;
            });

            //追加到页面
            Cart.$('.goodsCart').innerHTML = str;

            //已选择多少件商品
            Cart.$('.goPay .checkGoods span').innerHTML = selectSum;
            //总价
            Cart.$('.goPay .sumGoods span').innerHTML = selectPrice.toFixed(2);

        } else {
            Cart.$('.cartAll').classList.add('noShow');
            Cart.$('.noGoods').classList.remove('noShow');
        }

        //判断是否全部选中事件
        this.isCheckedFn();
    }

    //判断是否登录
    isLogin() {
        //登录后做的事
        if (!this.token && !this.id) {
            //如果没登录
            Cart.$('.headerRi>.true_login').classList.remove('active');
            Cart.$('.headerRi>.no_login').classList.add('active');
            alert('您未登录，点击确定跳转到登录框');
            location.href = './login.html?cart.html';
        } else {
            //如果登录，获取用户信息
            axios.defaults.headers.common['authorization'] = this.token;
            axios.get('http://localhost:8888/users/info/' + this.id).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    //如果登录成功就渲染样式
                    this.loginTrue(data);
                }
            })
        }
    }

    //如果登录就渲染
    loginTrue(data) {
        Cart.$('.headerRi>.no_login').classList.remove('active');
        Cart.$('.headerRi>.true_login').classList.add('active');
        //获取用户昵称，追加到页面中
        Cart.$('.true_login a').innerHTML = data.info.nickname;
    }

    //获取节点的方法
    static $(tag) {
        let a = document.querySelectorAll(tag)
        return a.length == 1 ? a[0] : a;
    }

}

new Cart;