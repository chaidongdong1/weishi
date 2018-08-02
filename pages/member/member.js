// pages/member/member.js
const app = getApp();
let userIds;
Page({
  data: {
    datas: [], //页面列表渲染
    totalPage: 0, //总页数
    currPage: 0 //当前页数
  },
  onLoad: function(options) {
    userIds = options.userId;
    console.log(options);
    this.getLists(userIds);
  },
  //点击跳转下一级
  bindtapXiaji(e) {
    if (e.currentTarget.dataset.count == 0) {
      wx.showToast({
        title: '该用户没有下级',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.setData({
        datas: [], //页面列表渲染
        totalPage: 0, //总页数
        currPage: 0, //当前页数
      })
      console.log(e)
      userIds = e.currentTarget.dataset.userid
      this.getLists(userIds);
    }
  },
  getLists(userId) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}WxUsers/directUser`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: userId,   //app.globalData.userId,
        p: this.data.currPage
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        let tempArr = res.data.memberList,
          datas = this.data.datas;
        console.log(tempArr, datas)
        if (tempArr) {
          datas.push(...res.data.memberList)
        }
        this.setData({
          datas: datas,
          currPage: res.data.currPage,
          totalPage: res.data.totalPage
        })
        console.log(this.data.datas)
      }
    });
  },
  //上拉刷新
  onPullDownRefresh: function() {
    this.setData({
      datas: [], //页面列表渲染
      totalPage: 0, //总页数
      currPage: 0 //当前页数
    });
    this.getLists(userIds);
  },
  //分页
  onReachBottom() {
    if (this.data.currPage < this.data.totalPage) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        currPage: this.data.currPage * 1 + 1
      })
      this.getLists(userIds);
    }
  },
})