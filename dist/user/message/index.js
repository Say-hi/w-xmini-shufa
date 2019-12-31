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
    textArr: ['未评价', '非常差', '差', '一般', '好', '非常好'],
    list: []
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  shopUserDiscuss: function shopUserDiscuss() {
    var _this = this;

    app.wxrequest({
      url: app.getUrl().shopUserDiscuss,
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

          v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm') : '时间不详';
          v.imgs_url = JSON.parse(v.imgs_url);
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
  shopNotice: function shopNotice() {
    var _this2 = this;

    app.wxrequest({
      url: app.getUrl().shopNotice,
      data: {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(function (res) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = res.lists[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var v = _step2.value;

          v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY年MM月DD日 HH:mm') : '时间不详';
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      _this2.setData({
        list: _this2.data.list.concat(res.lists)
      });
      _this2.data.more = res.lists.length >= res.pre_page;
    });
  },
  getList: function getList() {
    switch (this.data.options.type) {
      case 'shopcomment':
        this.shopUserDiscuss();
        break;
      case 'user':
        break;
      case 'shop':
        this.shopNotice();
        break;
      case 'sellcomment':
        this.sellcomment();
        break;
    }
  },
  sellcomment: function sellcomment() {
    var _this3 = this;

    app.wxrequest({
      url: app.getUrl().sellDiscuss,
      data: {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(function (res) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = res.lists[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var v = _step3.value;

          v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD') : '时间不详';
          v.imgs_url = JSON.parse(v.imgs_url);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      _this3.setData({
        list: _this3.data.list.concat(res.lists)
      });
      _this3.data.more = res.lists.length >= res.pre_page;
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
      theme: options.type === 'sellcomment' ? '评论管理' : options.type === 'user' ? '我的帖子' : options.type === 'shop' ? '我的消息' : '我的评价'
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