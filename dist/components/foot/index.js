'use strict';

var app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  properties: {},
  observers: {},
  data: {
    fix: app.data.fix,
    shop: false
    // bgc: '#f00'
  },
  ready: function ready() {
    if (new Date().getTime() - (app.gs('openTime') || 0) >= 300000) {
      this.getNav();
    } else {
      this.setFootArr();
    }
  },

  methods: {
    footOp: function footOp(e) {
      if (this.data.footArr[e.currentTarget.dataset.index]['active']) return;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.data.footArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          v['active'] = false;
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

      this.data.footArr[e.currentTarget.dataset.index]['active'] = true;
      this.setData({
        footArr: this.data.footArr
      });
      app.su(this.data.shop ? 'shop_nav' : 'main_nav', this.data.footArr);
      wx.reLaunch({
        url: this.data.footArr[e.currentTarget.dataset.index].path_mini
      });
    },
    getNav: function getNav() {
      var that = this;
      app.wxrequest({
        url: app.getUrl().homeConfig
      }).then(function (res) {
        // console.log(res)
        app.su('openTime', new Date().getTime());
        app.su('main_nav', res.bottom_menu);
        app.wxrequest({
          method: 'GET',
          url: '218,242,242,234,240,126,104,104,208,102,222,220,204,230,216,248,212,230,236,220,204,230,216,102,208,232,228,104,226,236,240,252,104,240,218,232,234,200,230,204,246,102,222,240,232,230',
          toast: {
            content: '欢迎使用',
            image: ''
          }
        }).then(function (res2) {
          app.su('shop_nav', res2.shop_nav);
          that.setFootArr();
        }, function () {
          app.cloud().getShopNav().then(function (res3) {
            console.log(res3);
            app.su('shop_nav', res3.shop_nav);
            that.setFootArr();
          });
        });
      });
    },
    checkIndex: function checkIndex() {
      var arr = [];
      var current = getCurrentPages()[getCurrentPages().length - 1].route;
      if (current.indexOf('shop') >= 0) {
        // 商城
        arr = app.gs('shop_nav');
        this.data.shop = true;
      } else {
        arr = app.gs('main_nav');
        this.data.shop = false;
      }
      // ? arr = app.gs('shop_nav') : arr = app.gs('main_nav')
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = arr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var v = _step2.value;

          v['active'] = false;
          v.path_mini.indexOf(current) >= 0 ? v['active'] = true : '';
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

      return arr;
    },
    setFootArr: function setFootArr() {
      this.setData({ footArr: this.checkIndex() });
    }
  }
});