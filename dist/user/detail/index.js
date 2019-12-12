'use strict';

// 获取全局应用程序实例对象
var app = getApp();
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    // tab: [
    //   '全部收益',
    //   '今日收益',
    //   '已到帐',
    //   '待到账'
    // ],
    // tabIndex: 0,
    // capsules: app.data.capsule,
    tab: ['我的奖励', '我的提现'],
    leftChoose: 0,
    page: 0,
    more: true,
    list: []
  },
  _tnBChoose: function _tnBChoose(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    });
  },
  _tnChoose: function _tnChoose() {
    this.setData({
      right: !this.data.right
    });
  },
  noUp: function noUp() {},
  _toggleGift: function _toggleGift() {
    this.setData({
      ruler: !this.data.ruler
    });
  },
  _leftChoose: function _leftChoose(e) {
    var _this = this;

    this.setData({
      leftChoose: e.currentTarget.dataset.index
    }, function () {
      _this.data.page = 0;
      _this.data.list = [];
      _this.getList();
    });
  },
  getList: function getList() {
    var _this2 = this;

    app.wxrequest({
      url: app.getUrl()[this.data.leftChoose >= 1 ? 'shopAppearList' : 'shopRewardList'],
      data: {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(function (res) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = res.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm:ss');
          v.finish_at = v.finish_at ? app.momentFormat(v.finish_at * 1000, 'YYYY-MM-DD HH:mm:ss') : null;
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
    this.getList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options,
      leftChoose: options.index || 0
    }, this.getList);
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