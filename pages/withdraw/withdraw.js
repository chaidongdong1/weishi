// pages/withdraw/withdraw.js
const app = getApp();
Page({
  data: {
    datas: [], //审核中
    indexs: 0, //记录当前点击的是第几个
    datasNumber: 0 //记录审核中的个数
  },
  onLoad: function(options) {
    if (this.data.indexs == 2) {
      this.bindtapWith2();
    } else if (this.data.indexs == 3) {
      this.bindtapWith3();
    } else{
      this.bindtapWith1();
    }
    console.log(this.data.indexs)
  },
  //审核中
  bindtapWith1() {
    this.setData({
      indexs: 1,
      datas: []
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/rechargeList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        this.setData({
          datas: res.data.pendingRecharge,
          datasNumber: res.data.pendingTotal
        })
      }
    });
  },
  //已通过
  bindtapWith2() {
    this.setData({
      indexs: 2,
      datas: []
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/rechargeList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        this.setData({
          datas: res.data.alreadyRecharge,
          datasNumber: res.data.pendingTotal
        })
      }
    });
  },
  //未通过
  bindtapWith3() {
    this.setData({
      indexs: 3,
      datas: []
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/rechargeList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        this.setData({
          datas: res.data.cancelRecharge,
          datasNumber: res.data.pendingTotal
        })
      }
    });
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.onLoad();
  },
})