'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();
// const config = require('../config')
// const COS = require('../cos-js-sdk-v5.min')
// const cos = new COS({
//   getAuthorization (params, callback) {
//     let authorization = COS.getAuthorization({
//       SecretId: config.SecretId,
//       SecretKey: config.SecretKey,
//       Method: params.Method,
//       Key: params.Key
//     })
//     callback(authorization)
//   }
// })
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    tab: [{
      i: 'https://c.jiangwenqiang.com/lqsy/camera.png',
      t: '拍照'
    }, {
      i: 'https://c.jiangwenqiang.com/lqsy/camera_pic.png',
      t: '照片'
    }],
    page: 0,
    more: true,
    outList: [],
    itemIndex: 0
  },
  _literacy: function _literacy(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [e.currentTarget.dataset.index > 0 ? 'album' : 'camera'],
      success: function success(res1) {
        wx.showLoading({
          title: '图片上传中'
        });
        var FilePath = res1.tempFilePaths[0];
        that.setData({
          imgUrl: FilePath
        });
        wx.uploadFile({
          url: app.getUrl().distinguishKnow,
          filePath: FilePath,
          name: 'file',
          formData: {
            uid: app.gs('userInfoAll').uid,
            file: FilePath
          },
          success: function success(res) {
            wx.hideLoading();
            that.data.page = 0;
            that.data.outList = [];
            var list = JSON.parse(res.data).data.words_result;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var v = _step.value;

                v.probability.average = Math.floor(v.probability.average * 100);
                v.words = v.words.slice(0, 1);
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

            list.sort(function (a, b) {
              return b.probability.average - a.probability.average;
            });
            that.setData({
              list: list
            }, function () {
              that._toggleShow();
              that.getWordOut(list[0].words);
            });
          },
          fail: function fail() {
            wx.hideLoading();
            app.toast({
              content: '上传失败'
            });
          }
        });
      }
    });
  },
  _toggleShow: function _toggleShow() {
    this.setData({
      literacy: !this.data.literacy
    });
  },
  getWordOut: function getWordOut(word) {
    var words = word.slice(0, 1);
    var that = this;
    app.wxrequest({
      url: app.getUrl().stackingSearch,
      data: {
        word: words,
        page: ++that.data.page
      }
    }).then(function (res) {
      that.setData({
        outList: that.data.outList.concat(res.lists)
      });
      that.data.more = res.lists.length >= res.pre_page;
    });
  },
  getShiYi: function getShiYi(e) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().distinguishWord,
      data: {
        uid: app.gs('userInfoAll').uid,
        word: that.data.list[e.currentTarget.dataset.index].words
      }
    }).then(function (res) {
      that.setData({
        shiYiInfo: res
      }, function () {
        that._toggleMask(e);
      });
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
  onReachBottom: function onReachBottom() {
    if (!this.data.more) {
      return app.toast({ content: '没有更多内容了' });
    }
    this.getWordOut(this.data.list[0].words);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {},

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