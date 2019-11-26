// 获取全局应用程序实例对象
const app = getApp()
// const bmap = require('../../utils/bmap-wx')
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
    page: 0,
    list: [],
    more: true,
    tabArr: ['推荐', '楷书', '行书', '草书', '隶书', '篆书', '魏碑', '综合'],
    tabArr2: ['楷书', '行书', '草书', '隶书', '篆书', '魏碑', '综合']
  },
  upFormId (e) {
    app.upFormId(e)
  },
  chooseIndex (e) {
    this.data.page = 0
    this.data.list = []
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    }, this.getList)
  },
  getList () {
    let that = this
    app.wxrequest({
      url: app.getUrl()[this.data.mian ? 'videoVideoList' : 'teachVideoList'],
      data: this.data.mian ? {
        uid: app.gs('userInfoAll').uid,
        state: that.data.tabIndex * 1 + 1,
        page: ++that.data.page
      } : {
        uid: app.gs('userInfoAll').uid,
        state: that.data.tabIndex < 1 ? 1 : that.data.tabIndex,
        is_recommend: that.data.tabIndex < 1 ? 1 : 0,
        page: ++that.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.hits = v.hits > 10000 ? Math.floor(v.hits / 10000) + 'w' : v.hits
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
      main: options.from === 'main'
    }, this.getList)
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
