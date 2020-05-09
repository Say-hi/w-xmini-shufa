// const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    url: {
      type: String,
      val: ''
    }
  },
  observers: {},
  ready () {},
  methods: {
    _navigateTo () {
      let pages = getCurrentPages()
      if (pages.length > 9) {
        wx.redirectTo({
          url: this.data.url
        })
      } else {
        wx.navigateTo({url: this.data.url})
      }
    }
  }
})
