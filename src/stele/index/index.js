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
    more: true,
    page: 0,
    list: [],
    capsules: app.data.capsule
  },
  _showAll () {
    this.setData({
      showAll: !this.data.showAll,
      capsule: {
        transparent: false,
        bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
      }
    })
  },
  getWordsAll () {
    let that = this
    if (!this.data.more) {
      return app.toast({
        content: '没有更多内容了'
      })
    }
    app.wxrequest({
      url: app.getUrl().wordsAll,
      data: {
        cid: that.data.options.id,
        page: ++that.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.hits = v.hits > 10000 ? Math.floor(v.hits / 10000) + '万' : v.hits
        v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD') : '时间不详'
      }
      that.setData({
        list: that.data.list.concat(res.lists)
      })
      that.data.more = res.lists.length >= res.pre_page
    }, () => {
      --that.data.page
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    }, this.getWordsAll)
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
      title: `${this.data.options.name}`,
      path: `/stele/index/index?id=${this.data.options.id}&name=${this.data.options.name}`,
      imageUrl: app.gs('shareText').g
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.data.more = true
    this.data.list = []
    this.data.page = 0
    this.getWordsAll()
    // this.getCourse()
  },
  onReachBottom () {
    if (!this.data.more) {
      return app.toast({content: '没有更多内容了'})
    }
    this.getWordsAll()
  }
})
