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
    tabIndex: 0,
    tabId: 0,
    page: 0,
    list: [],
    more: true,
    tabArr: ['推荐', '楷书', '行书', '草书', '隶书', '篆书', '魏碑', '综合'],
    tabArr2: ['楷书', '行书', '草书', '隶书', '篆书', '魏碑', '综合']
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  chooseIndex: function chooseIndex(e) {
    this.data.page = 0;
    this.data.list = [];
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    }, this.getList);
  },
  getList: function getList() {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoVideoList' : 'teachVideoList'],
      data: this.data.main ? {
        uid: app.gs('userInfoAll').uid,
        state: that.data.tabIndex * 1 + 1,
        page: ++that.data.page
      } : {
        uid: app.gs('userInfoAll').uid,
        state: that.data.tabIndex < 1 ? 1 : that.data.tabIndex,
        is_recommend: that.data.tabIndex < 1 ? 1 : 0,
        page: ++that.data.page
      }
    }).then(function (res) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = res.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          v.hits = v.hits > 10000 ? Math.floor(v.hits / 10000) + 'w' : v.hits;
          v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD') : '时间不详';
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      that.setData({
        list: that.data.list.concat(res.lists)
      });
      that.data.more = res.lists.length >= res.pre_page;
    }, function () {
      --that.data.page;
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    var _this = this;

    app.checkPrivier().then(function (res) {
      if (res.check || res.data.data.check) {
        app.toast({ content: '内容根据微信运营规则,禁止展示' });
        return wx.redirectTo({ url: '/pages/index/index' });
      }
      _this.setData({
        noCheck: true,
        main: options.from === 'main'
      }, _this.getList);
    }, function (err) {
      console.error(err);
    });
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
    app.checkUser({ login: false });
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
    return {
      path: '/teaching/index/index?from=' + (this.data.main ? 'main' : 'nav')
    };
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});