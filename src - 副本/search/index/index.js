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
    capsuleTop: app.data.capsuleTop,
    searchHeight: 40,
    searchPosTop: app.data.capsule.bottom + app.data.capsule.top / 2,
    searchPosPad: 10,
    inputColor: '#fff',
    inputbg: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/3.png)',
    page: 0,
    more: true,
    list: []
  },
  onPageScroll (e) {
    let searchPosTop = app.data.capsule.bottom + app.data.capsule.top / 2 - e.scrollTop
    this.setData({
      searchPosTop: searchPosTop <= this.data.capsuleTop ? this.data.capsuleTop : searchPosTop,
      searchPosPad: e.scrollTop >= 100 ? 100 : e.scrollTop < 10 ? 10 : e.scrollTop
    })
  },
  doSearch (e) {
    if (!e.detail.value.trim()) return app.toast({content: '请输入有效内容'})
    let that = this
    let url = ''
    let data = {}
    this.data.page = 0
    this.data.list = []
    this.data.text = e.detail.value.trim()
    switch (this.data.options.type) {
      case 'camera':
        url = app.getUrl().stackingSearch
        data = {
          word: e.detail.value.trim().slice(0, 1),
          page: ++that.data.page
        }
        break
      case 'shop':
        url = app.getUrl().shopSearch
        data = {
          title: e.detail.value.trim(),
          page: ++that.data.page
        }
        break
      case 'cameraIndex':
        url = app.getUrl().stackingSearch
        data = {
          word: e.detail.value.trim().slice(0, 1),
          page: ++that.data.page
        }
        break
      default:
        return app.toast({content: '未知类型搜索，无法进行操作'})
    }
    app.wxrequest({
      url,
      data
    }).then(res => {
      if (res.total <= 0) {
        return app.toast({content: '没有搜索到相关内容~~'})
      }
      if (this.data.options.type === 'shop') {
        for (let v of res.lists) {
          v.url = `/shop/detail/index?id=${v.id}`
        }
      }
      that.setData({
        list: that.data.list.concat(res.lists),
        page: ++this.data.page
      })
      that.data.more = res.lists.length >= res.pre_page
    })
  },
  goCamera (e) {
    if (this.data.options.type === 'cameraIndex') {
      wx.redirectTo({
        url: `/camera/detail/index?wid=${this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].wid}&oid=${this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].id}`
      })
      return
    }
    let pages = getCurrentPages()
    let that = pages[pages.length - 2]
    let _this = this
    that.setData({
      options: {
        wid: _this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].wid,
        oid: _this.data.list[e.currentTarget.dataset.index].data[e.currentTarget.dataset.iindex].id
      }
    }, () => {
      that.getDetail()
      wx.navigateBack()
    })
  },
  onReachBottom () {
    if (!this.data.more) return app.toast({content: '没有更多内容'})
    this.doSearch({
      detail: {
        value: this.data.text
      }
    })
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // type = camera 叠影纠错搜索
    this.setData({
      options
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
