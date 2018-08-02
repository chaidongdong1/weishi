// pages/orderdetails/orderdetails.js
const app = getApp();
Page({
  data: {
    datas:'',   //订单详情
    goods:[],    //商品详情
    lists:null,   //商品信息详情
    baseUrl:app.globalData.baseUrl     //图片路径
  },
  onLoad: function (options) {
    console.log(options.orderid)
    let orderId = options.orderid;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method:'POST',
      url:`${app.globalData.api}orders/queryOrderInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data:{
        id:orderId
      },
      success:res=>{
        wx.hideLoading();
        console.log(res);
        this.setData({
          datas:res.data.object,
          goods:res.data.goods,
          lists:res.data.logorder
        })
      }
    });
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
})