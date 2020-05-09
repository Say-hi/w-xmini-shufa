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
    capsules: app.data.capsule,
    tabIndex: 0,
    tabId: 0,
    tabArr: ['关注', '推荐', '热议', '视频'],
    page: 0
  },
  getHundredList () {
    let that = this
    app.wxrequest({
      url: app.getUrl()[this.data.options.from === 'main' ? 'communityList' : 'hundredList'],
      data: this.data.options.from === 'main' ? {
        uid: app.gs('userInfoAll').uid,
        page: ++that.data.page,
        state: this.data.tabIndex * 1 + 1
        // state: -1
      } : {
        uid: app.gs('userInfoAll').uid,
        page: ++that.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm')
        v.hits = v.hits > 10000 ? Math.floor(v.hits / 10000) + '万' : v.hits
        try {
          v.imgs_url = JSON.parse(v.imgs_url ? v.imgs_url : '{"imgs":[]}')
        } catch (e) {
          v.imgs_url = {
            imgs: []
          }
        }
      }
      that.setData({
        list: that.data.list ? that.data.list.concat(res.lists) : [].concat(res.lists)
      })
      that.data.more = res.lists.length >= res.pre_page
    })
  },
  _follow (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl()[this.data.options.from === 'main' ? 'communityFollow' : 'hundredFollow'],
      data: {
        fid: that.data.list[e.currentTarget.dataset.index].uid,
        uid: app.gs('userInfoAll').uid,
        state: that.data.list[e.currentTarget.dataset.index].is_follow > 0 ? 2 : 1
      }
    }).then(() => {
      let uid = that.data.list[e.currentTarget.dataset.index].uid * 1
      for (let [i, v] of that.data.list.entries()) {
        if (v.uid * 1 === uid) {
          that.setData({
            [`list[${i}].is_follow`]: that.data.list[i].is_follow > 0 ? -1 : 1
          })
        }
      }
    })
  },
  chooseIndex (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    }, () => {
      this.data.page = 0
      this.data.list = []
      this.getHundredList()
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
  changePostsStar (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl()[this.data.options.from === 'main' ? 'communityPostStar' : 'hundredPostsStar'],
      data: {
        uid: app.gs('userInfoAll').uid,
        pid: that.data.list[e.currentTarget.dataset.index].id,
        state: that.data.list[e.currentTarget.dataset.index].is_star > 0 ? 2 : 1
      }
    }).then(res => {
      that.setData({
        [`list[${e.currentTarget.dataset.index}].is_star`]: that.data.list[e.currentTarget.dataset.index].is_star > 0 ? -1 : 1,
        [`list[${e.currentTarget.dataset.index}].star`]: that.data.info.is_star > 0 ? --that.data.list[e.currentTarget.dataset.index].star : ++that.data.list[e.currentTarget.dataset.index].star
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    }, this.getHundredList)
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
    app.checkUser({
      login: false
    })
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
      path: `/hundred/index/index?from=${this.data.options.from}`
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
    this.data.page = 0
    this.data.more = true
    this.data.list = null
    this.getHundredList()
  },
  onReachBottom () {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多内容了'
      })
    }
    this.getHundredList()
  }
})
