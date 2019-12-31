'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    tabIndex: 0,
    tabId: 0,
    tabArr: ['每日一字的评论', '叠影纠错的评论', '百家争鸣的评论', '碑体的评论', '视频的评论', '社区的评论'],
    // tabArr: ['书法教学的评论', '每日一字的评论', '叠影纠错的评论', '百家争鸣的评论', '碑体的评论', '视频的评论', '社区的评论'],
    list: [],
    page: 0,
    more: true
  },
  goDetail: function goDetail(e) {
    var url = '';
    switch (this.data.tabIndex * 1) {
      case 0:
        url = '/dayword/detail/index?id=' + this.data.list[e.currentTarget.dataset.index].wid;
        break;
      case 1:
        url = '/camera/detail/index?wid=' + this.data.list[e.currentTarget.dataset.index].wid + '&oid=' + this.data.list[e.currentTarget.dataset.index].oid;
        break;
      case 2:
        url = '/hundred/detail/index?id=' + this.data.list[e.currentTarget.dataset.index].pid + '&from=nav';
        break;
      case 3:
        url = '/stele/detail/index?id=' + this.data.list[e.currentTarget.dataset.index].wid;
        break;
      case 4:
        url = '/teaching/detail/index?id=' + this.data.list[e.currentTarget.dataset.index].vid + '&from=main';
        break;
      case 5:
        url = url = '/hundred/detail/index?id=' + this.data.list[e.currentTarget.dataset.index].pid + '&from=main';
        break;
    }
    wx.navigateTo({
      url: url
    });
  },
  chooseIndex: function chooseIndex(e) {
    var _this = this;

    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    }, function () {
      _this.data.page = 0;
      _this.data.list = [];
      _this.getlist();
    });
  },
  _follow: function _follow() {
    this.setData({
      follow: !this.data.follow
    });
  },
  _writeComment: function _writeComment(e) {
    this.setData({
      focus: e.currentTarget.dataset.type === 'in'
    });
  },
  _collection: function _collection() {
    this.setData({
      collection: !this.data.collection
    });
  },
  _shareType: function _shareType() {
    this.setData({
      showShare: !this.data.showShare
    });
  },
  _goPicShare: function _goPicShare() {
    this._shareType();
    wx.navigateTo({
      url: '/share/carShare/carShare?type=2'
    });
  },
  getlist: function getlist() {
    var _this2 = this;

    app.wxrequest({
      url: app.getUrl()[this.data.options.type === 'comment' ? 'userDiscuss' : 'userFans'],
      data: this.data.options.type === 'comment' ? {
        uid: app.gs('userInfoAll').uid,
        state: this.data.tabIndex * 1 + 2,
        page: ++this.data.page
      } : {
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

          v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm');
          // v.imgs_url = JSON.parse(v.imgs_url)
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
    this.getlist();
  },
  follow: function follow(e) {
    var _this3 = this;

    app.wxrequest({
      url: app.getUrl().communityFollow,
      data: {
        fid: this.data.list[e.currentTarget.dataset.index].uid,
        uid: app.gs('userInfoAll').uid,
        state: this.data.list[e.currentTarget.dataset.index].is_each_other > 0 ? 2 : 1
      }
    }).then(function () {
      _this3.setData(_defineProperty({}, 'list[' + e.currentTarget.dataset.index + '].is_each_other', _this3.data.list[e.currentTarget.dataset.index].is_each_other > 0 ? -1 : 1));
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options // type: comment 评论 & fans 粉丝
    }, this.getlist);
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