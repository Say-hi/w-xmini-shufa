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
    capsules: app.data.capsule,
    page: 0,
    more: true,
    list: []
  },
  upFormId (e) {
    app.upFormId(e)
  },
  shopProducts () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopProducts,
      data: {
        cid: that.data.options.id,
        page: ++that.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        if (v.new_price) v.new_price = v.new_price.split('.')
        else v.new_price = v.price.split('.')
        if (!v.img_url) {
          v.img_url = JSON.parse(v.imgs_url)[0].img_url
        }
      }
      that.setData({
        list: that.data.list.concat(res.lists)
      })
      that.data.more = res.lists.length >= res.pre_page
    })
  },
  onReachBottom () {
    if (!this.data.more) {
      return app.toast({content: '没有更多内容了'})
    }
    this.shopProducts()
  },
  search (e) {
    if (e.detail.value.trim().length < 1) return app.toast({content: '请输入搜索内容'})
    this.data.page = 0
    this.data.list = []
    app.wxrequest({
      url: app.getUrl().shopSearch,
      data: {
        title: e.detail.value.trim(),
        page: ++this.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.new_price = v.new_price.split('.')
      }
      this.setData({
        list: this.data.list.concat(res.lists)
      })
      this.data.more = res.lists.length >= res.pre_page
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.data.options = options
    this.setData({
      name: options.name
    }, this.shopProducts)
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
  // onShareAppMessage () {
  //   // return {
  //   //   title: app.gs('shareText').t || '绣学问，真纹绣',
  //   //   path: `/pages/index/index`,
  //   //   imageUrl: app.gs('shareText').g
  //   // }
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
