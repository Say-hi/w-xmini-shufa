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
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    capsules: app.data.capsule,
    page: 0,
    more: true,
    list: []
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
  shopTeamList: function shopTeamList() {
    var _this = this;

    app.wxrequest({
      url: app.getUrl()[this.data.options.type === 'shop' ? 'shopTeamList' : 'userFriend'],
      data: this.data.options.type === 'shop' ? {
        uid: this.data.options.id,
        rank: 1,
        page: ++this.data.page
      } : {
        uid: this.data.options.id,
        state: 1,
        page: ++this.data.page
      }
    }).then(function (res) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = res.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm') : '时间不详';
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

      _this.setData({
        list: _this.data.list.concat(res.lists)
      });
      _this.data.more = res.lists.length >= res.pre_page;
    });
  },
  onReachBottom: function onReachBottom() {
    if (!this.data.more) return;
    this.shopTeamList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options,
      info: app.gs('nextTeamInfo')
    }, this.shopTeamList);
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