'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// 获取全局应用程序实例对象
var app = getApp();
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
    inviteId: null
  },
  caseUrl: function caseUrl() {
    var res = app.gs('shareUrl');
    for (var v in res) {
      if (v * 1 === this.data.options.url * 1) {
        this.data.go = res[v];
        return this.jump();
      }
    }
  },
  jump: function jump() {
    var urlData = this.data.go.split('?');
    var url = urlData[0];
    urlData.shift();
    var q = this.data.options.q.split(',');
    // console.log(q)
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = urlData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            i = _step$value[0],
            v = _step$value[1];

        if (v === 'uid') {
          this.data.inviteId = q[i];
        }
        if (i < 1) {
          url += '?' + v + '=' + q[i];
        } else {
          url += '&' + v + '=' + q[i];
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

    this.data.goUrl = url;
    this.checkRank();
    // wx.redirectTo({
    //   url
    // })
  },
  checkRank: function checkRank() {
    var _this = this;

    if (!this.data.goUrl) return;
    app.gs('userInfoAll').uid && this.data.inviteId && app.wxrequest({ url: app.getUrl().userBind, data: { son_phone: app.gs('userInfoAll').phone || null, parent_id: this.data.inviteId || null } });
    app.wxrequest({
      url: app.getUrl().shopUser,
      data: {
        uid: app.gs('userInfoAll').uid || null
      }
    }).then(function (res) {
      if (res.rank < 0 && _this.data.options.url * 1 !== 7 && _this.data.options.url * 1 !== 6) {
        // todo 修改等级判断
        app.toast({
          content: '您还未成为会员,无法继续享受服务哦~~',
          mask: true
        });
        setTimeout(function () {
          wx.navigateTo({
            url: '/openvip/index/index'
          });
        }, 1000);
      } else {
        // wx.navigateTo({
        //   url: this.data.goUrl
        // })
        wx.reLaunch({
          url: _this.data.goUrl
        });
      }
    }, function () {
      app.toast({
        content: '您还未登录,无法继续享受服务哦~~',
        mask: true
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/user/login/index'
        });
      }, 1000);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    console.log(options);
    // options规则 判断是否为扫码进入
    if (options.scene) {
      // todo 扫码进入
      options.scene = decodeURIComponent(options.scene).split('*');
      options['url'] = options.scene[0];
      options['q'] = options.scene[1];
    }
    // 扫码进入则第一位为url,后面为对应页面的参数
    if (app.gs('shareUrl')) {
      this.setData({
        options: options
      }, this.caseUrl);
    } else {
      this.setData({
        options: options
      });
      app.getShareUrl(this.caseUrl);
    }
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
    this.checkRank();
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
  }
});