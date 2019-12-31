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
    capsules: app.data.capsule,
    page: 0,
    more: true,
    textArr: ['未评价', '非常差', '差', '一般', '好', '非常好'],
    list: []
  },
  upFormId (e) {
    app.upFormId(e)
  },
  shopUserDiscuss () {
    app.wxrequest({
      url: app.getUrl().shopUserDiscuss,
      data: {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm') : '时间不详'
        v.imgs_url = JSON.parse(v.imgs_url)
      }
      this.setData({
        list: this.data.list.concat(res.lists)
      })
      this.data.more = res.lists.length >= res.pre_page
    })
  },
  shopNotice () {
    app.wxrequest({
      url: app.getUrl().shopNotice,
      data: {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY年MM月DD日 HH:mm') : '时间不详'
      }
      this.setData({
        list: this.data.list.concat(res.lists)
      })
      this.data.more = res.lists.length >= res.pre_page
    })
  },
  getList () {
    switch (this.data.options.type) {
      case 'shopcomment':
        this.shopUserDiscuss()
        break
      case 'user':
        break
      case 'shop':
        this.shopNotice()
        break
      case 'sellcomment':
        this.sellcomment()
        break
    }
  },
  sellcomment () {
    app.wxrequest({
      url: app.getUrl().sellDiscuss,
      data: {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD') : '时间不详'
        v.imgs_url = JSON.parse(v.imgs_url)
      }
      this.setData({
        list: this.data.list.concat(res.lists)
      })
      this.data.more = res.lists.length >= res.pre_page
    })
  },
  onReachBottom () {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多内容了'
      })
    }
    this.getList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options,
      theme: options.type === 'sellcomment' ? '评论管理' : options.type === 'user' ? '我的帖子' : options.type === 'shop' ? '我的消息' : '我的评价'
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
  onShow () {},
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
