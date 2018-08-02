// pages/index/index.js
const app = getApp();
let totalPage = 0,
  currPage = 0;
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
    datas: [], //收益数据
    totalPage: 0, //总页数
    currPage: 0, //当前页数
    personal: '', //个人信息
    seeting: '', //提现转化为商城币的比例
    money: '', //用户输入的提现金额
    print: true, //判断用户是否重复点击提现
    daoIndex: -1, //导航
  },
  onLoad: function(options) {

  },
  onShow() {
    //判断是否是从提现记录回退到当前页面
    if (app.globalData.useraa && app.globalData.useraa == 1) {
      this.setData({
        datas: [], //收益数据
        totalPage: 0, //总页数
        currPage: 0, //当前页数
      })
      app.globalData.useraa = 0;
    }
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
    })
    this.getLists();
  },
  getLists() {
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
      //用户信息渲染
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
          this.setData({
            personal: res.data.userInfo,
            seeting: res.data.seeting
          })
        }
      });
      //页面收益记录渲染
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}CashDraws/distributMoneyList`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          p: this.data.currPage
        },
        success: res => {
          console.log(res);
          //第一页也是push到datas里的
          let tempArr = res.data.cashDraws,
            datas = this.data.datas;
          console.log(tempArr, datas)
          if (tempArr) {
            datas.push(...res.data.cashDraws)
          }
          this.setData({
            datas: datas,
            totalPage: res.data.totalPage,
            currPage: res.data.currPage
          })
          //消息已读和未读
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}CashDraws/updateDistributMoney`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              userId: app.globalData.userId
            },
            success: res => {
              console.log(res);
              console.log({
                totalPage: this.data.totalPage,
                currPage: this.data.currPage
              })
            }
          });
        }
      });
    }
  },
  //全部
  bindtapIndex() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: -1, //导航
    })
    wx.showLoading({
      title: '加载中',
    })
    //页面收益记录渲染
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/distributMoneyList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        p: this.data.currPage
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        //第一页也是push到datas里的
        let tempArr = res.data.cashDraws,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.cashDraws)
        }
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage
        })
      }
    });
  },
  //市场分红
  bindtapIndex1() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: 0, //导航
    })
    wx.showLoading({
      title: '加载中',
    })
    //页面收益记录渲染
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/distributMoneyList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        p: this.data.currPage,
        dataSrc: 5
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        //第一页也是push到datas里的
        let tempArr = res.data.cashDraws,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.cashDraws)
        }
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage
        })
      }
    });
  },
  //市场奖金
  bindtapIndex2() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: 1, //导航
    })
    wx.showLoading({
      title: '加载中',
    })
    //页面收益记录渲染
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/distributMoneyList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        p: this.data.currPage,
        dataSrc: '2,3'
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        //第一页也是push到datas里的
        let tempArr = res.data.cashDraws,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.cashDraws)
        }
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage
        })
      }
    });
  },
  //市场奖金
  bindtapIndex3() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: 2, //导航
    })
    wx.showLoading({
      title: '加载中',
    })
    //页面收益记录渲染
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/distributMoneyList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        p: this.data.currPage,
        dataSrc: 11
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        //第一页也是push到datas里的
        let tempArr = res.data.cashDraws,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.cashDraws)
        }
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage
        })
      }
    });
  },
  //全部商城币
  bindtapIndex4() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: 3, //导航
    })
    wx.showLoading({
      title: '加载中',
    })
    //商城币记录
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/userMoneyList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        p: this.data.currPage
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        let tempArr = res.data.cashDraws,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.cashDraws)
        }
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage
        })
      }
    });
  },
  //市场奖金
  bindtapIndex8() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: 8, //导航
    })
    wx.showLoading({
      title: '加载中',
    })
    //页面收益记录渲染
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/distributMoneyList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        p: this.data.currPage,
        dataSrc: 7
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        //第一页也是push到datas里的
        let tempArr = res.data.cashDraws,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.cashDraws)
        }
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage
        })
      }
    });
  },
  //市场分红
  bindtapIndex5() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: 4, //导航
    })
    wx.showLoading({
      title: '加载中',
    })
    //商城币记录
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/distributMoneyList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        p: this.data.currPage,
        dataSrc: 12
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        let tempArr = res.data.cashDraws,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.cashDraws)
        }
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage
        })
      }
    });
  },
  //市场奖金
  bindtapIndex6() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: 5, //导航
    })
    wx.showLoading({
      title: '加载中',
    })
    //商城币记录
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/distributMoneyList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        p: this.data.currPage,
        dataSrc: 9
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        let tempArr = res.data.cashDraws,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.cashDraws)
        }
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage
        })
      }
    });
  },
  //市场奖金
  bindtapIndex7() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: 6, //导航
    })
    wx.showLoading({
      title: '加载中',
    })
    //商城币记录
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}CashDraws/distributMoneyList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        p: this.data.currPage,
        dataSrc: 10
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        let tempArr = res.data.cashDraws,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.cashDraws)
        }
        this.setData({
          datas: datas,
          totalPage: res.data.totalPage,
          currPage: res.data.currPage
        })
      }
    });
  },
  //点击全部提现后
  bindtapSuoyou() {
    let usersMoney = parseInt( this.data.personal.distributmoney * 1 / 100 ) * 100 ;
    console.log(usersMoney);
    this.setData({
      money: usersMoney
    })
  },
  //提现输入框输入的金额
  bindinputMoney(e) {
    this.setData({
      money: e.detail.value
    })
  },
  //提现点击提交
  bindtapTixian() {
    if (this.data.print == false) return;
    this.setData({
      print: false
    })
    let minmoney = this.data.seeting.cashStartMoney
    console.log(minmoney)
    console.log(this.data.money)
    if (this.data.money * 1 < minmoney * 1) {
      wx.showToast({
        title: `金额不小于${minmoney}`,
        image: '../../assets/warning.png',
        duration: 2000
      })
      this.setData({
        print: true
      })
    } else if (this.data.money * 1 > this.data.personal.distributmoney * 1) {
      wx.showToast({
        title: `余额不足`,
        image: '../../assets/warning.png',
        duration: 2000
      })
      this.setData({
        print: true
      })
    } else if (this.data.money % 100) {
      wx.showToast({
        title: `提现金额为整百`,
        image: '../../assets/warning.png',
        duration: 2000
      })
      this.setData({
        print: true
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}CashDraws/CashDraws`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          money: this.data.money
        },
        success: res => {
          wx.hideLoading()
          console.log(res);
          console.log(this.data.money);
          if (res.data.status == 1) {
            wx.showToast({
              title: '提现成功，请耐心等待后台审核',
              icon: 'none',
              duration: 1500
            });
            setTimeout(() => {
              this.hidePopup();
              wx.navigateTo({
                url: `../recharge/recharge?useraa=1`
              });
            }, 1200)
            this.setData({
              print: false
            })
          } else {
            this.setData({
              print: true
            })
            wx.showToast({
              title: `提现失败`,
              image: '../../assets/warning.png',
              duration: 2000
            })
          }
        }
      });
    }
  },
  //上拉触底事件（分页）
  onReachBottom() {
    if (this.data.currPage < this.data.totalPage) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        currPage: this.data.currPage * 1 + 1
      })
      this.getLists();
    }
  },
  //显示弹窗
  showPopup(e) {
    this.setData({
      print: true
    })
    let newdate = new Date().getDay();
    console.log(newdate)
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
    } else if (newdate != 0) {
      wx.showToast({
        title: '提现功能只在周日开放，请耐心等待',
        icon: 'none',
        duration: 2000
      })
    } else {
      console.log(e)
      console.log('yes')
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
    }, 500);
  },

  //关闭弹窗
  handleClosePopup() {
    this.hidePopup();
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.setData({
      datas: [], //收益数据
      totalPage: 0, //总页数
      currPage: 0, //当前页数
      daoIndex: -1
    })
    this.getLists();
  },
})