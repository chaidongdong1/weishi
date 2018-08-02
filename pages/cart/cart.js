// pages/cart/cart.js
const app = getApp();
Page({
  data: {
    showMsg: true, //显示温馨提示
    datas: [], //商品列表
    baseUrl: app.globalData.baseUrl, //图片路径
    popup: -1, //是否显示购买、删除按钮
    shuoyou: false, //全选按钮
    shopnumber: 0, //筛选出选中的个数
    shopmoneys: 0 //筛选出选中的总钱数
  },
  onShow: function(options) {
    this.setData({
      shuoyou: false //全选按钮
    })
    wx.showLoading({
      title: '加载中',
    })
    //获取购物车接口
    wx.getStorage({
      key: 'cartTrolley',
      success: res => {
        console.log(res)
        let cartTrolley = res.data ? JSON.parse(res.data) : [];
        cartTrolley = cartTrolley.map(res => {
          let temp = res;
          temp.temp = false;
          return temp;
        });
        this.setData({
          datas: cartTrolley
        });
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(this.data.datas)
      }
    })
    if (this.data.datas.length == 0 || !this.data.datas) {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.onShow();
  },
  //计算选中个数和价格
  shopJiage() {
    let lists = this.data.datas;
    let shops = lists.filter(item => item.temp == true);
    if (shops.length == 0) {
      this.setData({
        shopnumber: 0,
        shopmoneys: 0
      })
    } else {
      console.log(shops);
      console.log(shops.map(item => parseFloat(item.shopMoney) * parseFloat(item.shopNumber)));
      let shopsmoney = shops.map(item => parseFloat(item.shopMoney) * parseFloat(item.shopNumber)).reduce((total, num) => total + num);
      this.setData({
        shopnumber: shops.length,
        shopmoneys: shopsmoney
      })
      console.log(shopsmoney)
    }
  },
  //点击选中按钮
  bindtapAnniu(e) {
    console.log(e)
    let shuzi = e.currentTarget.dataset.index;
    let lists = this.data.datas;
    lists[shuzi].temp = !lists[shuzi].temp;
    this.setData({
      datas: lists
    })
    this.shopJiage();
    let price = this.data.datas.findIndex(item => item.temp == false)
    if (price == -1) {
      this.setData({
        shuoyou: true
      })
    } else {
      this.setData({
        shuoyou: false
      })
    }
    console.log(price)
    console.log(this.data.datas)
  },
  //点击全选按钮
  bindtapSuoyou() {
    let lists = this.data.datas;
    let list1 = lists.findIndex(item => item.temp == false);
    console.log(list1)
    if (list1 == -1) {
      let listss = lists.map(res => {
        let temp = res;
        temp.temp = false;
        return temp;
      });
      this.setData({
        datas: listss,
        shuoyou: false
      })
      this.shopJiage();
    } else {
      let listss = lists.map(res => {
        let temp = res;
        temp.temp = true;
        return temp;
      });
      this.setData({
        datas: listss,
        shuoyou: true
      })
      this.shopJiage();
    }
    console.log(this.data.datas)
  },
  //长按弹出购买和删除
  bindtapPopup(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      popup: index
    })
  },
  //关闭删除和购买弹窗
  test() {
    if (this.data.popup != -1) {
      this.setData({
        popup: -1
      })
    }
    console.log(this.data.popup)
  },
  //关闭弹窗
  bindtapClose() {
    this.setData({
      popup: -1
    })
    console.log(this.data.popup)
  },
  //删除
  bindtapDelete(e) {
    let indexs = e.currentTarget.dataset.index,
      datas = this.data.datas;
    console.log(indexs)
    wx.showModal({
      title: '温馨提示',
      content: '您是否要删除该商品？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          //更新缓存中的购物车数据
          datas.splice(indexs, 1);
          this.setData({
            datas: datas
          });
          wx.setStorage({
            key: 'cartTrolley',
            data: JSON.stringify(datas)
          });
          console.log(datas)
          //更新购物车商品数量
          app.globalData.cartNumber = this.data.datas.length;
          console.log(app.globalData.cartNumber)
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          this.shopJiage();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //多个结算按钮
  bindtapJiesuanD() {
    let lists = this.data.datas;
    let shops = lists.filter(item => item.temp == true);
    console.log(shops)
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
            wx.navigateTo({
              url: '../shop/shop'
            })
          }
        }
      })
    } else if (shops.length != 0) {
      app.globalData.shops = shops;
      wx.navigateTo({
        url: '../close/close'
      })
    } else {
      wx.showToast({
        title: '请选择商品',
        image: '../../assets/warning.png',
        duration: 1500
      })
    }
  },
  //单个结算按钮
  bindtapJiesuanY(e) {
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
      let shopAA = this.data.datas[e.currentTarget.dataset.index];
      app.globalData.shops = shopAA;
      console.log(shopAA)
      wx.navigateTo({
        url: '../close/close'
      })
    }
  },
  //商品数量增加
  bindtapjia(e) {
    console.log(e)
    let datass = this.data.datas;
    datass[e.currentTarget.dataset.index].shopNumber++;
    console.log(datass)
    this.setData({
      datas: datass
    })
    let cartTrolleys = this.data.datas;
    if (this.data.datas[e.currentTarget.dataset.index].temp == true) {
      let price = cartTrolleys.filter(item => item.temp).map(item => item.shopMoney * item.shopNumber).reduce((total, num) => total + num)
      this.setData({
        shopmoneys: price
      })
    }
    //存入缓存
    wx.setStorage({
      key: "cartTrolley",
      data: JSON.stringify(cartTrolleys)
    });
  },
  //商品数量减少
  bindtapjian(e) {
    console.log(e)
    if (this.data.datas[e.currentTarget.dataset.index].shopNumber > 1) {
      let datass = this.data.datas;
      datass[e.currentTarget.dataset.index].shopNumber--;
      console.log(datass)
      this.setData({
        datas: datass
      })
      let cartTrolleys = this.data.datas;
      if (this.data.datas[e.currentTarget.dataset.index].temp == true) {
        let price = cartTrolleys.filter(item => item.temp).map(item => item.shopMoney * item.shopNumber).reduce((total, num) => total + num)
        this.setData({
          shopmoneys: price
        })
      }
      //存入缓存
      wx.setStorage({
        key: "cartTrolley",
        data: JSON.stringify(cartTrolleys)
      });
      console.log(this.data.datas)
    } else {
      wx.showToast({
        title: '数量不能小于1',
        image: '../../assets/warning.png',
        duration: 2000
      })
    }
  },
  //点击图片跳转商品详情
  bindtapShopxq(e) {
    console.log(e)
    let shopId = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../shopdetails/shopdetails?goodsid=${shopId}`
    })
  },
  //关闭温馨提示
  handleCloseMsg() {
    this.setData({
      showMsg: false
    });
  },
  //跳转商城
  bindtapShop() {
    wx.switchTab({
      url: '../shop/shop'
    })
  },
})