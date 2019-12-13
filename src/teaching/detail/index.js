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
    capsules: app.data.capsule,
    height: app.data.height,
    more: true,
    page: 0,
    tabIndex: 0,
    tabId: 0
  },
  chooseIndex (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    }, () => {
      this.setData({
        info: this.data.sectionList[e.currentTarget.dataset.index]
      }, () => {
        this.data.page = 0
        this.data.comment = []
        this.getDiscuss()
      })
    })
  },
  _showColumn (e) {
    console.log(e)
    this.setData({
      showColumn: !this.data.showColumn,
      showColumnType: e.currentTarget.id === 'openVideo'
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
      url: app.getUrl()[this.data.main ? 'videoCollect' : 'teachCollect'],
      data: {
        vid: that.data.info.vid,
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
    wx.navigateTo({
      url: '/share/carShare/carShare?type=stele'
    })
  },
  setMainSection (id) {
    for (let v of this.data.sectionList) {
      if (v.id === id) {
        return this.setData({
          info: v
        }, this.getDiscuss)
      }
    }
  },
  getSection () {
    let that = this
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoSectionList' : 'teachSectionList'],
      data: {
        uid: app.gs('userInfoAll').uid,
        vid: that.data.options.id
      }
    }).then(res => {
      that.setData({
        sectionList: res
      }, () => {
        that.setMainSection(that.data.options.id)
      })
    })
  },
  getDiscuss () {
    let that = this
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoDiscuss' : 'teachDiscuss'],
      data: {
        vid: that.data.info.vid,
        sid: that.data.info.id,
        state: 1,
        uid: app.gs('userInfoAll').uid,
        page: ++that.data.page
      }
    }).then(res => {
      if (res.lists.length) {
        for (let v of res.lists) {
          v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm')
        }
        that.setData({
          commentTotal: res.total,
          comment: that.data.comment ? that.data.comment.concat(res.lists) : [].concat(res.lists)
        })
        that.data.more = res.lists.length >= res.pre_page
      }
    }, () => {
      --that.data.page
    })
  },
  play (e) {
    this.addCount()
  },
  addCount () {
    if (this.data.playAddCount) return
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoPlay' : 'teachPlay'],
      data: {
        vid: this.data.info.vid,
        sid: this.data.info.id
      }
    }).then(() => {
      this.data.playAddCount = true
    })
  },
  sendWordsDiscussSub (e) {
    if (!e.detail.value.comment.trim()) {
      return app.toast({
        content: '评论内容不能为空'
      })
    }
    let that = this
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoDiscussSub' : 'teachDiscussSub'],
      data: {
        vid: that.data.info.vid,
        sid: that.data.info.id,
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
      }, () => {
        that.data.page = 0
        that.data.comment = null
        that.getDiscuss()
      })
    })
  },
  changeWordsDiscussStar (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoPlay' : 'teachDiscussStar'],
      data: {
        vid: that.data.info.vid,
        sid: that.data.info.id,
        did: that.data.comment[e.currentTarget.dataset.index].id,
        uid: app.gs('userInfoAll').uid,
        state: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
      }
    }).then(() => {
      that.setData({
        [`comment[${e.currentTarget.dataset.index}].is_star`]: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1,
        [`comment[${e.currentTarget.dataset.index}].star`]: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? --that.data.comment[e.currentTarget.dataset.index].star : ++that.data.comment[e.currentTarget.dataset.index].star
      })
    })
  },
  _videoStar () {
    let that = this
    app.wxrequest({
      url: app.getUrl()[this.data.main ? 'videoVideoStar' : 'teachVideoStar'],
      data: {
        vid: that.data.info.vid,
        sid: that.data.info.id,
        uid: app.gs('userInfoAll').uid || 10000,
        state: that.data.info.is_star > 0 ? 2 : 1
      }
    }).then(() => {
      that.setData({
        'info.star': that.data.info.is_star > 0 ? --that.data.info.star : ++that.data.info.star,
        'info.is_star': that.data.info.is_star > 0 ? -1 : 1
      })
    })
  },
  goReply (e) {
    app.su('reply', this.data.comment[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  onReachBottom () {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多评论了'
      })
    }
    this.getDiscuss()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options,
      main: options.from === 'main'
    }, this.getSection)
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
    let temps = app.gs('shareUrl')
    let url = getCurrentPages()[getCurrentPages().length - 1].route
    for (let i in temps) {
      if (temps[i].indexOf(url) >= 0) {
        return {
          title: `${this.data.info.title}`,
          path: `/openShare/index/index?url=${i}&q=${this.data.info.id},${this.data.options.from}`,
          imageUrl: `${this.data.info.cover_url}`
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
