// pages/addaddress/addaddress.js
const app = getApp();
let names, phones, address, adddetails, latitude, longitude, id, checkeds;
Page({
  data: {
    address: '请选择地址', //选择的地址
    checked: false, //是否为默认地址
    datas: {}, //修改地址
    isnone: 0, //是否渲染修改的地址
    id: ''
  },
  onLoad: function(options) {
    console.log(options)
    id = options.id;
    if (id) {
      this.setData({
        id: options.id
      })
      wx.setNavigationBarTitle({
        title: '修改地址'
      });
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}UserAddress/getAddressDetail`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          id: id
        },
        success: res => {
          wx.hideLoading();
          console.log(res);
          this.setData({
            datas: res.data,
            address: res.data.address,
            checked: res.data.isdefault == 1 ? true : false
          })
          names = this.data.datas.username;
          phones = this.data.datas.userphone;
          address = this.data.datas.address;
          adddetails = this.data.datas.areaid1;
          checkeds = this.data.datas.isdefault;
          latitude = this.data.datas.areaid2;
          longitude = this.data.datas.areaid3;
        }
      });
    }
  },
  //输入姓名
  bindinputName(e) {
    console.log(e);
    names = e.detail.value.replace(/[^\u4E00-\u9FA5]/g, '');
    return { value: names };
  },
  //输入电话
  bindinputPhone(e) {
    phones = e.detail.value;
  },
  //点击选取地址
  bindtapAddress() {
    wx.showLoading({
      title: '加载中',
    })
    // 点击选择按钮之后打开地图选择地址
    wx.getLocation({
      type: 'wgs84',
      // 如果成功 直接选择地址
      success: res => {
        wx.hideLoading();
        this.chooseAddress();
      },
      // 如果选择失败 打开设置 重新授权
      fail: res => {
        wx.hideLoading();
        wx.openSetting({
          success: res => {
            if (res.authSetting['scope.userLocation']) {
              this.chooseAddress();
            }
          }
        });
      }
    });
  },
  //选择地址
  chooseAddress() {
    wx.chooseLocation({
      success: res => {
        console.log(res)
        latitude = res.latitude;
        longitude = res.longitude;
        address = res.address != '' ? res.address : res.name;
        this.setData({
          address: address,
          isnone: 1
        })
      }
    })
  },
  //详细地址
  bindinputText(e) {
    adddetails = e.detail.value;
  },
  //默认地址
  checkboxChange() {
    if (this.data.checked == false) {
      this.setData({
        checked: true
      })
    } else {
      this.setData({
        checked: false
      })
    }
  },
  //提交按钮
  bindtapTianjia() {
    if (this.data.checked == false) {
      checkeds = 0;
    } else {
      checkeds = 1;
    }
    console.log(names, phones, address, adddetails, checkeds)
    if (!names) {
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
    } else if (this.data.address == '请选择地址') {
      wx.showToast({
        title: '请选择地址',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (!adddetails) {
      wx.showToast({
        title: '请输入详细地址',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (id) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}UserAddress/optionUserAddress`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          userName: names,
          userPhone: phones,
          address: address,
          isDefault: checkeds,
          addressId: id,
          areaId1: adddetails,
          areaId2: latitude,
          areaId3: longitude
        },
        success: res => {
          wx.hideLoading()
          console.log(res);
          console.log("22222222222222")
          if (res.data.status == 1) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          } else {
            wx.showToast({
              title: '修改失败',
              image: '../../assets/warning.png',
              duration: 2000
            });
          }
        }
      });
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        method: 'POST',
        url: `${app.globalData.api}UserAddress/optionUserAddress`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          userId: app.globalData.userId,
          userName: names,
          userPhone: phones,
          address: address,
          isDefault: checkeds,
          areaId1: adddetails,
          areaId2: latitude,
          areaId3: longitude
        },
        success: res => {
          wx.hideLoading()
          console.log(res);
          console.log("1111111111111111")
          if (res.data.status == 1) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          } else {
            wx.showToast({
              title: '添加失败',
              image: '../../assets/warning.png',
              duration: 2000
            });
          }
        }
      });
    }
  },
})