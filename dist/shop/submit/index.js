'use strict';

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
    capsules: app.data.capsule
  },
  // 选择地址
  chooseAddress: function chooseAddress() {
    if (this.data.lostTime) return;
    var that = this;
    wx.chooseAddress({
      success: function success(res) {
        if (res.telNumber) {
          // 获取信息成功
          wx.setStorageSync('addressInfo', res);
          that.setData({
            needSetting: false,
            addressInfo: res
          });
        }
      },
      fail: function fail() {
        wx.getSetting({
          success: function success(res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              });
              app.toast({
                content: '需授权获取地址信息'
              });
            }
          }
        });
      }
    });
  },

  // 获取设置
  openSetting: function openSetting() {
    var that = this;
    wx.openSetting({
      success: function success(res) {
        // console.log(res)
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          });
          that.chooseAddress();
        }
      }
    });
  },
  pay: function pay() {
    if (this.data.oid && this.data.info[0].is_baby * 1 !== 1) return this.payAgain();
    if (!this.data.addressInfo || !this.data.addressInfo.telNumber) {
      return app.toast({
        content: '请填写收货地址信息'
      });
    }
    var carts = [];
    var that = this;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.data.info[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        carts.push({
          pid: v.pid,
          count: v.count,
          sku_id: v.sku_id,
          value: v.product.value
        });
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

    app.wxrequest({
      url: app.getUrl()[this.data.info[0].is_baby * 1 === 1 ? 'paySell' : 'payShop'],
      data: this.data.info[0].is_baby * 1 === 1 ? {
        name: this.data.addressInfo.userName,
        phone: this.data.addressInfo.telNumber,
        uid: app.gs('userInfoAll').uid,
        openid: app.gs('userInfoAll').openid,
        address: '' + this.data.addressInfo.provinceName + this.data.addressInfo.cityName + this.data.addressInfo.countyName + this.data.addressInfo.detailInfo,
        pid: this.data.info[0].pid,
        count: this.data.info[0].count
      } : {
        name: this.data.addressInfo.userName,
        phone: this.data.addressInfo.telNumber,
        uid: app.gs('userInfoAll').uid,
        openid: app.gs('userInfoAll').openid,
        address: '' + this.data.addressInfo.provinceName + this.data.addressInfo.cityName + this.data.addressInfo.countyName + this.data.addressInfo.detailInfo,
        carts: JSON.stringify(carts)
      }
    }).then(function (res) {
      that.data.oid = res.oid;
      app.wxpay2(res.msg).then(function () {
        that.setData({
          paySuccess: true
        });
      }, function () {
        app.toast({
          content: '未完成支付,如有支付遇到问题,请联系客服处理'
        });
      });
    });
  },
  payAgain: function payAgain() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().payShopAgain,
      data: {
        oid: this.data.oid,
        uid: app.gs('userInfoAll').uid,
        openid: app.gs('userInfoAll').openid
      }
    }).then(function (res) {
      app.wxpay2(res.msg).then(function () {
        that.setData({
          paySuccess: true
        });
      }, function () {
        app.toast({
          content: '未完成支付,如有支付遇到问题,请联系客服处理'
        });
      });
    });
  },
  getMaxFreight: function getMaxFreight() {
    var maxFreight = 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.data.info[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var v = _step2.value;

        maxFreight = maxFreight > v.product.freight ? maxFreight : v.product.freight;
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

    app.getMaxFright(this);
    this.setData({
      maxFreight: maxFreight * 1
    }, this.getGoodsMoney);
  },
  getGoodsMoney: function getGoodsMoney() {
    var goodsMoney = 0;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this.data.info[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var v = _step3.value;

        goodsMoney += v.count * v.product.discount;
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    this.setData({
      goodsMoney: goodsMoney.toFixed(2),
      totalMoney: (goodsMoney + this.data.maxFreight).toFixed(2)
    });
  },
  getTopNav: function getTopNav(options) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().homeConfig
    }).then(function (res) {
      that.setData({
        discount: res.shop_discount_show > 0
      }, function () {
        that.setData({
          options: options,
          info: app.gs('buyInfo'),
          addressInfo: app.gs('addressInfo')
        }, that.getMaxFreight);
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.getTopNav(options);
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
    app.checkUser({
      rank: false
    });
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