// pages/shop/shop.js
const app = getApp();
let getedScene, huMing, moneyss, lists, daohang = 0;
Page({
  data: {
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
    datas: [], //商品数组
    baseUrl: app.globalData.baseUrl, //图片路径
    cartNumber: 0, //购物车商品数量
    showModal: false, //判断授权弹窗
    payIndex: 1, //便民服务里的充值类型
    catIndex: 0, //点击的catId数字
    goodlists: [], //筛选出来的商品属性
    usersMoney: 0, //当前额度
    mallName: {}, //商家信息
    print: true, //判断是否重复点击充值
    place: ['', '请输入缴费户号', '请输入缴费手机号', '请输入缴费户号'],
    imgUrls: [] //轮播图
    
  },
  onLoad: function(options) {
    console.log(options)
    this.getLisets();
    console.log(app.globalData.userId)
  },
  onShow() {
    this.setData({
      print: true
    })
    //个人用户信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}WxUsers/getUserInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          mallName: res.data.seeting
        })
        console.log(app.globalData.userInfo)
        console.log(res);
        app.globalData.userstatus = res.data.userInfo.userstatus
      }
    });
    //查询用户等级接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}WxUsers/userLevel`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        if (res.data.status == 1) {
          //显示收益下面的红点
          wx.showTabBarRedDot({
            index: 0
          })
        } else {
          wx.hideTabBarRedDot({
            index: 0
          })
        }
        console.log(app.globalData.userId)
        console.log(res);
      }
    });
    //获取购物车接口
    wx.getStorage({
      key: 'cartTrolley',
      success: res => {
        let cartTrolley = res.data ? JSON.parse(res.data) : [];
        app.globalData.cartNumber = cartTrolley.length == 0 ? 0 : cartTrolley.length * 1;
        this.setData({
          cartNumber: app.globalData.cartNumber
        });
      }
    })

  },
  //点击家政、护理、其他
  bindtapHuli() {
    wx.showModal({
      title: '温馨提示',
      content: '请联系直属店面',
      showCancel:false,
    })
  },
  //封装商品展示接口
  getLisets() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${app.globalData.api}goods/searchGoods`,
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        console.log(daohang);
        this.setData({
          datas: res.data,
          goodlists: res.data[this.data.catIndex].goodsList
        });
      }
    });
    //轮播图
    wx.request({
      url: `${app.globalData.api}index/getAds`,
      success: res => {
        console.log(res);
        let imgeas = res.data.map(item => app.globalData.baseUrl + item.adfile);
        this.setData({
          imgUrls: imgeas
        })
        console.log(imgeas)
      }
    });
  },
  //点击分类导航
  bindtapDaohang(e) {
    console.log(e)
    console.log("点击后")
    daohang = e.currentTarget.dataset.catindex;
    this.setData({
      catIndex: daohang
    })
    console.log(this.data.catIndex)
    this.getLisets();
  },
  //显示弹窗
  showPopup(e) {
    if (app.globalData.userstatus == -1) {
      wx.showModal({
        title: '温馨提示',
        content: '请身份激活',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../activate/activate'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.switchTab({
              url: '../shop/shop'
            })
          }
        }
      })
    } else if (app.globalData.userstatus == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '您的身份正在审核，请耐心等待',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.switchTab({
              url: '../shop/shop'
            })
          }
        }
      })
    } else {
      console.log(e)
      console.log('yes')
      wx.showLoading({
        title: '加载中',
      })
      //用户信息接口
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
            usersMoney: res.data.userInfo.usermoney
          })
        }
      });
      let payindex = e.currentTarget.dataset.payindex;
      this.setData({
        payIndex: payindex
      })
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
    }, 0);
  },
  //输入的户名
  bindinputHuhao(e) {
    console.log(e)
    huMing = e.detail.value;
  },
  //输入的金额
  bindinputMoney(e) {
    console.log(e)
    moneyss = e.detail.value;
  },
  //确认充值
  bindtapTixian() {
    if (!this.data.print) return;
    if (!huMing && this.data.payIndex == 2) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (!huMing && this.data.payIndex != 2) {
      wx.showToast({
        title: '请输入缴费户号',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (!moneyss) {
      wx.showToast({
        title: '请输入缴费金额',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (moneyss * 1 == 0) {
      wx.showToast({
        title: '金额不能为0',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (moneyss * 1 > this.data.usersMoney * 1) {
      wx.showToast({
        title: '余额不足',
        image: '../../assets/warning.png',
        duration: 1500
      });
      setTimeout(() => {
        this.hidePopup();
        wx.navigateTo({
          url: '../currency/currency'
        });
      }, 500)
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}CashDraws/rechargeMoney`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          type: this.data.payIndex,
          money: moneyss,
          cashRemarks: huMing
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          console.log({
            userId: app.globalData.userId,
            type: this.data.payIndex,
            money: moneyss,
            cashRemarks: huMing
          })
          if (res.data.status == 1) {
            wx.showToast({
              title: '充值成功，请耐心等待后台审核',
              icon: 'none',
              duration: 1500
            });
            setTimeout(() => {
              this.hidePopup();
              wx.navigateTo({
                url: '../withdraw/withdraw'
              });
            }, 1200)
            this.setData({
              print: false
            })
          } else {
            wx.showToast({
              title: `充值失败`,
              image: '../../assets/warning.png',
              duration: 2000
            })
          }
        }
      });
    }
  },
  //关闭弹窗
  handleClosePopup() {
    this.hidePopup();
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.getLisets();
  },
})