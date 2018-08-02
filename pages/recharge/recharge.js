// pages/recharge/recharge.js
const app = getApp();
let option;
Page({
  data: {
    datas: [], //提现数据
    curIndex: 0, //点击的是第几个
    datasNumber: 0 //记录审核中的个数
  },
  onLoad: function(options) {
    option = options.useraa;
  },
  onShow() {
    //判断是否是从收益页面跳转过来的
    if (option == 1) {
      app.globalData.useraa = 1;
    }
    if (this.data.curIndex == 2) {
      this.bindtapRecha2();
    } else if (this.data.curIndex == 3) {
      this.bindtapRecha3();
    } else {
      this.bindtapRecha1();
    }
  },
  //审核中
  bindtapRecha1() {
    this.setData({
      curIndex: 1,
      datas: []
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/cashDrawList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
        this.setData({
          datas: res.data.pendingCash,
          datasNumber: res.data.pendingTotal
        })
        console.log(this.data.datas)
      }
    });
  },
  //已通过
  bindtapRecha2() {
    this.setData({
      curIndex: 2,
      datas: []
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/cashDrawList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
        this.setData({
          datas: res.data.alreadyCash,
          datasNumber: res.data.pendingTotal
        })
      }
    });
  },
  //已完成
  bindtapRecha3() {
    this.setData({
      curIndex: 3,
      datas: []
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/cashDrawList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
        this.setData({
          datas: res.data.cancelCash,
          datasNumber: res.data.pendingTotal
        })
      }
    });
  },
  //取消提现
  bindtapButton(e) {
    console.log(e)
    let cashId = e.currentTarget.dataset.cashid;
    wx.showModal({
      title: '温馨提示',
      content: '您是否要取消提现？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}cashDraws/cancelCashDraws`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              userId: app.globalData.userId,
              cashId: cashId
            },
            success: res => {
              wx.hideLoading()
              console.log(res);
              if (res.data.status == 1) {
                wx.showToast({
                  title: '取消提现成功',
                  icon: 'success',
                  duration: 1500
                });
                this.bindtapRecha3();
              } else {
                wx.showToast({
                  title: '取消提现失败',
                  images: '../../assets/warning.png',
                  duration: 1500
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.onShow();
  },
})