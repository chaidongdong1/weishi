// pages/password/password.js
const app = getApp();
let password1, password2, password3;
Page({
  data: {

  },
  onLoad: function(options) {

  },
  // 原密码
  bindinputPassword1(e) {
    password1 = e.detail.value;
  },
  // 新密码
  bindinputPassword2(e) {
    password2 = e.detail.value;
  },
  // 确认新密码
  bindinputPassword3(e) {
    password3 = e.detail.value;
  },
  // 提交按钮
  bindtapJihuo() {
    console.log(password2==password3)
    if (!password1) {
      wx.showToast({
        title: '请输入原密码',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (password1.length<6) {
      wx.showToast({
        title: '原密码至少输入6位',
        icon:'none',
        duration: 1500
      })
    }else if (!password2) {
      wx.showToast({
        title: '请输入新密码',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (password2.length<6) {
      wx.showToast({
        title: '新密码至少输入6位',
        icon:'none',
        duration: 1500
      })
    }else if (!password3) {
      wx.showToast({
        title: '请确认新密码',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (password3.length<6) {
      wx.showToast({
        title: '确认密码至少输入6位',
        icon:'none',
        duration: 1500
      })
    }else if (password2 != password3) {
      wx.showToast({
        title: '密码输入不一致',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else {
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}WxUsers/editUserPwd`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          oldPwd: password1,
          newPwd: password2
        },
        success: res => {
          console.log({
            userId: app.globalData.userId,
            oldPwd: password1,
            newPwd: password2
          })
          console.log(res);
          if (res.data.status == 1) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1500
            });
            setTimeout(function() {
              wx.switchTab({
                url: '../my/my'
              })
            }, 1500)
          }else{
            wx.showToast({
              title: res.data.msg,
              image: '../../assets/warning.png',
              duration: 1500
            })
          }
        }
      });
    }
  },
})