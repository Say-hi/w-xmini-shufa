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
    capsules: app.data.capsule,
    num: 1,
    more: true,
    page: 0,
    comment: [],
    skuIndex: -1
  },
  _submit: function _submit() {
    if (this.data.skuIndex < 0) {
      return app.toast({
        content: '\u8BF7\u9009\u62E9' + this.data.info.label + '\u5206\u7C7B'
      });
    }
    if (this.data.buyType === 'car') return this.shopCartAdd();
    var temp = [{
      pid: this.data.info.sku[this.data.skuIndex].pid,
      sku_id: this.data.info.sku[this.data.skuIndex].id,
      count: this.data.num,
      product: {
        title: this.data.info.title,
        price: this.data.info.sku[this.data.skuIndex].price,
        discount: this.data.info.sku[this.data.skuIndex].discount,
        img_url: this.data.info.sku[this.data.skuIndex].img_url,
        freight: this.data.info.freight,
        value: this.data.info.sku[this.data.skuIndex].value,
        label: this.data.info.label
      }
    }];
    app.su('buyInfo', temp);
    wx.navigateTo({
      url: '/shop/submit/index'
    });
  },
  _numOp: function _numOp(e) {
    if (e.currentTarget.dataset.type === 'add') {
      this.data.num++;
    } else {
      this.data.num > 1 && this.data.num-- || app.toast({
        content: '最小购买数量为1'
      });
    }
    this.setData({
      num: this.data.num
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
    this.setData({
      collection: !this.data.collection
    });
  },
  _shareType: function _shareType() {
    this.setData({
      showShare: !this.data.showShare
    });
  },
  _showComment: function _showComment() {
    this.setData({
      showComment: !this.data.showComment
    });
  },
  _toggleSpec: function _toggleSpec(e) {
    this.data.buyType = e ? e.currentTarget.dataset.type : '';
    this.setData({
      showSpec: !this.data.showSpec
    });
  },
  _goPicShare: function _goPicShare() {
    app.su('shareCardInfo', this.data.info);
    this._shareType();
    var temps = app.gs('shareUrl');
    var url = getCurrentPages()[getCurrentPages().length - 1].route;
    for (var i in temps) {
      if (temps[i].indexOf(url) >= 0) {
        app.su('scene', i + '*' + this.data.info.id + ',' + app.gs('userInfoAll').uid);
        wx.navigateTo({
          url: '/share/carShare/carShare?type=shop'
        });
        return;
      }
    }
  },
  shopProductDetail: function shopProductDetail() {
    var _this = this;

    app.wxrequest({
      url: app.getUrl().shopProductDetail,
      data: {
        pid: this.data.options.id
      }
    }).then(function (res) {
      res.imgs_url = JSON.parse(res.imgs_url);
      res.new_price_temp = res.new_price;
      res.new_price = res.new_price.split('.');
      res.detail_url = res.detail_url.split(',');
      if (!res.imgs_url.imgs.length) res.imgs_url.imgs[0] = res.img_url;
      try {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = res.sku[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var v = _step.value;

            v['discount'] = (v.discount * v.price).toFixed(2);
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
      } catch (err) {}
      _this.setData({
        info: res
      });
    });
  },
  shopDiscuss: function shopDiscuss() {
    var _this2 = this;

    app.wxrequest({
      url: app.getUrl().shopDiscuss,
      data: {
        uid: app.gs('userInfoAll').uid,
        pid: this.data.options.id,
        page: ++this.data.page
      }
    }).then(function (res) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = res.lists[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var v = _step2.value;

          v.imgs_url = JSON.parse(v.imgs_url);
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

      _this2.setData({
        comment: _this2.data.comment.concat(res.lists),
        commentTotal: res.total
      });
      _this2.data.more = res.lists.length >= res.pre_page;
    });
  },
  moreComments: function moreComments() {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多内容了'
      });
    }
    this.shopDiscuss();
  },
  showImg: function showImg(e) {
    app.showImg(e.currentTarget.dataset.url, this.data.comment[e.currentTarget.dataset.index].imgs_url.imgs);
  },
  chooseSku: function chooseSku(e) {
    this.setData({
      skuIndex: e.currentTarget.dataset.index
    });
  },
  shopCartAdd: function shopCartAdd() {
    var _this3 = this;

    if (!app.gs('userInfoAll').uid) {
      app.toast({
        content: '您尚未登陆,请登陆后再购买'
      });
      return setTimeout(function () {
        wx.navigateTo({
          url: '/user/login/index'
        });
      }, 2000);
    }
    app.wxrequest({
      url: app.getUrl().shopCartAdd,
      data: {
        pid: this.data.info.id,
        uid: app.gs('userInfoAll').uid,
        sku_id: this.data.info.sku[this.data.skuIndex].id,
        count: this.data.num
      }
    }).then(function () {
      app.toast({
        content: '添加入购物车成功',
        image: ''
      });
      _this3._toggleSpec();
    });
  },
  getTopNav: function getTopNav() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().homeConfig
    }).then(function (res) {
      that.setData({
        discount: res.shop_discount_show > 0
      }, function () {
        that.shopProductDetail();
        that.shopDiscuss();
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.data.options = options;
    this.getTopNav();
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
          path: '/openShare/index/index?url=' + i + '&q=' + this.data.info.id + ',' + app.gs('userInfoAll').uid,
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