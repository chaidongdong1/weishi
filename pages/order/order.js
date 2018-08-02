// pages/order/order.js
const app = getApp();
Page({
  data: {
    baseUrl: app.globalData.baseUrl, //图片地址
    datas: [], //订单列表
    pendingTotal: 0, //待发货数量
    curIndex: 0 //当前点击的第几个
  },
  onLoad: function(options) {
    if (this.data.curIndex == 3) {
      this.bindtaporder3();
    } else if (this.data.curIndex == 2) {
      this.bindtaporder2();
    } else {
      this.bindtaporder1();
    }
  },
  //待发货
  bindtaporder1() {
    this.setData({
      datas: [], //订单列表
      shops: [], //商品列表
      curIndex: 1
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}orders/orderList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        this.setData({
          datas: res.data.pendingDelivery,
          pendingTotal: res.data.pendingTotal
        })
      }
    });
  },
  //已发货
  bindtaporder2() {
    this.setData({
      datas: [], //订单列表
      shops: [], //商品列表
      curIndex: 2
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}orders/orderList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        this.setData({
          datas: res.data.alreadyDelivery,
          pendingTotal: res.data.pendingTotal
        })
      }
    });
  },
  //已完成
  bindtaporder3() {
    this.setData({
      datas: [], //订单列表
      shops: [], //商品列表
      curIndex: 3
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}orders/orderList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        this.setData({
          datas: res.data.completeDelivery,
          pendingTotal: res.data.pendingTotal
        })
      }
    });
  },
  //确认收货
  bindtapShow(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.orderid)
    let orderId = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '温馨提示',
      content: '是否确认收货',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}orders/completeOrder`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              orderId: orderId
            },
            success: res => {
              wx.hideLoading()
              console.log(orderId)
              console.log(res);
              if (res.data.status == 1) {
                wx.showToast({
                  title: '确认收货成功',
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(() => {
                  this.bindtaporder3();
                }, 1500)
              } else {
                wx.showToast({
                  title: '确认收货失败',
                  image: '../../assets/warning.png',
                  duration: 2000
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindtapShop(e) {
    console.log(e)
    let goodsid = e.currentTarget.dataset.goodsid;
    let status = e.currentTarget.dataset.status;
    if (status != 1) {
      wx.navigateTo({
        url: `../shopdetails/shopdetails?goodsid=${goodsid}`
      })
    }
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.onLoad();
  },
})