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
    tabIndex: 0,
    tabId: 0,
    tabArr: ['关注', '推荐', '热议', '视频', '关注', '推荐', '热议', '视频'],
    secondIndex: 0,
    onePage: 0,
    oneMore: true,
    oneList: [],
    // twoPage: 0,
    // twoMore: true,
    twoList: [],
    threePage: 0,
    threeMore: true,
    threeList: []
  },
  chooseIndex (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    }, () => {
      this.data.twoList = []
      this.getTabTwo()
    })
  },
  _secondChoose (e) {
    this.setData({
      secondIndex: e.currentTarget.dataset.index
    }, () => {
      this.data.threePage = 0
      this.data.threeList = []
      this.getTabThree()
    })
  },
  getTabOneScroll () {
    if (!this.data.oneMore) {
      return app.toast({content: '没有更多内容了'})
    }
    this.getTabOne()
  },
  getTabOne () {
    let that = this
    app.wxrequest({
      url: app.getUrl().wordsCategory,
      data: {
        page: ++that.data.onePage
      }
    }).then(res => {
      if (res.lists) {
        that.setData({
          oneList: that.data.oneList.concat(res.lists)
        }, () => {
          if (that.data.onePage === 1) {
            that.getTabTwo()
          }
        })
        that.data.oneMore = res.lists.length >= res.pre_page
      }
    })
  },
  getTabTwo () {
    let that = this
    app.wxrequest({
      url: app.getUrl().wordsAll,
      data: {
        cid: that.data.oneList[that.data.tabIndex].id,
        page: 1
      }
    }).then(res => {
      if (res.lists) {
        that.setData({
          twoList: res.lists.slice(0, 9)
        }, () => {
          that._secondChoose({currentTarget: {dataset: {index: 0}}})
        })
        // that.data.twoMore = res.lists.length >= res.pre_page
      }
    })
  },
  getTabThree () {
    let that = this
    app.wxrequest({
      url: app.getUrl().wordsPiece,
      data: {
        cid: that.data.twoList[that.data.secondIndex].cid,
        wid: that.data.twoList[that.data.secondIndex].id,
        page: ++that.data.threePage
      }
    }).then(res => {
      that.setData({
        threeList: that.data.threeList.concat(res.lists)
      })
      that.data.threeMore = res.lists.length >= res.pre_page
    })
  },
  onReachBottom () {
    if (!this.data.threeMore) {
      return app.toast({content: '没有更多内容了'})
    }
    this.getTabThree()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getTabOne()
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
    app.checkUser({login: false})
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
    return {
      path: `/camera/index/index`
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
