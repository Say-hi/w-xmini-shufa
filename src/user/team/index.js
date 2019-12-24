// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    capsules: app.data.capsule,
    page: 0,
    more: true,
    list: []
  },
  _tnChoose () {
    this.setData({
      right: !this.data.right
    }, () => {
      this.data.page = 0
      this.data.list = []
      this.shopTeamList()
    })
  },
  noUp () {},
  _toggleGift () {
    this.setData({
      ruler: !this.data.ruler
    })
  },
  shopTeamList () {
    app.wxrequest({
      url: app.getUrl()[this.data.options.type === 'shop' ? 'shopTeamList' : 'userFriend'],
      data: this.data.options.type === 'shop' ? {
        uid: app.gs('userInfoAll').uid,
        rank: this.data.right ? 2 : 1,
        page: ++this.data.page
      } : {
        uid: app.gs('userInfoAll').uid,
        state: this.data.right ? 2 : 1,
        page: ++this.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm') : '时间不详'
      }
      this.setData({
        list: this.data.list.concat(res.lists)
      })
      this.data.more = res.lists.length >= res.pre_page
    })
  },
  onReachBottom () {
    if (!this.data.more) return
    this.shopTeamList()
  },
  goNext (e) {
    app.su('nextTeamInfo', this.data.list[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: `/user/tnext/index?id=${this.data.list[e.currentTarget.dataset.index].id}&type=${this.data.options.type}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    }, this.shopTeamList)
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
