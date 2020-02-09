// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    list: [],
    more: true,
    page: 0,
    height: app.data.height,
    imgArr: ['https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_bottom_0.jpg'],
    chooseArr: [
      {
        t: '作品宽',
        tIndex: -1,
        items: ['100-100']
      },
      {
        t: '作品高',
        tIndex: -1,
        items: ['100-100']
      },
      {
        t: '摆放场景',
        tIndex: -1,
        items: ['100-100']
      },
      {
        t: '作品高',
        tIndex: -1,
        items: ['100-100']
      },
      {
        t: '摆放场景',
        tIndex: -1,
        items: ['100-100']
      },
      {
        t: '作品高',
        tIndex: -1,
        items: ['100-100']
      },
      {
        t: '摆放场景',
        tIndex: -1,
        items: ['100-100']
      }
    ]
  },
  chooseImage (e) {
    app.data['userBackImage'] = this.data.list[e.currentTarget.dataset.index].src
    app.su('backImageInfo', this.data.list[e.currentTarget.dataset.index])
    // app.su('backImageInfo', {
    //   src: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/sell/backOne/1w5ItgecfsjaqTV7FbovZEzn0HiYUxXu.jpg',
    //   zIndex: 11,
    //   positionItem: [
    //     {
    //       height: 483.334,
    //       width: 483.334,
    //       x: 375.84,
    //       y: 310.84
    //     }
    //   ]
    // })
    wx.navigateTo({
      url: `/commonPage/canvas2/index?single=${this.data.single}`
    })
  },
  itemChoose (e) {
    this.setData({
      [`chooseArr[${e.currentTarget.dataset.oindex}].tIndex`]: e.currentTarget.dataset.iindex * 1 === this.data.chooseArr[e.currentTarget.dataset.oindex].tIndex.tIdnex * 1 ? -1 : e.currentTarget.dataset.iindex
    })
  },
  confirmSceneChange () {
    this._toggleSpec()
  },
  _toggleSpec () {
    this.setData({
      showSpec: !this.data.showSpec
    })
  },
  typeChoose () {
    wx.chooseImage({
      count: 1,
      success (res) {
        app.data['chooseImage'] = res.tempFilePaths[0]
        wx.navigateTo({
          url: '/commonPage/canvas2/step_two/index'
        })
      }
    })
  },
  mounting () {
    app.wxrequest({
      url: app.getUrl().mounting,
      data: {
        page: ++this.data.page
      }
    }).then(res => {
      this.setData({
        list: this.data.list.concat(res.lists)
      })
      this.data.more = res.lists.length >= res.pre_page
    })
  },
  onReachBottom () {
    if (!this.data.more) {
      return app.toast({content: '没有更多内容了'})
    }
    this.mounting()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.data.single = options.single
    this.mounting()
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
