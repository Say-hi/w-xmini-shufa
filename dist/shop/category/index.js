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
      bgc: '',
      hImg: ''
    },
    capsules: app.data.capsule,
    scrollHeight: wx.getSystemInfoSync().screenHeight - app.data.capsule.bottom - app.data.capsule.top / 2 - 105 - (app.data.fix ? 20 : 0),
    cLeftIndex: 0,
    page: 0,
    more: true,
    list: []
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  _leftChoose: function _leftChoose(e) {
    var _this = this;

    this.setData({
      cLeftIndex: e.currentTarget.dataset.index
    }, function () {
      _this.data.page = 0;
      _this.data.list = [];
      _this.shopProducts();
    });
  },
  shopCategory: function shopCategory() {
    var _this2 = this;

    app.wxrequest({
      url: app.getUrl().shopCategory
    }).then(function (res) {
      var cLeftIndex = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = res.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              i = _step$value[0],
              v = _step$value[1];

          if (v.id * 1 === _this2.data.options.id * 1) {
            cLeftIndex = i;
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

      _this2.setData({
        category: res,
        cLeftIndex: cLeftIndex
      }, _this2.shopProducts);
    });
  },
  shopProducts: function shopProducts() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopProducts,
      data: {
        cid: that.data.category[that.data.cLeftIndex].id,
        page: ++that.data.page
      }
    }).then(function (res) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = res.lists[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var v = _step2.value;

          if (!v.img_url) v.img_url = JSON.parse(v.imgs_url)[0].img_url;
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

      that.setData({
        list: that.data.list.concat(res.lists)
      });
      that.data.more = res.lists.length >= res.pre_page;
    });
  },

  // onReachBottom () {
  //   if (!this.data.more) {
  //     return app.toast({content: '没有更多内容了'})
  //   }
  //   this.shopProducts()
  // },
  moreShopProducts: function moreShopProducts() {
    if (!this.data.more) {
      return app.toast({ content: '没有更多内容了' });
    }
    this.shopProducts();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options
    }, this.shopCategory);
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