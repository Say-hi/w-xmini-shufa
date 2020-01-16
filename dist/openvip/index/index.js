'use strict';

// 获取全局应用程序实例对象
var app = getApp();
// const bmap = require('../../utils/bmap-wx')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openType: 'reLaunch',
    rankIndex: 0,
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    checkIos: true,
    system: app.data.system.system.indexOf('iOS') >= 0
  },
  getInfo: function getInfo() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().rankCard,
      data: {
        // rank: 1,
        state: 1
      }
    }).then(function (res) {
      that.setData({
        info: res
      });
    });
  },
  change: function change(e) {
    this.setData({
      rankIndex: e.detail.current
    });
  },
  checkUser: function checkUser() {
    var info = app.gs('userInfoAll');
    if (!info) {
      app.toast({
        content: '请您登陆后再进行此操作',
        mask: true,
        time: 2100
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/user/login/index'
        });
      }, 2000);
    }
  },
  getData: function getData() {
    var that = this;
    wx.request({
      url: app.getExactlyUrl(app.getUrl().shopIosCheck),
      success: function success(res) {
        if (res.statusCode !== 200) {
          app.cloud().getPermission().then(function (res2) {
            that.setData({
              checkIos: res2.check
            });
          });
        } else {
          that.setData({
            checkIos: res.data.data.check
          });
        }
      }
    });
  },
  goVip: function goVip(e) {
    if (this.data.system && this.data.checkIos) return app.toast({ content: '苹果端请点击联系官方通过人工进行开通', image: '' });
    wx.navigateTo({
      url: '../buy/index?index=' + e.currentTarget.dataset.index
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    var pages = getCurrentPages();
    pages[pages.length - 2 >= 0 ? pages.length - 2 : 0].route === 'pages/index/index' && this.setData({
      openType: 'navigateBack'
    });
    this.getData();
    this.getInfo();
    // let that = this
    // if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin()
    // this.getUser()
    // app.getNavTab({
    //   style: 3,
    //   cb (res) {
    //     that.setData({
    //       swiperArr: res.data.data
    //     })
    //     app.getNavTab({
    //       style: 2,
    //       cb (res) {
    //         that.setData({
    //           tabNav: res.data.data
    //         })
    //         that.getCourse()
    //       }
    //     })
    //   }
    // })
    // this.Bmap(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    // console.log(' ---------- onReady ----------')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    this.checkUser();
    // this.setKill()
    // console.log(' ---------- onShow ----------')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },
  onShareAppMessage: function onShareAppMessage() {
    // return {
    //   title: app.gs('shareText').t || '绣学问，真纹绣',
    //   path: `/pages/index/index`,
    //   imageUrl: app.gs('shareText').g
    // }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});