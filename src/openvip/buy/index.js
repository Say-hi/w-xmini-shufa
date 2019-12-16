// 获取全局应用程序实例对象
const app = getApp()
// const bmap = require('../../utils/bmap-wx')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fix: app.data.fix,
    openType: 'reLaunch',
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    }
  },
  buy () {
    let that = this
    app.wxrequest({
      url: app.getUrl().payRank,
      data: {
        pid: that.data.info.sku[that.data.rankIndex].pid,
        uid: app.gs('userInfoAll').uid,
        sku_id: that.data.info.sku[that.data.rankIndex].id,
        count: 1,
        openid: app.gs('userInfoAll').openid,
        value: that.data.info.sku[that.data.rankIndex].value
      }
    }).then(res => {
      app.wxpay2(res.msg).then(() => {
        that.setData({
          success: true
        })
      }, () => {
        app.toast({
          content: '支付未完成,如有支付疑问,请联系管理员'
        })
      })
    })
  },
  getInfo () {
    let that = this
    app.wxrequest({
      url: app.getUrl().rankCard,
      data: {
        state: 1
      }
    }).then(res => {
      let rankT = app.gs('rankLv')
      for (let v of res.sku) {
        v['rankText'] = rankT[v.rank]
      }
      that.setData({
        info: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      rankIndex: options.index
    })
    let pages = getCurrentPages()
    pages[pages.length - 2].route === 'pages/index/index' && this.setData({
      openType: 'navigateBack'
    })
    this.getInfo()
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
