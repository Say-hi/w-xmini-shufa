// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      transparent: true,
      bgc: ''
    },
    inviteId: null
  },
  caseUrl () {
    let res = app.gs('shareUrl')
    for (let v in res) {
      if (v * 1 === this.data.options.url * 1) {
        this.data.go = res[v]
        return this.jump()
      }
    }
  },
  jump () {
    let urlData = this.data.go.split('?')
    let url = urlData[0]
    urlData.shift()
    let q = this.data.options.q.split(',')
    // console.log(q)
    for (let [i, v] of urlData.entries()) {
      if (v === 'uid') { this.data.inviteId = q[i] }
      if (i < 1) {
        url += `?${v}=${q[i]}`
      } else {
        url += `&${v}=${q[i]}`
      }
    }
    this.data.goUrl = url
    this.checkRank()
    // wx.redirectTo({
    //   url
    // })
  },
  checkRank () {
    if (!this.data.goUrl) return
    app.gs('userInfoAll').uid && this.data.inviteId && app.wxrequest({url: app.getUrl().userBind, data: {son_phone: app.gs('userInfoAll').phone || null, parent_id: this.data.inviteId || null}})
    app.wxrequest({
      url: app.getUrl().shopUser,
      data: {
        uid: app.gs('userInfoAll').uid || null
      }
    }).then(
        res => {
          if (res.rank < 0 && this.data.options.url * 1 !== 7 && this.data.options.url * 1 !== 6) {
            // todo 修改等级判断
            app.toast({
              content: '您还未成为会员,无法继续享受服务哦~~',
              mask: true
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/openvip/index/index'
              })
            }, 1000)
          } else {
            // wx.navigateTo({
            //   url: this.data.goUrl
            // })
            wx.reLaunch({
              url: this.data.goUrl
            })
          }
        },
        () => {
          app.toast({
            content: '您还未登录,无法继续享受服务哦~~',
            mask: true
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/user/login/index'
            })
          }, 1000)
        }
      )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // console.log(options)
    // options规则 判断是否为扫码进入
    if (options.scene) {
      // todo 扫码进入
      options.scene = decodeURIComponent(options.scene).split('*')
      options['url'] = options.scene[0]
      options['q'] = options.scene[1]
    }
    // 扫码进入则第一位为url,后面为对应页面的参数
    if (app.gs('shareUrl')) {
      this.setData(
        {
          options
        },
        this.caseUrl
      )
    } else {
      app.getShareUrl(this.caseUrl)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // console.log(' ---------- onReady ----------')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    this.checkRank()
    // app.toast()
    // this.setKill()
    // console.log(' ---------- onShow ----------')
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  }
})
