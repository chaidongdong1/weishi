// pages/about/about.js
const app = getApp();
Page({
  data: {
    datas: {}, //商家信息
    banbenNo:0  //版本号
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}WxUsers/getUserInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        console.log(res.data.seeting);
        this.setData({
          datas: res.data.seeting,
          banbenNo:app.globalData.banbenNo
        })
      }
    });
  },
  //点击拨打电话
  bindtapPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.datas.shopAccTel
    })
  },
})