const app = getApp()
let timer = null
Component({
  properties: {
    capsule: {
      type: 'Object'
    }
  },
  observers: {
    'capsule' (res) {
      setTimeout(() => {
        this.data.capsuleSet.backShow = getCurrentPages().length > 1
        this.setData({
          capsuleSet: Object.assign(this.data.capsuleSet, res)
        })
        let that = this
        const query = wx.createSelectorQuery().in(this)
        setTimeout(() => {
          query.select('#capsule_t').boundingClientRect(function (res) {
            that.data.capsuleCenterWidth = res.width
            // console.log(res.width, that.data.capsuleCenter)
            if (res.width > that.data.capsuleCenter) {
              // console.log('getin')
              timer && clearInterval(timer)
              timer = setInterval(function () {
                const animation = wx.createAnimation({
                  duration: Math.floor((res.width - that.data.capsuleCenter) / 50) * 1000 || 1000,
                  timingFunction: 'linear'
                })
                animation.translateX(-(res.width - that.data.capsuleCenter + 10)).step()
                animation.translateX(0).step()
                that.setData({
                  animationData: animation.export()
                })
              }, 2000)
            }
          }).exec()
        }, 100)
        // console.log(this.data.capsuleSet)
      }, 10)
    }
  },
  data: {
    capsules: app.data.capsule,
    capsuleSet: {
      bgc: '#fff',
      backShow: false,
      backImg: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/back.png?123',
      op: false,
      opImg: 'https://c.jiangwenqiang.com/api/image/home.png',
      hImg: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/homeImg.png?123',
      opType: 'reLaunch'
    },
    height: app.data.height,
    capsuleTop: app.data.capsuleTop,
    capsuleHeight: app.data.capsuleHeight,
    capsuleCenter: app.data.capsuleCenter
  },
  lifetimes: {
    created () {},
    ready () {}
  },
  pageLifetimes: {
    show () {
      let that = this
      const query = wx.createSelectorQuery().in(this)
      query.select('#capsule_t').boundingClientRect(function (res) {
        that.data.capsuleCenterWidth = res.width
        // console.log(res.width, that.data.capsuleCenter)
        if (res.width > that.data.capsuleCenter) {
          timer && clearInterval(timer)
          timer = setInterval(function () {
            const animation = wx.createAnimation({
              duration: Math.floor((res.width - that.data.capsuleCenter) / 50) * 1000 || 1000,
              timingFunction: 'linear'
            })
            animation.translateX(-(res.width - that.data.capsuleCenter + 10)).step()
            animation.translateX(0).step()
            that.setData({
              animationData: animation.export()
            })
          }, 2000)
        }
      }).exec()
    },
    hide () {
      if (timer) clearInterval(timer)
    }
  },
  methods: {
    _home () {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    },
    _getAuth (e) {
      if (this.data.user.type !== 'getUserInfo') this.triggerEvent('back', e.detail)
      else app.wxlogin()
    },
    _back () {
      app.goBack()
    },
    _op () {
      wx[this.data.capsuleSet.opType]({
        url: this.data.capsuleSet.opUrl
      })
    }
  }
})
