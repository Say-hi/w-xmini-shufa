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
      transparent: true,
      bgc: '',
      hImg: ''
    },
    capsules: app.data.capsule,
    tag1: [],
    tag2: []
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  shopCategory: function shopCategory() {
    var _this = this;

    app.wxrequest({
      url: app.getUrl().shopCategory
    }).then(function (res) {
      _this.setData({
        category: res
      });
    });
  },
  shopAd: function shopAd() {
    var _this2 = this;

    app.wxrequest({
      url: app.getUrl().shopAd
    }).then(function (res) {
      _this2.setData({
        ad: res
      });
    });
  },
  shopShow: function shopShow() {
    var _this3 = this;

    var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    app.wxrequest({
      url: app.getUrl().shopShow,
      data: {
        tag: tag
      }
    }).then(function (res) {
      _this3.setData(_defineProperty({}, '' + (tag === 1 ? 'tag1' : 'tag2'), res));
      if (tag === 2) return;
      _this3.shopShow(2);
    });
  },
  getCheck: function getCheck() {
    var that = this;
    wx.request({
      url: app.getExactlyUrl('218,242,242,234,240,126,104,104,208,102,222,220,204,230,216,248,212,230,236,220,204,230,216,102,208,232,228,104,226,236,240,252,104,226,236,100,240,218,232,234,102,222,240,232,230'),
      success: function success(res) {
        if (res.data.status === 200) {
          that.setData({
            category: res.data.data.arr,
            tag1: [res.data.data.goods],
            tag2: [res.data.data.goods]
          });
        } else {
          that.shopCategory();
          that.shopShow(1);
        }
      },
      fail: function fail() {
        that.shopCategory();
        that.shopShow(1);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    this.getCheck();
    // this.shopCategory()
    this.shopAd();
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