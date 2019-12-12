// components/component-tag-name.js
const app = getApp()
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
      observer (newValue, oldValue, changePath) {
        if (newValue) {
          this._getData(newValue.out_trade_no, newValue.order_num, newValue.state)
        }
      }
    }
  },
  data: {

  },
  methods: {
    _showScroll () {
      this.setData({
        showS: !this.data.showS
      })
    },
    _getData (one, two, three) {
      app.wxrequest({
        url: app.getUrl().logistic,
        data: {
          out_trade_no: one,
          order_num: two,
          state: three
        }
      }).then(res => {
        this.setData({
          express: res.data,
          showS: true
        })
      })
    }
  }
})
