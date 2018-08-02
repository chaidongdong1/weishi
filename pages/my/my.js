// pages/my/my.js
const app = getApp();
Page({
  data: {
    userId: '', //获取用户userId
    datas: {}, //用户信息
    handletime: ''
  },
  onShow: function() {
    //查询用户等级接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}WxUsers/userLevel`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(app.globalData.userId)
        console.log(res);
      }
    });
    this.setData({
      userId: app.globalData.userId
    })
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
          wx.stopPullDownRefresh();
          console.log(res);
          let handletime = res.data.userInfo.handletime.slice(0, 10);
          this.setData({
            datas: res.data.userInfo,
            handletime: handletime
          })
        }
      });
    }
    console.log(this.data.userId)
  },
  //点击跳转商城币
  bindtapShang() {
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
      wx.navigateTo({
        url: '../currency/currency'
      })
    }
  },
  //点击修改密码
  bindtapPassword() {
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
      wx.navigateTo({
        url: '../password/password'
      })
    }
  },
  //点击我的团队
  bindtapItem() {
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
      wx.navigateTo({
        url: `../member/member?userId=${this.data.datas.userid}`
      })
    }
  },
  //点击推荐码
  bindtapCode() {
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
      wx.navigateTo({
        url: '../code/code'
      })
    }
  },
  //点击地址管理
  bindtapAddress() {
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
      wx.navigateTo({
        url: '../address/address'
      })
    }
  },
  //点击问题反馈
  bindtapFankui() {
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
      wx.navigateTo({
        url: '../feedback/feedback'
      })
    }
  },
  //点击跳转个人信息修改页面
  bindtapPhone() {
    if (app.globalData.userstatus == 0) {
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
      wx.navigateTo({
        url: '../activate/activate'
      })
    }
  },
  //点击跳转个人信息修改页面
  bindtapActive() {
    if (app.globalData.userstatus == 0) {
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
      wx.navigateTo({
        url: '../activate/activate'
      })
    }
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.onShow();
  },
  //点击收益跳转index
  bindtapIndex() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //点击头像跳转个人信心修改
  bindtapXiugai() {
    wx.navigateTo({
      url: '../activate/activate'
    })
  },
})