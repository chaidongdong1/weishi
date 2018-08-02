//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            method: 'POST',
            url: `${this.globalData.api}WxUsers/get_openid`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              code: res.code,
              parentId: this.globalData.scene
            },
            success: res => {
              console.log(res);
              console.log(res.data.userId);
              this.globalData.userId = res.data.userId;
              console.log(this.globalData.parentID)
              //如果存在userId
              if (this.testFun) this.testFun();
              //如果存在parentID 需要记录
              if (this.globalData.parentID) {
                console.log("3333333333333")
                wx.request({
                  method: 'POST',
                  url: `${this.globalData.api}WxUsers/modify_parentid`,
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  data: {
                    userId: this.globalData.userId,
                    parentId: this.globalData.parentID
                  },
                  success: res => {
                    console.log(res)
                    console.log({
                      userId: this.globalData.userId,
                      parentId: this.globalData.parentID
                    })
                    wx.showModal({
                      content: res.data.msg,
                      showCancel: false
                    });
                  }
                })
              }
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    banbenNo: 0.02, //版本号
    userId: '', //用户id
    parentID: null,
    userInfo: null, //用户信息
    api: 'https://weishisc.honghuseo.cn/', //接口地址
    baseUrl: 'http://weishisc.honghuseo.cn/public/uploads/'
  }
})