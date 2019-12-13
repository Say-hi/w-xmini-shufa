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
    fix: app.data.fix,
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    capsules: app.data.capsule,
    height: app.data.height,
    more: true,
    page: 0,
    tabIndex: 0,
    tabId: 0
  },
  chooseIndex: function chooseIndex(e) {
    var _this = this;

    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    }, function () {
      _this.setData({
        info: _this.data.sectionList[e.currentTarget.dataset.index]
      }, function () {
        _this.data.page = 0;
        _this.data.comment = [];
        _this.getDiscuss();
      });
    });
  },
  _showColumn: function _showColumn(e) {
    console.log(e);
    this.setData({
      showColumn: !this.data.showColumn,
      showColumnType: e.currentTarget.id === 'openVideo'
    });
  },
  _writeComment: function _writeComment(e) {
    this.setData({
      focus: e.currentTarget.dataset.type === 'in'
    });
  },
  _collection: function _collection() {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoCollect' : 'teachCollect'],
      data: {
        vid: that.data.info.vid,
        uid: app.gs('userInfoAll').uid,
        state: that.data.info.is_collect > 0 ? 2 : 1
      }
    }).then(function () {
      that.setData({
        'info.is_collect': that.data.info.is_collect > 0 ? -1 : 1
      });
    });
  },
  _shareType: function _shareType() {
    this.setData({
      showShare: !this.data.showShare
    });
  },
  _goPicShare: function _goPicShare() {
    app.su('shareCardInfo', this.data.info);
    this._shareType();
    wx.navigateTo({
      url: '/share/carShare/carShare?type=stele'
    });
  },
  setMainSection: function setMainSection(id) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.data.sectionList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        if (v.id === id) {
          return this.setData({
            info: v
          }, this.getDiscuss);
        }
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
  },
  getSection: function getSection() {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoSectionList' : 'teachSectionList'],
      data: {
        uid: app.gs('userInfoAll').uid,
        vid: that.data.options.id
      }
    }).then(function (res) {
      that.setData({
        sectionList: res
      }, function () {
        that.setMainSection(that.data.options.id);
      });
    });
  },
  getDiscuss: function getDiscuss() {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoDiscuss' : 'teachDiscuss'],
      data: {
        vid: that.data.info.vid,
        sid: that.data.info.id,
        state: 1,
        uid: app.gs('userInfoAll').uid,
        page: ++that.data.page
      }
    }).then(function (res) {
      if (res.lists.length) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = res.lists[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var v = _step2.value;

            v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm');
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

        that.setData({
          commentTotal: res.total,
          comment: that.data.comment ? that.data.comment.concat(res.lists) : [].concat(res.lists)
        });
        that.data.more = res.lists.length >= res.pre_page;
      }
    }, function () {
      --that.data.page;
    });
  },
  play: function play(e) {
    this.addCount();
  },
  addCount: function addCount() {
    var _this2 = this;

    if (this.data.playAddCount) return;
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoPlay' : 'teachPlay'],
      data: {
        vid: this.data.info.vid,
        sid: this.data.info.id
      }
    }).then(function () {
      _this2.data.playAddCount = true;
    });
  },
  sendWordsDiscussSub: function sendWordsDiscussSub(e) {
    if (!e.detail.value.comment.trim()) {
      return app.toast({
        content: '评论内容不能为空'
      });
    }
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoDiscussSub' : 'teachDiscussSub'],
      data: {
        vid: that.data.info.vid,
        sid: that.data.info.id,
        uid: app.gs('userInfoAll').uid || 10000,
        bid: '',
        did: '',
        comment: e.detail.value.comment,
        state: 1
      }
    }).then(function () {
      app.toast({
        content: '评论成功,系统审核通过后即可展示',
        image: ''
      });
      that.setData({
        commentValue: ''
      }, function () {
        that.data.page = 0;
        that.data.comment = null;
        that.getDiscuss();
      });
    });
  },
  changeWordsDiscussStar: function changeWordsDiscussStar(e) {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoPlay' : 'teachDiscussStar'],
      data: {
        vid: that.data.info.vid,
        sid: that.data.info.id,
        did: that.data.comment[e.currentTarget.dataset.index].id,
        uid: app.gs('userInfoAll').uid,
        state: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
      }
    }).then(function () {
      var _that$setData;

      that.setData((_that$setData = {}, _defineProperty(_that$setData, 'comment[' + e.currentTarget.dataset.index + '].is_star', that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1), _defineProperty(_that$setData, 'comment[' + e.currentTarget.dataset.index + '].star', that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? --that.data.comment[e.currentTarget.dataset.index].star : ++that.data.comment[e.currentTarget.dataset.index].star), _that$setData));
    });
  },
  _videoStar: function _videoStar() {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoVideoStar' : 'teachVideoStar'],
      data: {
        vid: that.data.info.vid,
        sid: that.data.info.id,
        uid: app.gs('userInfoAll').uid || 10000,
        state: that.data.info.is_star > 0 ? 2 : 1
      }
    }).then(function () {
      that.setData({
        'info.star': that.data.info.is_star > 0 ? --that.data.info.star : ++that.data.info.star,
        'info.is_star': that.data.info.is_star > 0 ? -1 : 1
      });
    });
  },
  goReply: function goReply(e) {
    app.su('reply', this.data.comment[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  onReachBottom: function onReachBottom() {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多评论了'
      });
    }
    this.getDiscuss();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options,
      main: options.from === 'main'
    }, this.getSection);
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
    var temps = app.gs('shareUrl');
    var url = getCurrentPages()[getCurrentPages().length - 1].route;
    for (var i in temps) {
      if (temps[i].indexOf(url) >= 0) {
        return {
          title: '' + this.data.info.title,
          path: '/openShare/index/index?url=' + i + '&q=' + this.data.info.id + ',' + this.data.options.from,
          imageUrl: '' + this.data.info.cover_url
        };
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});