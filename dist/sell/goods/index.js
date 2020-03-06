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
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    list: [],
    page: 0,
    more: true
  },
  goodsOperation: function goodsOperation(e) {
    var _this = this;

    if (e.currentTarget.dataset.type === 'edit') {
      return app.toast({
        content: '跳转编辑中~'
      });
    }
    app.wxrequest({
      url: app.getUrl().sellChange,
      data: {
        uid: app.gs('userInfoAll').uid,
        pid: this.data.list[e.currentTarget.dataset.index].id,
        state: e.currentTarget.dataset.type === 'del' ? 1 : e.currentTarget.dataset.type === 'up' ? 2 : 3
      }
    }).then(function (res) {
      app.toast({
        content: '\u4EA7\u54C1\u5DF2' + (e.currentTarget.dataset.type === 'del' ? '删除' : e.currentTarget.dataset.type === 'up' ? '上架' : '下架')
      });
      _this.data.list.splice(e.currentTarget.dataset.index, 1);
      _this.setData({
        list: _this.data.list
      });
    });
  },
  getlist: function getlist() {
    var _this2 = this;

    app.wxrequest({
      url: app.getUrl().shopProducts,
      data: {
        cid: 3,
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(function (res) {
      _this2.setData({
        list: _this2.data.list.concat(res.lists)
      });
      _this2.data.more = res.lists.length >= res.pre_page;
    });
  },
  onReachBottom: function onReachBottom() {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多内容了'
      });
    }
    this.getlist();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      op: options
    });
    this.getlist();
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
  onShow: function onShow() {},

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