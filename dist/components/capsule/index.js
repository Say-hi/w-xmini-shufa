'use strict';

var app = getApp();
var timer = null;
Component({
  properties: {
    capsule: {
      type: 'Object'
    }
  },
  observers: {
    'capsule': function capsule(res) {
      var _this = this;

      setTimeout(function () {
        _this.data.capsuleSet.backShow = getCurrentPages().length > 1;
        _this.setData({
          capsuleSet: Object.assign(_this.data.capsuleSet, res)
        });
        // console.log(this.data.capsuleSet)
      }, 10);
    }
  },
  data: {
    capsules: app.data.capsule,
    capsuleSet: {
      bgc: '#fff',
      backShow: false,
      backImg: 'https://c.jiangwenqiang.com/lqsy/back.png?123',
      op: false,
      opImg: 'https://c.jiangwenqiang.com/api/image/home.png',
      hImg: 'https://c.jiangwenqiang.com/lqsy/homeImg.png?123',
      opType: 'reLaunch'
    },
    height: app.data.height,
    capsuleTop: app.data.capsuleTop,
    capsuleHeight: app.data.capsuleHeight,
    capsuleCenter: app.data.capsuleCenter
  },
  behavior: {},
  created: function created() {
    // console.log(2)
  },
  ready: function ready() {},

  pageLifetimes: {
    show: function show() {
      var that = this;
      var query = wx.createSelectorQuery().in(this);
      query.select('#capsule_t').boundingClientRect(function (res) {
        that.data.capsuleCenterWidth = res.width;
        if (res.width > that.data.capsuleCenter) {
          timer = setInterval(function () {
            var animation = wx.createAnimation({
              duration: Math.floor((res.width - that.data.capsuleCenter) / 50) * 1000 || 1000,
              timingFunction: 'linear'
            });
            animation.translateX(-(res.width - that.data.capsuleCenter + 10)).step();
            animation.translateX(0).step();
            that.setData({
              animationData: animation.export()
            });
          }, 2000);
        }
      }).exec();
    },
    hide: function hide() {
      if (timer) clearInterval(timer);
    }
  },
  methods: {
    _home: function _home() {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    },
    _getAuth: function _getAuth(e) {
      if (this.data.user.type !== 'getUserInfo') this.triggerEvent('back', e.detail);else app.wxlogin();
    },
    _back: function _back() {
      app.goBack();
    },
    _op: function _op() {
      wx[this.data.capsuleSet.opType]({
        url: this.data.capsuleSet.opUrl
      });
    }
  }
});