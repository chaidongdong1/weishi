// pages/shopdetails/shopdetails.js
import WxParse from '../../wxParse/wxParse.js';
const app = getApp();
let goodsId, shopProperty, colorsNumber, sizesNumber;
Page({
  data: {
    colorarray: [], //选择颜色
    indexColor: 0, //颜色的下标
    typearray: [], //选择规格
    typemoney: [], //对应规格的价格
    indexType: 0, //规格的下标
    datas: '', //商品信息
    baseUrl: app.globalData.baseUrl, //图片路径
    number: 1, //商品选择的数量
    cartNumber: 0 //购物车总数量
  },
  //页面初次渲染
  onLoad: function(options) {
    console.log(options)
    goodsId = options.goodsid;
  },
  onShow() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}goods/getGoodsDetail`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        goodsId: goodsId   //商品ID   
      },
      success: res => {
        console.log(res)
        let numbers = res.data;
        console.log({
          goodsId: goodsId
        });
        if (!numbers.attrs || numbers.attrs.length == 0) {
          console.log("没有商品属性时")
          numbers.attrs = [{ attrval: '默认', id: -1, goodsid: numbers.goodsInfo.goodsid, attrid: -1 }];
          numbers.priceAttrs = [{ attrval: '默认', id: -1, goodsid: numbers.goodsInfo.goodsid, attrid: -1, attrprice: numbers.goodsInfo.shopprice }];
        }
        let colors = numbers.attrs.map(item => item.attrval);
        colors.unshift('请选择颜色');
        colorsNumber = numbers.attrs.map(item => item.id);
        colorsNumber.unshift('颜色id');
        let sizes = numbers.priceAttrs.map(item => item.attrval);
        sizes.unshift('请选择规格');
        sizesNumber = numbers.priceAttrs.map(item => item.id);
        sizesNumber.unshift('规格id');
        let typemoney = numbers.priceAttrs.map(item => item.attrprice);
        typemoney.unshift('下标');
        this.setData({
          datas: numbers.goodsInfo,
          colorarray: colors,
          typearray: sizes,
          typemoney: typemoney
        })
        console.log(this.data.colorarray)
        console.log(sizesNumber)
        console.log(this.data.typemoney)
        console.log(this.data.indexType)
        let article = res.data.goodsInfo.goodsspec;
        article = article.replace(/&amp;nbsp;/g, ' ');
        WxParse.wxParse('article', 'html', article, this, 5);
        wx.hideLoading();
      }
    });
    //获取购物车接口
    wx.getStorage({
      key: 'cartTrolley',
      success: res => {
        let cartTrolley = res.data ? JSON.parse(res.data) : [];
        app.globalData.cartNumber = cartTrolley.length == 0 ? 0 : cartTrolley.length * 1;
        this.setData({
          cartNumber: app.globalData.cartNumber
        });
      }
    })
    console.log(this.data.cartNumber)
  },
  //加入购物车之前获取商品属性
  shopProperty() {
    return {
      shopId: goodsId, //商品ID
      shopColor: this.data.colorarray[this.data.indexColor], //商品颜色
      shopSize: this.data.typearray[this.data.indexType], //商品规格
      shopMoney: this.data.typemoney[this.data.indexType], //商品价格
      shopName: this.data.datas.goodsname, //商品名字
      shopNumber: this.data.number, //商品数量
      shopimage: this.data.datas.goodsthums, //商品缩略图
      shopColorId: colorsNumber[this.data.indexColor], //颜色id
      sizesNumber: sizesNumber[this.data.indexType] //规格id
    };
  },
  //加入购物车按钮
  bindtapCarts() {
    console.log({
      shopId: goodsId, //商品ID
      shopColor: this.data.colorarray[this.data.indexColor], //商品颜色
      shopSize: this.data.typearray[this.data.indexType], //商品规格
      shopMoney: this.data.typemoney[this.data.indexType], //商品价格
      shopName: this.data.datas.goodsname, //商品名字
      shopNumber: this.data.number, //商品数量
      shopimage: this.data.datas.goodsthums, //商品缩略图
      shopColorId: colorsNumber[this.data.indexColor], //颜色id
      sizesNumber: sizesNumber[this.data.indexType] //规格id
    })
    if (this.data.indexColor == 0) {
      wx.showToast({
        title: '请选择颜色',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (this.data.indexType == 0) {
      wx.showToast({
        title: '请选择规格',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else {
      shopProperty = this.shopProperty();
      console.log(shopProperty)
      wx.getStorage({
        key: 'cartTrolley',
        //购物车里已经有该商品
        success: res => {
          console.log(res)
          let cartTrolley = res.data ? JSON.parse(res.data) : [];
          console.log(cartTrolley)
          // 如果购物车中已经存在相同的商品相同的规格 数量增加
          // 否则将商品加入购物车
          console.log(shopProperty.shopId, shopProperty.shopColor, shopProperty.shopSize)
          let shopsIds = cartTrolley.findIndex(res => res.shopId == shopProperty.shopId && res.shopColor == shopProperty.shopColor && res.shopSize == shopProperty.shopSize);
          console.log(shopsIds)
          if (shopsIds == -1) {
            //把当前的商品push到数组里
            cartTrolley.push(shopProperty);
            //存入缓存
            wx.setStorage({
              key: "cartTrolley",
              data: JSON.stringify(cartTrolley)
            });
            //数量加1
            app.globalData.cartNumber = cartTrolley.length * 1;
            this.setData({
              cartNumber: app.globalData.cartNumber
            });
            wx.showToast({
              icon: 'success',
              title: '添加成功',
              duration: 2000
            });
          } else {
            wx.showToast({
              icon: 'none',
              title: '购物车已存在该商品',
              duration: 2000
            });
          }
        },
        //商品第一次加入购物车
        fail: err => {
          //如果缓存中没有shopProperty 代表用户未加入过商品至购物车
          //为购物车中添加一件商品
          console.log(err)
          let cartTrolley = [shopProperty];
          console.log(cartTrolley)
          //存入缓存
          wx.setStorage({
            key: "cartTrolley",
            data: JSON.stringify(cartTrolley)
          });
          //数量加1
          app.globalData.cartNumber = cartTrolley.length * 1;
          this.setData({
            cartNumber: app.globalData.cartNumber
          })
          wx.showToast({
            icon: 'success',
            title: '添加成功',
            duration: 2000
          });
        }
      })
    }
  },
  //点击选择颜色事件
  bindPickerColor(e) {
    this.setData({
      indexColor: e.detail.value
    })
  },
  //点击选择规格事件
  bindPickerType(e) {
    this.setData({
      indexType: e.detail.value
    })
  },
  //商品数量增加
  bindtapjia() {
    this.setData({
      number: this.data.number * 1 + 1
    })
    console.log(this.data.number)
  },
  //商品数量减少
  bindtapjian() {
    if (this.data.number > 1) {
      this.setData({
        number: this.data.number * 1 - 1
      })
    } else {
      wx.showToast({
        title: '数量不能小于1',
        image: '../../assets/warning.png',
        duration: 2000
      })
    }
  },
  //立即购买跳转
  bindtapGoumai() {
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
    } else if (this.data.indexColor == 0) {
      wx.showToast({
        title: '请选择颜色',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else if (this.data.indexType == 0) {
      wx.showToast({
        title: '请选择规格',
        image: '../../assets/warning.png',
        duration: 1500
      })
    } else {
      let shopAA = this.shopProperty();
      app.globalData.shops = shopAA;
      console.log(shopAA)
      wx.navigateTo({
        url: '../close/close'
      })
    }
  },
})