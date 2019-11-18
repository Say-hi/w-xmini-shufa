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
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    replyIndex: -1,
    page: 0,
    capsules: app.data.capsule
  },
  _follow () {
    let that = this
    app.wxrequest({
      url: app.getUrl().hundredFollow,
      data: {
        fid: that.data.info.uid,
        uid: app.gs('userInfoAll').uid,
        state: that.data.info.is_follow > 0 ? 2 : 1
      }
    }).then(() => {
      this.setData({
        'info.is_follow': that.data.info.is_follow > 0 ? -1 : 1
      })
    })
  },
  _writeComment (e) {
    this.setData({
      focus: e.currentTarget.dataset.type === 'in'
    })
    if (e.currentTarget.dataset.type === 'in') {
      this.data.replyIndex = e.currentTarget.dataset.index
    }
  },
  _collection () {
    let that = this
    app.wxrequest({
      url: app.getUrl().hundredCollect,
      data: {
        pid: that.data.info.id,
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
    this._shareType()
    wx.navigateTo({
      url: '/share/carShare/carShare?type=2'
    })
  },
  getDetail () {
    let that = this
    app.wxrequest({
      url: app.getUrl().hundredDetail,
      data: {
        pid: that.data.options.id,
        uid: app.gs('userInfoAll').uid
      }
    }).then(res => {
      res.create_at = app.momentFormat(res.create_at * 1000, 'YYYY-MM-DD HH:mm')
      res.hits = res.hits > 10000 ? Math.floor(res.hits / 10000) + '万' : res.hits
      res.imgs_url = JSON.parse(res.imgs_url)
      that.setData({
        info: res
      })
    })
  },
  getHundredDiscuss () {
    let that = this
    app.wxrequest({
      url: app.getUrl().hundredDiscuss,
      data: {
        pid: that.data.options.id,
        state: 1,
        page: ++that.data.page
      }
    }).then(res => {
      if (res.lists.length) {
        for (let v of res.lists) {
          v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm')
        }
        that.setData({
          comment: that.data.comment ? that.data.comment.concat(res.lists) : [].concat(res.lists)
        })
      }
      that.data.replyIndex = -1
    })
  },
  sendHundredDiscussSub (e) {
    if (!e.detail.value.comment.trim()) return app.toast({content: '评论内容不能为空'})
    let that = this
    app.wxrequest({
      url: app.getUrl().hundredDiscussSub,
      data: {
        pid: that.data.info.id,
        uid: app.gs('userInfoAll').uid || 10000,
        bid: '',
        did: '',
        comment: e.detail.value.comment,
        state: 1
      }
    }).then(() => {
      app.toast({content: '评论成功'})
      that.setData({
        commentValue: ''
      })
      that.data.page = 0
      that.data.more = true
      that.data.comment = null
      that.getHundredDiscuss()
    })
  },
  goReply (e) {
    app.su('reply', this.data.comment[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  changeHundredPostsStar () {
    let that = this
    app.wxrequest({
      url: app.getUrl().hundredPostsStar,
      data: {
        uid: app.gs('userInfoAll').uid,
        pid: that.data.info.id,
        state: that.data.info.is_star > 0 ? 2 : 1
      }
    }).then(res => {
      that.setData({
        'info.is_star': that.data.info.is_star > 0 ? -1 : 1,
        'info.star': that.data.info.is_star > 0 ? --that.data.info.star : ++that.data.info.star
      })
    })
  },
  commentStar (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl().hundredDiscussStar,
      data: {
        uid: app.gs('userInfoAll').uid,
        pid: that.data.info.id,
        did: that.data.comment[e.currentTarget.dataset.index].id,
        state: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
      }
    }).then(() => {
      that.setData({
        [`comment[${e.currentTarget.dataset.index}]['is_star']`]: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1,
        [`comment[${e.currentTarget.dataset.index}]['star']`]: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? --that.data.comment[e.currentTarget.dataset.index].star : ++that.data.comment[e.currentTarget.dataset.index].star
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    }, () => {
      this.getDetail()
      this.getHundredDiscuss()
    })
    // let that = this
    // if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin()
    // this.getUser()
    // app.getNavTab({
    //   style: 3,
    //   cb (res) {
    //     that.setData({
    //       swiperArr: res.data.data
    //     })
    //     app.getNavTab({
    //       style: 2,
    //       cb (res) {
    //         that.setData({
    //           tabNav: res.data.data
    //         })
    //         that.getCourse()
    //       }
    //     })
    //   }
    // })
    // this.Bmap(this)
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
    // return {
    //   title: app.gs('shareText').t || '绣学问，真纹绣',
    //   path: `/pages/index/index`,
    //   imageUrl: app.gs('shareText').g
    // }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
