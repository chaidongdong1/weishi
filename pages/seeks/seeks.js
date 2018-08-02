// pages/seeks/seeks.js
const app = getApp();
Page({
  data: {
    focus: true, //自动聚焦input
    input: '', //input的value值
    datas: [], //搜索结果的数据
    button: false, //是否点击搜索按钮
    baseUrl: app.globalData.baseUrl //图片路径
  },
  onLoad: function(options) {

  },
  //搜索input的输入值
  bindSousuo(e) {
    this.setData({
      input: e.detail.value,
      button: false
    })
  },
  //输入框失去焦点时
  bindblurSousuo(e){
    this.setData({
      input: e.detail.value,
      button: false
    })
    this.bintapButton();
  },
  //封装接口
  bintapButton() {
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}goods/searchGoods`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        goodsName: this.data.input
      },
      success: res => {
        console.log({
          goodsName: this.data.input
        })
        console.log(res);
        this.setData({
          datas: res.data,
          button: true
        })
      }
    });
  },
})