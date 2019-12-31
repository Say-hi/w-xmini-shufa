// 获取全局应用程序实例对象

const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    capsules: app.data.capsule,
    tabIndex: 0,
    tabId: 0,
    tabArr: ['每日一字的评论', '叠影纠错的评论', '百家争鸣的评论', '碑体的评论', '视频的评论', '社区的评论'],
    // tabArr: ['书法教学的评论', '每日一字的评论', '叠影纠错的评论', '百家争鸣的评论', '碑体的评论', '视频的评论', '社区的评论'],
    list: [],
    page: 0,
    more: true
  },
  goDetail (e) {
    let url = ''
    switch (this.data.tabIndex * 1) {
      case 0:
        url = `/dayword/detail/index?id=${this.data.list[e.currentTarget.dataset.index].wid}`
        break
      case 1:
        url = `/camera/detail/index?wid=${this.data.list[e.currentTarget.dataset.index].wid}&oid=${this.data.list[e.currentTarget.dataset.index].oid}`
        break
      case 2:
        url = `/hundred/detail/index?id=${this.data.list[e.currentTarget.dataset.index].pid}&from=nav`
        break
      case 3:
        url = `/stele/detail/index?id=${this.data.list[e.currentTarget.dataset.index].wid}`
        break
      case 4:
        url = `/teaching/detail/index?id=${this.data.list[e.currentTarget.dataset.index].vid}&from=main`
        break
      case 5:
        url =
          url = `/hundred/detail/index?id=${this.data.list[e.currentTarget.dataset.index].pid}&from=main`
        break
    }
    wx.navigateTo({
      url
    })
  },
  chooseIndex (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    }, () => {
      this.data.page = 0
      this.data.list = []
      this.getlist()
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
    this.setData({
      collection: !this.data.collection
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
  getlist () {
    app.wxrequest({
      url: app.getUrl()[this.data.options.type === 'comment' ? 'userDiscuss' : 'userFans'],
      data: this.data.options.type === 'comment' ? {
        uid: app.gs('userInfoAll').uid,
        state: this.data.tabIndex * 1 + 2,
        page: ++this.data.page
      } : {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm')
        // v.imgs_url = JSON.parse(v.imgs_url)
      }
      this.setData({
        list: this.data.list.concat(res.lists)
      })
      this.data.more = res.lists.length >= res.pre_page
    })
  },
  onReachBottom () {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多内容了'
      })
    }
    this.getlist()
  },
  follow (e) {
    app.wxrequest({
      url: app.getUrl().communityFollow,
      data: {
        fid: this.data.list[e.currentTarget.dataset.index].uid,
        uid: app.gs('userInfoAll').uid,
        state: this.data.list[e.currentTarget.dataset.index].is_each_other > 0 ? 2 : 1
      }
    }).then(() => {
      this.setData({
        [`list[${e.currentTarget.dataset.index}].is_each_other`]: this.data.list[e.currentTarget.dataset.index].is_each_other > 0 ? -1 : 1
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options // type: comment 评论 & fans 粉丝
    }, this.getlist)
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
