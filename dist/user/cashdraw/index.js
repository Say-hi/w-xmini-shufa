'use strict';

// 获取全局应用程序实例对象
var app = getApp();
var second = 60;
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
    capsules: app.data.capsule,
    codeText: '获取验证码'
  },
  _getCode: function _getCode() {
    if (this.timer) {
      return app.toast({
        content: second + '\u79D2\u540E\u53EF\u518D\u6B21\u83B7\u53D6\u9A8C\u8BC1\u7801'
      });
    }
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopCode,
      data: {
        uid: app.gs('userInfoAll').uid
      }
    }).then(function (res) {
      that.setData({
        codeText: second + '\u79D2'
      });
      that.timer = setInterval(function () {
        second--;
        if (second <= 0) {
          that.setData({
            codeText: '获取验证码'
          });
          clearInterval(that.timer);
          that.timer = null;
          second = 60;
        } else {
          that.setData({
            codeText: second + '\u79D2'
          });
        }
      }, 1000);
    });
  },
  inputvlaue: function inputvlaue(e) {
    this.data.money = e.detail.value;
  },
  _phoneLogin: function _phoneLogin() {
    var _this = this;

    if (!this.data.money || this.data.money > this.data.info.appear_money) {
      return app.toast({
        content: '请输入合理的金额'
      });
    } else if (this.data.money < 10) {
      return app.toast({
        content: '最小提现金额为10元'
      });
    }
    this.setData({
      phoneLogin: !this.data.phoneLogin
    }, function () {
      !_this.timer && _this._getCode();
    });
  },
  close: function close() {
    this.setData({
      phoneLogin: !this.data.phoneLogin
    });
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.setData({
        codeText: '获取验证码'
      });
    }
  },
  shopUser: function shopUser() {
    var _this2 = this;

    app.wxrequest({
      url: app.getUrl().shopUser,
      data: {
        uid: app.gs('userInfoAll').uid
      }
    }).then(function (res) {
      res.phones = res.phone.slice(0, 3) + '***' + res.phone.slice(7);
      _this2.setData({
        info: res
      });
    }, function () {
      app.toast({
        content: '您尚未登陆，请先登陆系统',
        mask: true
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '/user/login/index'
        });
      }, 1000);
    });
  },
  getAll: function getAll() {
    this.setData({
      money: this.data.info.appear_money
    });
  },
  cash: function cash(e) {
    var _this3 = this;

    if (!e.detail.value.code) {
      return app.toast({
        content: '请输入验证码'
      });
    } else if (this.data.money < 10) {
      return app.toast({
        content: '最小提现金额为10元'
      });
    } else if (this.data.money > this.data.info.appear_money) {
      return app.toast({
        content: '\u60A8\u7684\u4F59\u989D\u4E0D\u8DB3, \u8BF7\u91CD\u65B0\u8F93\u5165\u63D0\u73B0\u91D1\u989D'
      });
    }
    app.wxrequest({
      url: app.getUrl().shopAppear,
      data: {
        openid: app.gs('userInfoAll').openid,
        uid: app.gs('userInfoAll').uid,
        amount: this.data.money,
        code: e.detail.value.code
      }
    }).then(function (res) {
      app.toast({
        content: '提现成功',
        image: ''
      });
      _this3.shopUser();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    this.timer && clearInterval(this.timer);
    // this.shopUser()
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
    this.shopUser();
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