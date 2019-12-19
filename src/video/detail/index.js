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
    height: app.data.height,
    tabIndex: 0,
    tabId: 0
  },
  chooseIndex (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    })
  },
  _showColumn (e) {
    // console.log(e)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
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
