// 获取全局应用程序实例对象
const app = getApp()
// let timer = null
// let second = 60
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    capsules: app.data.capsule,
    codeText: '获取验证码',
    tnIndex: 0,
    tnArr: [{
      t: '社区帖子',
      url: '/hundred/detail/index?from=main&id='
    },
    {
      t: '百家争鸣帖子',
      url: '/hundred/detail/index?from=nav&id='
    },
    {
      t: '收藏的碑帖',
      url: '/stele/detail/index?id='
    }
    ],
    // tnArr: ['发布的帖子', '收藏的帖子', '收藏的碑帖'],
    list: [],
    page: 0,
    more: true
  },
  upFormId (e) {
    app.upFormId(e)
  },
  _tnChoose (e) {
    this.setData({
      tnIndex: e.currentTarget.dataset.index
    }, () => {
      this.data.list = []
      this.data.page = 0
      this.getlist()
    })
  },
  getlist () {
    app.wxrequest({
      url: app.getUrl()[this.data.options.type === 'zan' ? 'userStar' : 'userPostsRelease'],
      data: this.data.options.type === 'zan' ? {
        uid: app.gs('userInfoAll').uid,
        page: ++this.data.page
      } : {
        uid: app.gs('userInfoAll').uid,
        state: this.data.tnIndex * 1 + 1,
        page: ++this.data.page
      }
    }).then(res => {
      for (let v of res.lists) {
        v.create_at = app.momentFormat(v.create_at * 1000, 'YYYY-MM-DD HH:mm')
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
    this.getlist()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    }, this.getlist)
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
