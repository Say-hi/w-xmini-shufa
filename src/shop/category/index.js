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
      bgc: '',
      hImg: ''
    },
    capsules: app.data.capsule,
    scrollHeight: wx.getSystemInfoSync().screenHeight - app.data.capsule.bottom - app.data.capsule.top / 2 - 105 - (app.data.fix ? 20 : 0),
    cLeftIndex: 0,
    page: 0,
    more: true,
    list: []
  },
  upFormId (e) {
    app.upFormId(e)
  },
  _leftChoose (e) {
    this.setData({
      cLeftIndex: e.currentTarget.dataset.index
    }, () => {
      this.data.page = 0
      this.data.list = []
      this.shopProducts()
    })
  },
  shopCategory () {
    app.wxrequest({
      url: app.getUrl().shopCategory
    }).then(res => {
      let cLeftIndex = 0
      for (let [i, v] of res.entries()) {
        if (v.id * 1 === this.data.options.id * 1) {
          cLeftIndex = i
        }
      }
      this.setData({
        category: res,
        cLeftIndex
      }, this.shopProducts)
    })
  },
  shopProducts () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopProducts,
      data: {
        cid: that.data.category[that.data.cLeftIndex].id,
        page: ++that.data.page
      }
    }).then(res => {
      that.setData({
        list: that.data.list.concat(res.lists)
      })
      that.data.more = res.lists.length >= res.pre_page
    })
  },
  // onReachBottom () {
  //   if (!this.data.more) {
  //     return app.toast({content: '没有更多内容了'})
  //   }
  //   this.shopProducts()
  // },
  moreShopProducts () {
    if (!this.data.more) {
      return app.toast({content: '没有更多内容了'})
    }
    this.shopProducts()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    }, this.shopCategory)
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
