// pages/close/close.js
const app = getApp();
let liuYan = '',
  datasjson;
Page({
  data: {
    liuYan: '',
    //遮罩层
    mask: {
      opacity: 0,
      display: 'none'
    },
    //弹窗
    returnDeposit: {
      translateY: 'translateY(-1500px)',
      opacity: 1
    },
    datas: [], //商品列表
    baseUrl: app.globalData.baseUrl, //图片路径
    lists: {}, //默认地址
    shopmoney: 0, //商品总价格
    userInfo: {}, //个人信息接口
    print: true, //判断是否重复点击结算
    passwords: '' //支付密码
  },
  onLoad: function(options) {
    console.log(app.globalData.id)
    console.log(app.globalData.shops)
    console.log(Array.isArray(app.globalData.shops))
    wx.showLoading({
      title: '加载中',
    })
    if (Array.isArray(app.globalData.shops)) {
      this.setData({
        datas: app.globalData.shops
      })
    } else {
      let shopArry = [app.globalData.shops];
      this.setData({
        datas: shopArry
      })
    }
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}WxUsers/getUserInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        this.setData({
          userInfo: res.data.userInfo
        })
      }
    });
    //计算商品价格
    let shopsmoney = this.data.datas.map(item => parseFloat(item.shopMoney) * parseFloat(item.shopNumber)).reduce((total, num) => total + num);
    this.setData({
      shopmoney: shopsmoney
    })
  },
  onShow() {
    console.log(app.globalData.id)
    this.setData({
      lists: []
    });
    wx.showLoading({
      title: '加载中',
    })
    if (app.globalData.id) {
      this.setData({
        lists: app.globalData.id
      })
      app.globalData.id = undefined;
      console.log(this.data.lists)
      wx.hideLoading();
    } else {
      //地址接口
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}UserAddress/getUserAddress`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          let lists = res.data.find(item => item.isdefault == 1);
          this.setData({
            lists: lists
          })
        }
      });
    }
  },
  //留言内容
  bindinputLiuyan(e) {
    console.log(e)
    liuYan = e.detail.value;
    this.setData({
      liuYan: liuYan
    })
    console.log(liuYan)
  },
  //地址管理
  bindtapAddressaa() {
    wx.navigateTo({
      url: '../addressaa/addressaa'
    })
  },
  //提交订单
  bindtapTijiao() {
    if (this.data.print == false) return;
    this.setData({
      print: false
    })
    console.log("点击结算")
    console.log(this.data.print)
    console.log("--------------------")
    console.log(this.data.datas)
    console.log(this.data.lists)
    console.log(liuYan)
    //用户匹配清除购物车商品
    let datasArr = this.data.datas.map(res => {
      return {
        goodsId: res.shopId,
        goodsshopColorId: res.shopColorId,
        goodssizesNumber: res.sizesNumber
      }
    })
    //整合成后台需要的数组
    let dataArr = this.data.datas.map(res => {
      return {
        goodsId: res.shopId,
        goodsNums: res.shopNumber,
        goodsAttr: res.shopColorId + ',' + res.sizesNumber,
        goodsshopColorId: res.shopColorId,
        goodssizesNumber: res.sizesNumber
      }
    })
    //把数组转换成json传给后台
    datasjson = JSON.stringify(dataArr);
    console.log(datasjson)
    console.log(this.data.lists)
    if (!this.data.passwords) {
      wx.showToast({
        title: '密码不能为空',
        image: '../../assets/warning.png',
        duration: 1500
      });
      this.setData({
        print: true
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}orders/reserveOrder`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          orderGoods: datasjson,
          userId: app.globalData.userId,
          addressId: this.data.lists.addressid,
          orderRemarks: liuYan,
          oldPwd: this.data.passwords
        },
        success: res => {
          wx.hideLoading()
          console.log({
            orderGoods: datasjson,
            userId: app.globalData.userId,
            addressId: this.data.lists.addressid,
            orderRemarks: liuYan,
            oldPwd: this.data.passwords
          })
          console.log(res)
          console.log(res.data);
          if (res.data.status == 1) {
            wx.showToast({
              title: '付款成功',
              icon: 'success',
              duration: 1500
            });
            //结算时不能重复点击结算按钮
            this.setData({
              print: false
            })
            console.log(this.data.print)
            setTimeout(function() {
              wx.redirectTo({
                url: '../order/order'
              })
            }, 2000);
            //结算成功清除购物车结算的商品
            wx.getStorage({
              key: 'cartTrolley',
              success: res => {
                console.log("结算成功清除购物车结算的商品")
                console.log(res)
                console.log(datasArr)
                let cartTrolley = res.data ? JSON.parse(res.data) : [],
                  settle = cartTrolley.filter(res => !datasArr.some(sub => sub.goodsId === res.shopId && sub.goodsshopColorId === res.shopColorId && sub.goodssizesNumber === res.sizesNumber));
                wx.setStorage({
                  key: 'cartTrolley',
                  data: JSON.stringify(settle)
                });
                console.log(settle)
                app.globalData.cartNumber = settle.length == 0 ? 0 : settle.map(res => res.total * 1).reduce((total, num) => total + num);
              }
            });
          } else {
            this.setData({
              print: true
            })
            wx.showToast({
              title: res.data.msg,
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        }
      });
    }
  },
  //提现输入框输入的金额
  bindinputMoney(e) {
    console.log(e)
    this.setData({
      passwords: e.detail.value
    })
  },
  //点击商品跳转详情
  bindtapXq(e) {
    console.log(e)
    let shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../shopdetails/shopdetails?goodsid=${shopid}`
    })
  },
  //显示弹窗
  showPopup(e) {
    this.setData({
      print: true
    })
    if (!this.data.lists) {
      wx.showToast({
        title: '请添加地址',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (this.data.userInfo.usermoney * 1 < this.data.shopmoney * 1) {
      wx.showToast({
        title: '商城币余额不足',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else {
      console.log(e)
      console.log('yes')
      let mask = this.data.mask,
        returnDeposit = this.data.returnDeposit;
      mask.display = 'block';
      this.setData({ mask });
      mask.opacity = 1;
      returnDeposit.translateY = 'translateY(0)';
      returnDeposit.opacity = 1;
      this.setData({ mask, returnDeposit });
    }
  },
  //隐藏弹窗
  hidePopup() {
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.opacity = 0;
    returnDeposit.opacity = 0;
    this.setData({ mask, returnDeposit });
    setTimeout(() => {
      mask.display = 'none';
      returnDeposit.translateY = 'translateY(-1000px)';
      this.setData({ mask, returnDeposit });
    }, 500);
  },

  //关闭弹窗
  handleClosePopup() {
    this.hidePopup();
  },
})