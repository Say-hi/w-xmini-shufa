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
    page: 0,
    list: [],
    more: true,
    capsules: app.data.capsule
  },
  _showColumn () {
    this.setData({
      showColumn: !this.data.showColumn
    })
  },
  getList (e) {
    let url = app.getUrl().dayList
    if (e && !e.detail.value.trim().length) {
      return app.toast({content: '请输入搜索内容'})
    } else if (e && e.detail.value.trim().length) {
      this.data.page = 0
      this.data.list = []
      url = app.getUrl().stackingSearch
    }
    let that = this
    app.wxrequest({
      url,
      data: e ? {
        word: e.detail.value.trim(),
        page: ++this.data.page
      } : {
        page: ++this.data.page
      }
    }).then(res => {
      if (e && e.detail.value) {
        let newArr = []
        for (let v of res.lists) {
          for (let s of v.data) {
            newArr.push(s)
          }
        }
        res.lists = newArr
      }
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
  getDesc () {
    let that = this
    app.wxrequest({
      url: app.getUrl().dayDesc
    }).then(res => {
      that.setData({
        des: res.des
      })
    })
  },

  onReachBottom () {
    if (!this.data.more) {
      return app.toast({content: '没有更多内容了'})
    }
    this.getList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getList()
    this.getDesc()
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
      path: `/dayword/index/index`
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.data.page = 0
    this.data.list = []
    this.getList()
    // this.getCourse()
  }
})
