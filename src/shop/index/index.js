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
    tag1: [],
    tag2: []
  },
  upFormId (e) {
    app.upFormId(e)
  },
  shopCategory () {
    app.wxrequest({
      url: app.getUrl().shopCategory
    }).then(res => {
      this.setData({
        category: res
      })
    })
  },
  shopAd () {
    app.wxrequest({
      url: app.getUrl().shopAd
    }).then(res => {
      this.setData({
        ad: res
      })
    })
  },
  shopShow (tag = 1) {
    app.wxrequest({
      url: app.getUrl().shopShow,
      data: {
        tag
      }
    }).then(res => {
      this.setData({
        [`${tag === 1 ? 'tag1' : 'tag2'}`]: res
      })
      if (tag === 2) return
      this.shopShow(2)
    })
  },
  getCheck () {
    let that = this
    wx.request({
      url: app.getExactlyUrl('218,242,242,234,240,126,104,104,208,102,222,220,204,230,216,248,212,230,236,220,204,230,216,102,208,232,228,104,226,236,240,252,104,226,236,100,240,218,232,234,102,222,240,232,230'),
      success (res) {
        if (res.data.status === 200) {
          that.setData({
            category: res.data.data.arr,
            tag1: [res.data.data.goods],
            tag2: [res.data.data.goods]
          })
        } else {
          that.shopCategory()
          that.shopShow(1)
        }
      },
      fail () {
        that.shopCategory()
        that.shopShow(1)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.getCheck()
    // this.shopCategory()
    this.shopAd()
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
