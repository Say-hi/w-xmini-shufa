// 获取全局应用程序实例对象
const app = getApp()
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
    bottomImg: [{
      i: '',
      t: '无'
    },
    {
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/camera_mi.png',
      t: '米字格'
    },
    {
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/camera_hui.png',
      t: '回字格'
    },
    {
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/camera_jiu.png',
      t: '九宫格'
    }
    ],
    bottomIndex: 0,
    cameraType: [{
      i: 'jwqduibi',
      t: '快速对比'
    },
    {
      i: 'jwqtupian',
      t: '选图对比'
    },
    {
      i: 'jwqmn_shangchuantupian',
      t: '拍照对比'
    }
    ],
    page: 0,
    more: true,
    comment: []
  },
  openSetting (res) {
    if (res.detail.authSetting['scope.camera']) {
      this.setData({
        needSetting: false
      })
      app.toast({
        content: '授权成功，请选择功能进行体验',
        image: ''
      })
    } else {
      app.toast({
        content: '请授权使用相机功能，否则无法体验功能, 请再次点击并进行授权',
        time: 10000
      })
    }
  },
  userCamera (e) {
    let that = this
    wx.authorize({
      scope: 'scope.camera',
      success () {
        that._toggleMask(e)
        app.su('alphaImg', that.data.info.alpha_img_name)
        app.su('alphaImg2', that.data.info.img_name)
      },
      fail () {
        that.setData({
          needSetting: true
        })
        app.toast({
          content: '请授权使用相机功能，否则无法体验功能, 请再次点击并进行授权',
          time: 10000
        })
      }
    })
  },
  _toggleMask (e) {
    let type = e.currentTarget.dataset.type
    let animate = type + 'Animate'
    if (this.data[type]) {
      this.setData({
        [animate]: !this.data[animate]
      })
      setTimeout(() => {
        this.setData({
          [type]: !this.data[type]
        })
      }, 900)
      return
    }
    this.setData({
      [animate]: !this.data[animate],
      [type]: !this.data[type]
    })
  },
  chooseType (e) {
    this.setData({
      bottomIndex: e.currentTarget.dataset.index
    })
  },
  _follow () {
    this.setData({
      follow: !this.data.follow
    })
  },
  _writeComment (e) {
    this.setData({
      focus: e.currentTarget.dataset.type === 'in'
    })
  },
  _collection () {
    let that = this
    app.wxrequest({
      url: app.getUrl().stackingCollect,
      data: {
        wid: that.data.info.wid,
        oid: that.data.info.id,
        uid: app.gs('userInfoAll').uid,
        state: that.data.info.is_collect > 0 ? 2 : 1
      }
    }).then(() => {
      that.setData({
        'info.is_collect': that.data.info.is_collect > 0 ? -1 : 1
      })
    })
  },
  _shareType () {
    this.setData({
      showShare: !this.data.showShare
    })
  },
  _goPicShare () {
    app.su('shareCardInfo', this.data.info)
    this._shareType()
    let temps = app.gs('shareUrl')
    let url = getCurrentPages()[getCurrentPages().length - 1].route
    for (let i in temps) {
      if (temps[i].indexOf(url) >= 0) {
        app.su('scene', `${i}*${this.data.options.wid},${this.data.options.oid},${app.gs('userInfoAll').uid}`)
        wx.navigateTo({
          url: '/share/carShare/carShare?type=camera'
        })
        return
      }
    }
  },
  getDetail () {
    let that = this
    this.data.page = 0
    this.data.comment = []
    app.wxrequest({
      url: app.getUrl().stackingDetail,
      data: {
        wid: that.data.options.wid,
        oid: that.data.options.oid,
        uid: app.gs('userInfoAll').uid
      }
    }).then(res => {
      that.setData({
        info: res
      }, that.getHundredDiscuss)
    })
  },
  getHundredDiscuss () {
    let that = this
    app.wxrequest({
      url: app.getUrl().stackingDiscuss,
      data: {
        wid: that.data.info.wid,
        oid: that.data.info.id,
        state: 1,
        page: ++that.data.page,
        uid: app.gs('userInfoAll').uid
      }
    }).then(res => {
      if (res.lists) {
        for (let v of res.lists) {
          v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm')
        }
        that.setData({
          comment: that.data.comment.concat(res.lists)
        })
      }
    })
  },
  sendHundredDiscussSub (e) {
    if (!e.detail.value.comment.trim()) {
      return app.toast({
        content: '评论内容不能为空'
      })
    }
    let that = this
    app.wxrequest({
      url: app.getUrl().stackingDiscussSub,
      data: {
        wid: that.data.info.wid,
        oid: that.data.info.id,
        uid: app.gs('userInfoAll').uid || 10000,
        bid: '',
        did: '',
        comment: e.detail.value.comment,
        state: 1
      }
    }).then(() => {
      app.toast({
        content: '评论成功,系统审核通过后即可展示',
        image: ''
      })
      that.setData({
        commentValue: ''
      })
      that.data.page = 0
      that.data.more = true
      that.data.comment = []
      that.getHundredDiscuss()
    })
  },
  goReply (e) {
    app.su('reply', this.data.comment[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  commentStar (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl().stackingDiscussStar,
      data: {
        uid: app.gs('userInfoAll').uid,
        wid: that.data.info.wid,
        oid: that.data.info.id,
        did: that.data.comment[e.currentTarget.dataset.index].id,
        state: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
      }
    }).then(() => {
      that.setData({
        [`comment[${e.currentTarget.dataset.index}].is_star`]: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1,
        [`comment[${e.currentTarget.dataset.index}].star`]: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? --that.data.comment[e.currentTarget.dataset.index].star : ++that.data.comment[e.currentTarget.dataset.index].star
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    }, this.getDetail)
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
  },
  onShareAppMessage () {
    let temps = app.gs('shareUrl')
    let url = getCurrentPages()[getCurrentPages().length - 1].route
    for (let i in temps) {
      if (temps[i].indexOf(url) >= 0) {
        return {
          title: `${this.data.info.word}`,
          path: `/openShare/index/index?url=${i}&q=${this.data.options.wid},${this.data.options.oid},${app.gs('userInfoAll').uid}`
        }
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
