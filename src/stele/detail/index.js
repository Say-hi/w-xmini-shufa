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
    tab: ['碑帖详情', '作品展示', '作品赏析'],
    replyIndex: -1,
    page: 0,
    commentPage: 0,
    commentMore: true,
    leftChoose: 0
  },
  showasdf (e) {
    app.showImg(this.data.section[e.currentTarget.dataset.index].img_name, [this.data.section[e.currentTarget.dataset.index].img_name])
  },
  _writeComment (e) {
    this.setData({
      focus: e.currentTarget.dataset.type === 'in'
    })
    if (e.currentTarget.dataset.type === 'in') {
      this.data.replyIndex = e.currentTarget.dataset.index
    }
  },
  _shareType () {
    this.setData({
      showShare: !this.data.showShare
    })
  },
  _goPicShare () {
    this._shareType()
    app.su('shareCardInfo', this.data.info)
    let temps = app.gs('shareUrl')
    let url = getCurrentPages()[getCurrentPages().length - 1].route
    for (let i in temps) {
      if (temps[i].indexOf(url) >= 0) {
        app.su('scene', `${i}*${this.data.info.id},${app.gs('userInfoAll').uid}`)
        wx.navigateTo({
          url: '/share/carShare/carShare?type=stele'
        })
        return
      }
    }
  },
  _collection () {
    let that = this
    app.wxrequest({
      url: app.getUrl().wordsCollect,
      data: {
        wid: that.data.info.id,
        uid: app.gs('userInfoAll').id || 10000,
        state: that.data.info.is_collect > 0 ? 2 : 1
      }
    }).then(() => {
      that.setData({
        'info.is_collect': that.info.is_collect > 0 ? -1 : 1
      })
    })
  },
  _leftChoose (e) {
    this.setData({
      leftChoose: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index === 1) {
      this.getWordsSection()
    } else if (e.currentTarget.dataset.index === 2 && !this.data.piece) {
      this.getWordsPiece()
    }
  },
  getWordsDes () {
    let that = this
    app.wxrequest({
      url: app.getUrl().wordsDes,
      data: {
        wid: that.data.options.id
      }
    }).then(res => {
      that.setData({
        info: res
      })
    })
  },
  getWordsSection () {
    if (this.data.section) return
    let that = this
    app.wxrequest({
      url: app.getUrl().wordsSection,
      data: {
        wid: that.data.options.id
      }
    }).then(res => {
      that.setData({
        section: res
      })
    })
  },
  getWordsPiece () {
    let that = this
    app.wxrequest({
      url: app.getUrl().wordsPiece,
      data: {
        wid: that.data.options.id,
        page: ++that.data.page,
        cid: that.data.info.cid
      }
    }).then(res => {
      that.setData({
        piece: that.data.piece ? that.data.piece.concat(res.lists) : [].concat(res.lists)
      })
      that.data.more = res.lists.length >= res.pre_page
    })
  },
  getWordsDiscuss () {
    let that = this
    app.wxrequest({
      url: app.getUrl().wordsDiscuss,
      data: {
        wid: that.data.options.id,
        state: 1,
        page: ++that.data.commentPage
      }
    }).then(res => {
      if (res.lists.length) {
        for (let v of res.lists) {
          v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm')
        }
        that.setData({
          comment: that.data.comment ? that.data.comment.concat(res.lists) : [].concat(res.lists)
        })
        that.data.commentMore = res.lists.length >= res.pre_page
      }
      that.data.replyIndex = -1
    }, () => {
      --that.data.commentPage
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
      url: app.getUrl().wordsDiscussSub,
      data: {
        wid: that.data.info.id,
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
    })
  },
  changeWordsDiscussStar (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl().wordsDiscussStar,
      data: {
        did: that.data.comment[e.currentTarget.dataset.index].id,
        uid: app.gs('userInfoAll').uid,
        wid: that.data.info.id,
        state: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
      }
    }).then(() => {
      that.setData({
        [`comment[${e.currentTarget.dataset.index}].is_star`]: that.data.comment[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1
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
    if (this.data.leftChoose <= 0) {
      if (!this.data.commentMore) {
        return app.toast({
          content: '没有更多评论了'
        })
      }
      this.getWordsDiscuss()
    } else if (this.data.leftChoose >= 2) {
      if (!this.data.more) {
        return app.toast({
          content: '没有更多作品了'
        })
      }
      this.getWordsPiece()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    }, () => {
      this.getWordsDes()
      this.getWordsDiscuss()
    })
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
          title: `${this.data.info.name}`,
          path: `/openShare/index/index?url=${i}&q=${this.data.info.id},${app.gs('userInfoAll').uid}`,
          imageUrl: `${this.data.info.img_name}`
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
