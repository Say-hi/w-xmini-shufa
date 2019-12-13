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
    tab: ['碑帖详情', '作品展示', '作品赏析'],
    replyIndex: -1,
    page: 0,
    commentPage: 0,
    commentMore: true,
    leftChoose: 0
  },
  showasdf: function showasdf(e) {
    app.showImg(this.data.section[e.currentTarget.dataset.index].img_name, [this.data.section[e.currentTarget.dataset.index].img_name]);
  },
  _writeComment: function _writeComment(e) {
    this.setData({
      focus: e.currentTarget.dataset.type === 'in'
    });
    if (e.currentTarget.dataset.type === 'in') {
      this.data.replyIndex = e.currentTarget.dataset.index;
    }
  },
  _shareType: function _shareType() {
    this.setData({
      showShare: !this.data.showShare
    });
  },
  _goPicShare: function _goPicShare() {
    this._shareType();
    app.su('shareCardInfo', this.data.info);
    wx.navigateTo({
      url: '/share/carShare/carShare?type=stele'
    });
  },
  _collection: function _collection() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().wordsCollect,
      data: {
        wid: that.data.info.id,
        uid: app.gs('userInfoAll').id || 10000,
        state: that.data.info.is_collect > 0 ? 2 : 1
      }
    }).then(function () {
      that.setData({
        'info.is_collect': that.info.is_collect > 0 ? -1 : 1
      });
    });
  },
  _leftChoose: function _leftChoose(e) {
    this.setData({
      leftChoose: e.currentTarget.dataset.index
    });
    if (e.currentTarget.dataset.index === 1) {
      this.getWordsSection();
    } else if (e.currentTarget.dataset.index === 2 && !this.data.piece) {
      this.getWordsPiece();
    }
  },
  getWordsDes: function getWordsDes() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().wordsDes,
      data: {
        wid: that.data.options.id
      }
    }).then(function (res) {
      that.setData({
        info: res
      });
    });
  },
  getWordsSection: function getWordsSection() {
    if (this.data.section) return;
    var that = this;
    app.wxrequest({
      url: app.getUrl().wordsSection,
      data: {
        wid: that.data.options.id
      }
    }).then(function (res) {
      that.setData({
        section: res
      });
    });
  },
  getWordsPiece: function getWordsPiece() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().wordsPiece,
      data: {
        wid: that.data.options.id,
        page: ++that.data.page,
        cid: that.data.info.cid
      }
    }).then(function (res) {
      that.setData({
        piece: that.data.piece ? that.data.piece.concat(res.lists) : [].concat(res.lists)
      });
      that.data.more = res.lists.length >= res.pre_page;
    });
  },
  getWordsDiscuss: function getWordsDiscuss() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().wordsDiscuss,
      data: {
        wid: that.data.options.id,
        state: 1,
        page: ++that.data.commentPage
      }
    }).then(function (res) {
      if (res.lists.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = res.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var v = _step.value;

            v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm');
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
          comment: that.data.comment ? that.data.comment.concat(res.lists) : [].concat(res.lists)
        });
        that.data.commentMore = res.lists.length >= res.pre_page;
      }
      that.data.replyIndex = -1;
    }, function () {
      --that.data.commentPage;
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
      url: app.getUrl().wordsDiscussSub,
      data: {
        wid: that.data.info.id,
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
      });
    });
  },
  changeWordsDiscussStar: function changeWordsDiscussStar(e) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().wordsDiscussStar,
      data: {
        did: that.data.comment[e.currentTarget.dataset.index].id,
        uid: app.gs('userInfoAll').uid,
        wid: that.data.info.id,
        state: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
      }
    }).then(function () {
      that.setData(_defineProperty({}, 'comment[' + e.currentTarget.dataset.index + '].is_star', that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1));
    });
  },
  goReply: function goReply(e) {
    app.su('reply', this.data.comment[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  onReachBottom: function onReachBottom() {
    if (this.data.leftChoose <= 0) {
      if (!this.data.commentMore) {
        return app.toast({
          content: '没有更多评论了'
        });
      }
      this.getWordsDiscuss();
    } else if (this.data.leftChoose >= 2) {
      if (!this.data.more) {
        return app.toast({
          content: '没有更多作品了'
        });
      }
      this.getWordsPiece();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    var _this = this;

    this.setData({
      options: options
    }, function () {
      _this.getWordsDes();
      _this.getWordsDiscuss();
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
          title: '' + this.data.info.name,
          path: '/openShare/index/index?url=' + i + '&q=' + this.data.info.id,
          imageUrl: '' + this.data.info.img_name
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