// pages/currency/currency.js
const app = getApp();
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
    datas: [], //记录数据
    totalPage: 0, //总页数
    currPage: 0, //当前页数
    usermoney: 0, //用户当前剩余额度
    shops: '', //商家信息
    money: '', //用户输入的充值金额
    print: true, //判断是否重复点击充值
    // daoIndex: -1
  },
  onLoad: function(options) {
    this.getLists();
  },
  getLists() {
    wx.showLoading({
      title: '加载中',
    })
    //用户和商家信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}WxUsers/getUserInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        console.log(res);
        this.setData({
          usermoney: res.data.userInfo.usermoney,
          shops: res.data.seeting
        })
      }
    });
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
  // //全部
  // bindtapIndex() {
  //   this.setData({
  //     datas: [], //收益数据
  //     totalPage: 0, //总页数
  //     currPage: 0, //当前页数
  //     daoIndex: -1, //导航
  //   })
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   //商城币记录
  //   wx.request({
  //     method: 'POST',
  //     url: `${app.globalData.api}CashDraws/userMoneyList`,
  //     header: { 'content-type': 'application/x-www-form-urlencoded' },
  //     data: {
  //       userId: app.globalData.userId,
  //       p: this.data.currPage
  //     },
  //     success: res => {
  //       wx.hideLoading();
  //       wx.stopPullDownRefresh();
  //       console.log(res);
  //       let tempArr = res.data.cashDraws,
  //         datas = this.data.datas;
  //       console.log(tempArr, datas)
  //       if (tempArr) {
  //         datas.push(...res.data.cashDraws)
  //       }
  //       this.setData({
  //         datas: datas,
  //         totalPage: res.data.totalPage,
  //         currPage: res.data.currPage
  //       })
  //     }
  //   });
  // },
  // //市场分红
  // bindtapIndex1() {
  //   this.setData({
  //     datas: [], //收益数据
  //     totalPage: 0, //总页数
  //     currPage: 0, //当前页数
  //     daoIndex: 0, //导航
  //   })
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   //商城币记录
  //   wx.request({
  //     method: 'POST',
  //     url: `${app.globalData.api}CashDraws/userMoneyList`,
  //     header: { 'content-type': 'application/x-www-form-urlencoded' },
  //     data: {
  //       userId: app.globalData.userId,
  //       p: this.data.currPage,
  //       dataSrc: 4
  //     },
  //     success: res => {
  //       wx.hideLoading();
  //       wx.stopPullDownRefresh();
  //       console.log(res);
  //       let tempArr = res.data.cashDraws,
  //         datas = this.data.datas;
  //       console.log(tempArr, datas)
  //       if (tempArr) {
  //         datas.push(...res.data.cashDraws)
  //       }
  //       this.setData({
  //         datas: datas,
  //         totalPage: res.data.totalPage,
  //         currPage: res.data.currPage
  //       })
  //     }
  //   });
  // },
  // //市场奖金
  // bindtapIndex2() {
  //   this.setData({
  //     datas: [], //收益数据
  //     totalPage: 0, //总页数
  //     currPage: 0, //当前页数
  //     daoIndex: 1, //导航
  //   })
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   //商城币记录
  //   wx.request({
  //     method: 'POST',
  //     url: `${app.globalData.api}CashDraws/userMoneyList`,
  //     header: { 'content-type': 'application/x-www-form-urlencoded' },
  //     data: {
  //       userId: app.globalData.userId,
  //       p: this.data.currPage,
  //       dataSrc: 6
  //     },
  //     success: res => {
  //       wx.hideLoading();
  //       wx.stopPullDownRefresh();
  //       console.log(res);
  //       let tempArr = res.data.cashDraws,
  //         datas = this.data.datas;
  //       console.log(tempArr, datas)
  //       if (tempArr) {
  //         datas.push(...res.data.cashDraws)
  //       }
  //       this.setData({
  //         datas: datas,
  //         totalPage: res.data.totalPage,
  //         currPage: res.data.currPage
  //       })
  //     }
  //   });
  // },
  // //市场奖金
  // bindtapIndex3() {
  //   this.setData({
  //     datas: [], //收益数据
  //     totalPage: 0, //总页数
  //     currPage: 0, //当前页数
  //     daoIndex: 2, //导航
  //   })
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   //商城币记录
  //   wx.request({
  //     method: 'POST',
  //     url: `${app.globalData.api}CashDraws/userMoneyList`,
  //     header: { 'content-type': 'application/x-www-form-urlencoded' },
  //     data: {
  //       userId: app.globalData.userId,
  //       p: this.data.currPage,
  //       dataSrc: 7
  //     },
  //     success: res => {
  //       wx.hideLoading();
  //       wx.stopPullDownRefresh();
  //       console.log(res);
  //       let tempArr = res.data.cashDraws,
  //         datas = this.data.datas;
  //       console.log(tempArr, datas)
  //       if (tempArr) {
  //         datas.push(...res.data.cashDraws)
  //       }
  //       this.setData({
  //         datas: datas,
  //         totalPage: res.data.totalPage,
  //         currPage: res.data.currPage
  //       })
  //     }
  //   });
  // },
  //获取用户输入的金额
  handleRecordMoeny(e) {
    this.setData({
      money: e.detail.value
    })
  },
  //充值按钮
  bindtapChongzhi() {
    if (!this.data.print) return;
    this.setData({
      print: false
    })
    if (this.data.money * 1 <= 0) {
      wx.showToast({
        title: '金额不能小于0',
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
        url: `${app.globalData.api}CashDraws/rechargeMoney`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          type: 0,
          money: this.data.money
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          if (res.data.status == 1) {
            wx.showToast({
              title: '充值成功，请耐心等待后台审核',
              icon: 'none',
              duration: 1500
            });
            setTimeout(() => {
              this.hidePopup();
              wx.navigateTo({
                url: '../withdraw/withdraw'
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
              title: `充值失败`,
              image: '../../assets/warning.png',
              duration: 2000
            })
          }
        }
      });
    }
  },
  //分页
  onReachBottom() {
    if (this.data.currPage * 1 < this.data.totalPage * 1) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        currPage: this.data.currPage * 1 + 1
      })
      this.getLists();
    }
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.setData({
      datas: [], //记录数据
      totalPage: 0, //总页数
      currPage: 0 //当前页数
    })
    this.getLists();
    // if (this.data.daoIndex == -1) {
    // this.getLists();
    // }else if (this.data.daoIndex == 0) {
    //   this.bindtapIndex1();
    // }else if (this.data.daoIndex == 1) {
    //   this.bindtapIndex2();
    // }else{
    //   this.bindtapIndex3();
    // }
  },
  //显示弹窗
  showPopup(e) {
    this.setData({
      print: true
    })
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
})