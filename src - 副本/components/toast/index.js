const app = getApp()
let timer = null
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    toast: {
      type: 'Object',
      value: {}
    }
  },
  observers: {
    toast (value) {
      if (!value) return
      let that = this
      this.setData({
        type: value.toastType
      }, () => {
        that.setData({
          toastInfo: value,
          show: true
        })
      })
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        that.setData({
          show: false
        })
      }, value.time)
    }
  },
  data: {
    user: {},
    type: 'center',
    height: app.data.height
  },
  methods: {
    _touchStart () {
      if (this.data.toast.mask) return
      if (app.data.requireDisable < 10) return
      if (timer) clearTimeout(timer)
      this.setData({
        show: false
      })
    }
  }
})
