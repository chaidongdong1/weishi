// pages/activate/activate.js
const app = getApp();
let datas, usernames, phones, shenfen, yinhang, kaihu, userAreas, userPwd2, userPwd1, roms, passwords; //获取到的讲师和店面的数值
Page({
  data: {
    // lecturer: [], //讲师
    store: [], //店面
    storeIndex: 0, //店面下标
    userInfo: '', //用户信息
    mask: true,
    baseUrl: app.globalData.baseUrl, //图片路径
    datasIndex:0,   //选择的商品下标
    activeLibao:{createtime:"2018-06-12 10:52:20",goodsid:"243",goodsimg:"2018-06-12/1528771926590985075470074711.jpg",goodsname:"浴巾",goodssort:"0",goodsspec:"",goodsthums:"2018-06-12/thumb_1528771926590985075470074711.jpg",s_createtime:"1528771940",salecount:"16",shopprice:"288.00"},   //身份激活后选中的礼包
    datas:[]     //礼包数组
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    //礼包接口
    wx.request({
      url: `${app.globalData.api}goods/index`,
      success:res=>{
        console.log(res);
        this.setData({
          datas:res.data
        })
      }
    });
    //用户信息接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}WxUsers/getUserInfo`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        this.setData({
          userInfo: res.data.userInfo
        })
        console.log(this.data.userInfo)
        if (this.data.userInfo.userstatus != -1 || this.data.userInfo.userstatus == null) {
          wx.setNavigationBarTitle({
            title: '信息修改'
          });
          usernames = this.data.userInfo.realname;
          phones = this.data.userInfo.userphone;
          shenfen = this.data.userInfo.useridcard;
          yinhang = this.data.userInfo.userbankcard;
          kaihu = this.data.userInfo.userbankress;
          userAreas = this.data.userInfo.userareas;
          console.log("--------------")
          console.log(this.data.userInfo.realname)
        }
      }
    });
    //讲师和店面
    wx.request({
      url: `${app.globalData.api}WxUsers/userChoose`,
      success: res => {
        console.log(res);
        datas = res.data;
        // let lecturer = res.data.tea.map(item => item.teaname);
        // lecturer.unshift('请选择讲师');
        let store = res.data.rom.map(item => item.romname);
        store.unshift('请选择店面');
        this.setData({
          // lecturer: lecturer,
          store: store
        })
      }
    });
  },
  //点击选择礼包
  bindtapXuanze(e){
    console.log(e)
    this.setData({
      datasIndex:e.currentTarget.dataset.datasindex
    })
  },
  //输入的姓名
  bindinputName(e) {
    usernames = e.detail.value.replace(/[^\u4E00-\u9FA5]/g, '');
    console.log(usernames)
    return { value: usernames };
  },
  //手机号码
  bindinputPhone(e) {
    phones = e.detail.value;
  },
  //身份证号
  bindinputShenno(e) {
    shenfen = e.detail.value;
  },
  //银行卡号
  bindinputYinhang(e) {
    yinhang = e.detail.value;
  },
  //开户行
  bindinputKaihu(e) {
    kaihu = e.detail.value;
  },
  //地址
  bindinputAddress(e) {
    userAreas = e.detail.value;
  },
  //输入密码
  bindinputPassword1(e) {
    userPwd1 = e.detail.value;
  },
  //确认密码
  bindinputPassword2(e) {
    userPwd2 = e.detail.value;
  },
  //讲师选择
  // bindPickerlecturer(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   let index = e.detail.value;
  //   this.setData({
  //     lecturerIndex: index
  //   });
  //   console.log(datas)
  //   console.log(this.data.lecturer[index])
  //   teas = datas.tea.filter(item => item.teaname == this.data.lecturer[index])[0].userid;
  //   console.log(teas)
  // },
  //店铺选择
  bindPickerstore(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let indexs = e.detail.value;
    this.setData({
      storeIndex: indexs
    });
    roms = datas.rom.filter(item => item.romname == this.data.store[indexs])[0].userid;
    console.log(roms)
  },

  //点击激活
  bindtapJihuo() {
    console.log(userPwd1 === userPwd2)
    if (this.data.userInfo.userstatus == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '信息正在审核中，请勿重复修改',
        showCancel: false
      })
    } else if (!usernames) {
      wx.showToast({
        title: '请输入姓名',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (!phones) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (!shenfen) {
      wx.showToast({
        title: '请输入身份证号',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (!yinhang) {
      wx.showToast({
        title: '请输入银行卡号',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (!kaihu) {
      wx.showToast({
        title: '请输入开户行',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (!userAreas) {
      wx.showToast({
        title: '请输入联系地址',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (this.data.storeIndex == 0 && this.data.userInfo.userstatus == -1) {
      wx.showToast({
        title: '请选择店面',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (!userPwd1 && this.data.userInfo.userstatus == -1) {
      wx.showToast({
        title: '请输入用户密码',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (this.data.userInfo.userstatus == -1 && userPwd1.length < 6) {
      wx.showToast({
        title: '用户密码至少输入6位',
        icon: 'none',
        duration: 1500
      })
    } else if (!userPwd2 && this.data.userInfo.userstatus == -1) {
      wx.showToast({
        title: '请输入确认密码',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (this.data.userInfo.userstatus == -1 && userPwd2.length < 6) {
      wx.showToast({
        title: '确认密码至少输入6位',
        icon: 'none',
        duration: 1500
      })
    } else if (userPwd1 != userPwd2 && this.data.userInfo.userstatus == -1) {
      wx.showToast({
        title: '密码输入不一致',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (this.data.userInfo.userstatus != -1) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}WxUsers/editUserInfo`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          realName: usernames,
          userPhone: phones,
          userIDCard: shenfen,
          userBankCard: yinhang,
          userBankRess: kaihu,
          userAreas: userAreas
        },
        success: res => {
          wx.hideLoading()
          console.log(res);
          console.log({
            userId: app.globalData.userId,
            realName: usernames,
            userPhone: phones,
            userIDCard: shenfen,
            userBankCard: yinhang,
            userBankRess: kaihu,
            userAreas: userAreas
          })
          if (res.data.status == 1) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1500
            });
            setTimeout(function() {
              wx.switchTab({
                url: '../shop/shop'
              })
            }, 1500)
          } else {
            wx.showToast({
              title: '修改失败',
              image: '../../assets/warning.png',
              duration: 1500
            })
          }
        }
      });
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}WxUsers/userActivate`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          realName: usernames,
          userPhone: phones,
          userIDCard: shenfen,
          userBankCard: yinhang,
          userBankRess: kaihu,
          userAreas: userAreas,
          userPwd: userPwd1,
          romId: roms,
          giftId:this.data.datas[this.data.datasIndex].goodsid
        },
        success: res => {
          wx.hideLoading()
          console.log(res);
          console.log({
            userId: app.globalData.userId,
            realName: usernames,
            userPhone: phones,
            userIDCard: shenfen,
            userBankCard: yinhang,
            userBankRess: kaihu,
            userAreas: userAreas,
            romId: roms,
            giftId:this.data.datas[this.data.datasIndex].goodsid
          })
          if (res.data.status == 1) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1500
            });
            setTimeout(function() {
              wx.switchTab({
                url: '../shop/shop'
              })
            }, 1500)
          } else {
            wx.showToast({
              title: '提交失败',
              image: '../../assets/warning.png',
              duration: 1500
            })
          }
        }
      });
    }
  },
  //输入的密码
  bindinputPasswords(e) {
    passwords = e.detail.value;
  },
  //确认密码
  bindinputQueren() {
    if (!passwords) {
      wx.showToast({
        title: '请输入密码',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else {
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}WxUsers/checkUserPwd`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          oldPwd: passwords
        },
        success: res => {
          console.log({
            userId: app.globalData.userId,
            oldPwd: passwords
          })
          console.log(res);
          if (res.data.status == 1) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1500
            });
            this.setData({
              mask: false
            })
          } else {
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