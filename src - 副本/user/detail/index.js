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
    // tab: [
    //   '全部收益',
    //   '今日收益',
    //   '已到帐',
    //   '待到账'
    // ],
    // tabIndex: 0,
    // capsules: app.data.capsule,
    tab: ['我的奖励', '我的提现'],
    leftChoose: 0,
    page: 0,
    more: true,
    list: []
  },
  _tnBChoose (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },
  _tnChoose () {
    this.setData({
      right: !this.data.right
    })
  },
  noUp () {},
  _toggleGift () {
    this.setData({
      ruler: !this.data.ruler
    })
  },
  _leftChoose (e) {
    this.setData({
      leftChoose: e.currentTarget.dataset.index
    }, () => {
      this.data.page = 0
      this.data.list = []
      this.getList()
    })
  },
  getList () {
    app.wxrequest({
      url: app.getUrl()[this.data.leftChoose >= 1 ? 'shopAppearList' : 'shopRewardList'],
      data: {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm:ss')
        v.finish_at = v.finish_at ? app.momentFormat(v.finish_at * 1000, 'YYYY-MM-DD HH:mm:ss') : null
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
    this.getList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options,
      leftChoose: options.index || 0
    }, this.getList)
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
