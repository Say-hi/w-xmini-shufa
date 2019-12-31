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
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    commentPage: 0,
    commentMore: true,
    capsules: app.data.capsule
  },
  _writeComment: function _writeComment(e) {
    this.setData({
      focus: e.currentTarget.dataset.type === 'in'
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
    var temps = app.gs('shareUrl');
    var url = getCurrentPages()[getCurrentPages().length - 1].route;
    for (var i in temps) {
      if (temps[i].indexOf(url) >= 0) {
        app.su('scene', i + '*' + this.data.options.id + ',' + app.gs('userInfoAll').uid);
        return wx.navigateTo({
          url: '/share/carShare/carShare?type=dayword'
        });
      }
    }
  },
  getHundredDiscuss: function getHundredDiscuss() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().dayDiscuss,
      data: {
        wid: that.data.options.id,
        state: 1,
        page: ++that.data.commentPage,
        uid: app.gs('userInfoAll').uid
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
  goReply: function goReply(e) {
    app.su('reply', this.data.comment[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  commentStar: function commentStar(e) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().dayDiscussStar,
      data: {
        uid: app.gs('userInfoAll').uid,
        // wid: that.data.info.id,
        wid: that.data.options.id,
        did: that.data.comment[e.currentTarget.dataset.index].id,
        state: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
      }
    }).then(function () {
      var _that$setData;

      that.setData((_that$setData = {}, _defineProperty(_that$setData, 'comment[' + e.currentTarget.dataset.index + '].is_star', that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1), _defineProperty(_that$setData, 'comment[' + e.currentTarget.dataset.index + '].star', that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? --that.data.comment[e.currentTarget.dataset.index].star : ++that.data.comment[e.currentTarget.dataset.index].star), _that$setData));
    });
  },
  sendHundredDiscussSub: function sendHundredDiscussSub(e) {
    if (!e.detail.value.comment.trim()) {
      return app.toast({
        content: '评论内容不能为空'
      });
    }
    var that = this;
    app.wxrequest({
      url: app.getUrl().dayDiscussSub,
      data: {
        // wid: that.data.info.id,
        wid: that.data.options.id,
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
      that.data.page = 0;
      that.data.more = true;
      that.data.comment = null;
      that.getHundredDiscuss();
    });
  },
  getInfo: function getInfo() {
    var _this = this;

    app.wxrequest({
      url: app.getUrl().dayDetail,
      data: {
        wid: this.data.options.id,
        uid: app.gs('userInfoAll').uid
      }
    }).then(function (res) {
      app.WP('desc', 'html', res.des, _this, 0);
      res.create_at = app.momentFormat(res.create_at * 1000, 'YYYY-MM-DD HH:mm');
      _this.setData({
        info: res
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    var _this2 = this;

    this.setData({
      options: options
    }, function () {
      _this2.getInfo();
      _this2.getHundredDiscuss();
    });
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
          path: '/openShare/index/index?url=' + i + '&q=' + this.data.options.id + ',' + app.gs('userInfoAll').uid,
          imageUrl: '' + this.data.info.img_url
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