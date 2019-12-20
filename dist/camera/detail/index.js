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
    bottomImg: [{
      i: '',
      t: '无'
    }, {
      i: 'https://c.jiangwenqiang.com/lqsy/camera_mi.png',
      t: '米字格'
    }, {
      i: 'https://c.jiangwenqiang.com/lqsy/camera_hui.png',
      t: '回字格'
    }, {
      i: 'https://c.jiangwenqiang.com/lqsy/camera_jiu.png',
      t: '九宫格'
    }],
    bottomIndex: 0,
    cameraType: [{
      i: 'jwqduibi',
      t: '快速对比'
    }, {
      i: 'jwqtupian',
      t: '选图对比'
    }, {
      i: 'jwqmn_shangchuantupian',
      t: '拍照对比'
    }],
    page: 0,
    more: true,
    comment: []
  },
  openSetting: function openSetting(res) {
    if (res.detail.authSetting['scope.camera']) {
      this.setData({
        needSetting: false
      });
      app.toast({
        content: '授权成功，请选择功能进行体验',
        image: ''
      });
    } else {
      app.toast({
        content: '请授权使用相机功能，否则无法体验功能, 请再次点击并进行授权',
        time: 10000
      });
    }
  },
  userCamera: function userCamera(e) {
    var that = this;
    wx.authorize({
      scope: 'scope.camera',
      success: function success() {
        that._toggleMask(e);
        app.su('alphaImg', that.data.info.alpha_img_name);
        app.su('alphaImg2', that.data.info.img_name);
      },
      fail: function fail() {
        that.setData({
          needSetting: true
        });
        app.toast({
          content: '请授权使用相机功能，否则无法体验功能, 请再次点击并进行授权',
          time: 10000
        });
      }
    });
  },
  _toggleMask: function _toggleMask(e) {
    var _this = this,
        _setData2;

    var type = e.currentTarget.dataset.type;
    var animate = type + 'Animate';
    if (this.data[type]) {
      this.setData(_defineProperty({}, animate, !this.data[animate]));
      setTimeout(function () {
        _this.setData(_defineProperty({}, type, !_this.data[type]));
      }, 900);
      return;
    }
    this.setData((_setData2 = {}, _defineProperty(_setData2, animate, !this.data[animate]), _defineProperty(_setData2, type, !this.data[type]), _setData2));
  },
  chooseType: function chooseType(e) {
    this.setData({
      bottomIndex: e.currentTarget.dataset.index
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
    var that = this;
    app.wxrequest({
      url: app.getUrl().stackingCollect,
      data: {
        wid: that.data.info.wid,
        oid: that.data.info.id,
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
    var temps = app.gs('shareUrl');
    var url = getCurrentPages()[getCurrentPages().length - 1].route;
    for (var i in temps) {
      if (temps[i].indexOf(url) >= 0) {
        app.su('scene', i + '*' + this.data.options.wid + ',' + this.data.options.oid + ',' + app.gs('userInfoAll').uid);
        wx.navigateTo({
          url: '/share/carShare/carShare?type=camera'
        });
        return;
      }
    }
  },
  getDetail: function getDetail() {
    var that = this;
    this.data.page = 0;
    this.data.comment = [];
    app.wxrequest({
      url: app.getUrl().stackingDetail,
      data: {
        wid: that.data.options.wid,
        oid: that.data.options.oid,
        uid: app.gs('userInfoAll').uid
      }
    }).then(function (res) {
      that.setData({
        info: res
      }, that.getHundredDiscuss);
    });
  },
  getHundredDiscuss: function getHundredDiscuss() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().stackingDiscuss,
      data: {
        wid: that.data.info.wid,
        oid: that.data.info.id,
        state: 1,
        page: ++that.data.page,
        uid: app.gs('userInfoAll').uid
      }
    }).then(function (res) {
      if (res.lists) {
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
          comment: that.data.comment.concat(res.lists)
        });
      }
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
      url: app.getUrl().stackingDiscussSub,
      data: {
        wid: that.data.info.wid,
        oid: that.data.info.id,
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
      that.data.comment = [];
      that.getHundredDiscuss();
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
      url: app.getUrl().stackingDiscussStar,
      data: {
        uid: app.gs('userInfoAll').uid,
        wid: that.data.info.wid,
        oid: that.data.info.id,
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
    this.setData({
      options: options
    }, this.getDetail);
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
    // app.toast()
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
          title: '' + this.data.info.word,
          path: '/openShare/index/index?url=' + i + '&q=' + this.data.options.wid + ',' + this.data.options.oid + ',' + app.gs('userInfoAll').uid
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