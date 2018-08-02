// pages/logins/logins.js
const app = getApp();
let getedScene;
Page({

  data: {
    showModal: false, //判断授权弹窗
    mallName: {}, //商家信息
    imgUrls: []  //轮播图
  },
  onLoad(options) {
    //向后台传用户信息
    //授权弹窗一开始不显示，等于true时才显示
    wx.getSetting({
      success: (res) => {
        console.log("------------------------")
        //授权过以后
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            showModal: false
          });
        } else {
          this.setData({
            showModal: true
          });
        }
      }
    });
    console.log(options)
    //扫码进入
    if (options.scene) {
      console.log('----------------------------------');
      getedScene = decodeURIComponent(options.scene);
      console.log(getedScene);
      if (app.globalData.userId) {
        console.log("22222222222222")
        wx.request({
          method: 'POST',
          url: `${app.globalData.api}WxUsers/modify_parentid`,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            userId: app.globalData.userId,
            parentId: getedScene
          },
          success: res => {
            console.log(res);
            wx.showModal({
              content: res.data.msg,
              showCancel: false
            });
          }
        })
      } else {
        console.log("111111111111")
        app.globalData.parentID = getedScene;
      }
    }
  },
  onShow() {
    if (app.globalData.userId) {
      this.testFun();
    } else {
      app.testFun = this.testFun;
    }
  },
  //判断页面加载时是否有userId，如果没有就挂载到APP.js里执行
  testFun() {
    wx.showLoading({
      title: '加载中',
    })
    console.log('在app.js中执行了shop.js中的testFun方法')
    //个人用户信息
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}WxUsers/getUserInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          mallName: res.data.seeting
        })
        console.log(app.globalData.userInfo)
        console.log(res);
        app.globalData.userstatus = res.data.userInfo.userstatus
      }
    });
    wx.request({
      url:`${app.globalData.api}index/getLoginAds`,
      success:res=>{
        wx.hideLoading();
        console.log(res);
        let imgeas = res.data.banner.map(item => app.globalData.baseUrl+item.adfile);
        this.setData({
          mallName:res.data.setting,
          imgUrls:imgeas
        })
        console.log('')
      }
    });
  },
  //开始授权
  authorizationSuccess() {
    this.setData({
      showModal: false
    });
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        console.log("=======================")
        var userInfo = res.userInfo;
        var nickName = userInfo.nickName;
        var avatarUrl = userInfo.avatarUrl;
        var gender = userInfo.gender; //性别 0：未知、1：男、2：女 
        var province = userInfo.province;
        var city = userInfo.city;
        var country = userInfo.country;
        var signature = res.signature;
        var encryptData = res.encryptData;
        wx.request({
          method: 'POST',
          url: `${app.globalData.api}WxUsers/getUserInfo`,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            userId: app.globalData.userId,
            userName: nickName,
            userPhoto: avatarUrl,

          },
          success: res => {
            console.log(res);
          }
        });
      },
    });
  },
  onGotUserInfo(e) {
    console.log(e)
    console.log("+++++++++++++++++++++++++++++")
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.authorizationSuccess();
    }
  },
  //进入商城
  bindtapShop() {
    wx.switchTab({
      url: '../shop/shop'
    })
  },
  //显示弹窗
  showPopup(e) {
    wx.showLoading({
      title: '加载中',
    })
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