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
    capsule: {
      transparent: true,
      bgc: ''
    },
    capsules: app.data.capsule,
    userNav: [{
      t: '待付款',
      i: 'https://c.jiangwenqiang.com/lqsy/shop_0.png',
      u: '/shop/order/index?type=1'
    }, {
      t: '待发货',
      i: 'https://c.jiangwenqiang.com/lqsy/shop_1.png',
      u: '/shop/order/index?type=2'
    }, {
      t: '待收货',
      i: 'https://c.jiangwenqiang.com/lqsy/shop_2.png',
      u: '/shop/order/index?type=3'
    }, {
      t: '退货/售后',
      i: 'https://c.jiangwenqiang.com/lqsy/shop_3.png',
      u: '/shop/order/index?type=0'
    }, {
      t: '全部订单',
      i: 'https://c.jiangwenqiang.com/lqsy/shop_4.png',
      u: '/shop/order/index?type=0'
    }, {
      t: '我的团队',
      i: 'https://c.jiangwenqiang.com/lqsy/shop_5.png',
      u: '/user/team/index?type=shop'
    }, {
      t: '邀请好友',
      i: 'https://c.jiangwenqiang.com/lqsy/shop_6.png',
      u: '/share/carShare/carShare?type=inviteFriend'
    }, {
      t: '我的积分',
      i: 'https://c.jiangwenqiang.com/lqsy/shop_7.png',
      u: '/shop/score/index'
    }],
    uiOp: [{
      t: '帖子',
      n: 13,
      url: '/user/collect/index?type=send'
    }, {
      t: '评论',
      n: 13,
      url: '/user/comment/index?type=comment'
    }, {
      t: '粉丝',
      n: 13,
      url: '/user/comment/index?type=fans'
    }],
    tabArr: [{
      t: '我的师友',
      i: '',
      url: '/user/team/index'
    }, {
      t: '邀约好友',
      i: '',
      url: '/share/carShare/carShare?type=user'
    }, {
      t: '关于刘谦',
      i: '',
      url: ''
    }, {
      t: '我的消息',
      i: '',
      url: '/user/message/index'
    }],
    userInfo: app.gs('userInfoAll')
  },
  goUrl: function goUrl(e) {
    if (this.data.userNav[e.currentTarget.dataset.index].t === '邀请好友') {
      app.su('scene', '7*' + app.gs('userInfoAll').uid);
    }
    wx.navigateTo({
      url: this.data.userNav[e.currentTarget.dataset.index].u
    });
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  _toggleSign: function _toggleSign() {
    this.setData({
      sign: !this.data.sign
    });
  },
  shopUser: function shopUser() {
    var _this = this;

    app.wxrequest({
      url: app.getUrl().shopUser,
      data: {
        uid: app.gs('userInfoAll').uid
      }
    }).then(function (res) {
      res['rankText'] = app.gs('rankLv')[res.rank];
      _this.setData({
        userInfo: res
      });
    }, function () {
      app.toast({
        content: '您尚未登陆，请先登陆系统',
        mask: true
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/user/login/index'
        });
      }, 1000);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {},

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
    this.shopUser();
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

  // onShareAppMessage () {
  //   // return {
  //   //   title: app.gs('shareText').t || '绣学问，真纹绣',
  //   //   path: `/pages/index/index`,
  //   //   imageUrl: app.gs('shareText').g
  //   // }
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});