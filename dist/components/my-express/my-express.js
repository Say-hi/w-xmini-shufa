"use strict";

// components/component-tag-name.js
var app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    propObj: {
      type: Object,
      value: {
        out_trade_no: 123123,
        order_num: 1,
        state: 1
      },
      observer: function observer(newValue, oldValue, changePath) {
        if (newValue) {
          this._getData(newValue.out_trade_no, newValue.order_num, newValue.state);
        }
      }
    }
  },
  data: {},
  methods: {
    _showScroll: function _showScroll() {
      this.setData({
        showS: !this.data.showS
      });
    },
    _getData: function _getData(one, two, three) {
      var _this = this;

      app.wxrequest({
        url: app.getUrl().logistic,
        data: {
          out_trade_no: one,
          order_num: two,
          state: three
        }
      }).then(function (res) {
        _this.setData({
          express: res.data,
          showS: true
        });
      });
    }
  }
});