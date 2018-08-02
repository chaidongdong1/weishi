// pages/address/address.js
const app = getApp();
Page({
  data: {
    datas: [] //地址列表
  },
  onLoad: function(options) {
    
  },
  onShow(){
    this.getLists();
  },
  getLists() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}UserAddress/getUserAddress`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        this.setData({
          datas: res.data
        })
      }
    });
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.getLists();
  },
  //点击修改地址
  bindtapXiugai(e) {
    console.log(e)
    let id = e.currentTarget.dataset.addressid;
    console.log(id)
    wx.navigateTo({
      url: `../addaddress/addaddress?id=${id}`
    })
  },
  //删除地址
  bindtapShanchu(e) {
    console.log(e)
    let addressid = e.currentTarget.dataset.addressid;
    wx.showModal({
      title: '温馨提示',
      content: '确认要删除该地址？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '删除中',
          })
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}UserAddress/delUserAddress`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              userId: app.globalData.userId,
              addressId: addressid
            },
            success: res => {
              console.log(res);
              if (res.data.status == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1500
                });
                this.getLists();
              } else {
                wx.showToast({
                  title: '删除失败',
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
})