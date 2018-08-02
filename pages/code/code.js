// pages/code/code.js
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
    personal: '', //个人信息
    seeting: '', //提现转化为商城币的比例
    money: '', //用户输入的提现金额
    baseUrl: app.globalData.baseUrl, //图片路径
    print: true //判断用户是否重复点击提现
  },
  onLoad: function(options) {

  },
  onShow() {
    //用户信息渲染
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
        console.log(res);
        this.setData({
          personal: res.data.userInfo,
          seeting: res.data.seeting
        })
        wx.hideLoading()
      }
    });
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
    let minmoney = this.data.seeting.cashStartMoney;
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
    } else if (this.data.personal.distributmoney * 1 < this.data.money * 1) {
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
                url: '../recharge/recharge'
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
              title: '提现失败',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        }
      });
    }
  },
  //显示弹窗
  showPopup(e) {
    this.setData({
      print: true
    })
    let newdate = new Date().getDay();
    console.log(newdate)
    if (newdate != 0) {
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
  handleRecordMoeny(e) {
    money = e.detail.value;
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