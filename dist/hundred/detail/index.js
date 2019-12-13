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
    replyIndex: -1,
    page: 0,
    capsules: app.data.capsule
  },
  preview: function preview(e) {
    app.showImg(this.data.info.imgs_url.imgs[e.currentTarget.dataset.index], this.data.info.imgs_url.imgs);
  },
  _follow: function _follow() {
    var _this = this;

    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.options.from === 'main' ? 'communityFollow' : 'hundredFollow'],
      data: {
        fid: that.data.info.uid,
        uid: app.gs('userInfoAll').uid,
        state: that.data.info.is_follow > 0 ? 2 : 1
      }
    }).then(function () {
      _this.setData({
        'info.is_follow': that.data.info.is_follow > 0 ? -1 : 1
      });
    });
  },
  _writeComment: function _writeComment(e) {
    this.setData({
      focus: e.currentTarget.dataset.type === 'in'
    });
    if (e.currentTarget.dataset.type === 'in') {
      this.data.replyIndex = e.currentTarget.dataset.index;
    }
  },
  _collection: function _collection() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().hundredCollect,
      data: {
        pid: that.data.info.id,
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
      url: '/share/carShare/carShare?type=' + (this.data.options.from === 'main' ? 'community' : 'hundred')
    });
  },
  getDetail: function getDetail() {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.options.from === 'main' ? 'communityDetail' : 'hundredDetail'],
      data: {
        pid: that.data.options.id,
        uid: app.gs('userInfoAll').uid
      }
    }).then(function (res) {
      try {
        res.create_at = app.momentFormat(res.create_at * 1000, 'YYYY-MM-DD HH:mm');
        res.hits = res.hits > 10000 ? Math.floor(res.hits / 10000) + '万' : res.hits;
        res.imgs_url = JSON.parse(res.imgs_url);
      } catch (e) {
        console.log(e);
      }
      that.setData({
        info: res
      });
    });
  },
  getHundredDiscuss: function getHundredDiscuss() {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.options.from === 'main' ? 'communityDiscuss' : 'hundredDiscuss'],
      data: {
        pid: that.data.options.id,
        state: 1,
        page: ++that.data.page,
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
      }
      that.data.replyIndex = -1;
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
      url: app.getUrl()[this.data.options.from === 'main' ? 'communityDiscussSub' : 'hundredDiscussSub'],
      data: this.data.options.from === 'main' ? {
        pid: that.data.info.id,
        uid: app.gs('userInfoAll').uid || 10000,
        bid: '',
        did: '',
        comment: e.detail.value.comment,
        state: 1
      } : {
        pid: that.data.info.id,
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
  goReply: function goReply(e) {
    app.su('reply', this.data.comment[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  changeHundredPostsStar: function changeHundredPostsStar() {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.options.from === 'main' ? 'communityPostStar' : 'hundredPostsStar'],
      data: {
        uid: app.gs('userInfoAll').uid,
        pid: that.data.info.id,
        state: that.data.info.is_star > 0 ? 2 : 1
      }
    }).then(function (res) {
      that.setData({
        'info.is_star': that.data.info.is_star > 0 ? -1 : 1,
        'info.star': that.data.info.is_star > 0 ? --that.data.info.star : ++that.data.info.star
      });
    });
  },
  commentStar: function commentStar(e) {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[this.data.options.from === 'main' ? 'communityDiscussStar' : 'hundredDiscussStar'],
      data: {
        uid: app.gs('userInfoAll').uid,
        pid: that.data.info.id,
        did: that.data.comment[e.currentTarget.dataset.index].id,
        state: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
      }
    }).then(function () {
      var _that$setData;

      that.setData((_that$setData = {}, _defineProperty(_that$setData, 'comment[' + e.currentTarget.dataset.index + '].is_star', that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1), _defineProperty(_that$setData, 'comment[' + e.currentTarget.dataset.index + '].star', that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? --that.data.comment[e.currentTarget.dataset.index].star : ++that.data.comment[e.currentTarget.dataset.index].star), _that$setData));
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
      _this2.getDetail();
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
          path: '/openShare/index/index?url=' + i + '&q=' + this.data.info.id + ',' + this.data.options.from
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