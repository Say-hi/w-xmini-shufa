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
      bgc: '',
      hImg: null
    },
    userInfoAll: {},
    capsules: app.data.capsule,
    op: [
      {
        t: '我的收益',
        i: 'jwqjindutiaoshouyidaozhang',
        c: '#ff0000',
        url: '/user/money/index'
      },
      {
        t: '我的赞',
        i: 'jwqshoucang',
        c: '#f39800',
        url: '/user/collect/index?type=zan'
      },
      {
        t: '意见反馈',
        i: 'jwqyoujian',
        c: '#0068b7',
        url: '/commonPage/talk/index?type=suggest'
      }
    ],
    uiOp: [
      {
        t: '帖子',
        n: 0,
        url: '/user/collect/index?type=send'
      },
      {
        t: '评论',
        n: 0,
        url: '/user/comment/index?type=comment'
      },
      {
        t: '粉丝',
        n: 0,
        url: '/user/comment/index?type=fans'
      }
    ],
    tabArr: [
      {
        t: '我的师友',
        i: 'https://c.jiangwenqiang.com/lqsy/user1.png',
        url: '/user/team/index'
      },
      {
        t: '邀约好友',
        i: 'https://c.jiangwenqiang.com/lqsy/user2.png',
        url: '/share/carShare/carShare?type=user'
      },
      {
        t: '关于流谦',
        i: 'https://c.jiangwenqiang.com/lqsy/user3.png',
        url: ''
      },
      {
        t: '我的消息',
        i: 'https://c.jiangwenqiang.com/lqsy/user4.png',
        url: '/user/message/index?type=shop'
      }
    ]
  },
  goUrl (e) {
    if (this.data.tabArr[e.currentTarget.dataset.index].t === '邀约好友') {
      app.su('scene', `7*${app.gs('userInfoAll').uid}`)
    }
    wx.navigateTo({
      url: this.data.tabArr[e.currentTarget.dataset.index].url
    })
  },
  upFormId (e) {
    app.upFormId(e)
  },
  _toggleSign () {
    this.setData({
      sign: !this.data.sign
    })
  },
  _sign (e) {
    let that = this
    if (!e.detail.value.sign.trim()) {
      return app.toast({
        content: '请输入内容'
      })
    }
    app
      .wxrequest({
        url: app.getUrl().userSign,
        data: {
          uid: app.gs('userInfoAll').uid,
          sign: e.detail.value.sign.trim()
        }
      })
      .then(() => {
        app.toast({
          content: '修改成功',
          image: ''
        })
        that.userInfo()
        that._toggleSign()
      })
  },
  _getUserInfo (e) {
    let that = this
    if (!app.gs('access_token')) {
      app.toast({
        content: '请先登录再进行此操作'
      })
      wx.navigateTo({
        url: '/user/login/index'
      })
      return
    }
    wx.login({
      success (loginRes) {
        app.wxrequest({
          url: app.getUrl().wechatOpenid,
          data: {
            uid: app.gs('userInfoAll').uid || null,
            code: loginRes.code,
            avatar_url: e.detail.userInfo.avatarUrl,
            nickname: e.detail.userInfo.nickName,
            phone: app.gs('userInfoAll').phone || null
          }
        }).then(res => {
          app.su(
              'userInfoAll',
              Object.assign(app.gs('userInfoAll') || {}, res, {
                avatar_url: e.detail.userInfo.avatarUrl,
                nickname: e.detail.userInfo.nickName
              })
            )
          that.setData({
            userInfoAll: app.gs('userInfoAll')
          })
        })
      }
    })
  },
  clean () {
    wx.removeStorageSync('userInfoAll')
    setTimeout(() => {
      this.setData({
        userInfoAll: {}
      })
    }, 10)
  },
  userInfo () {
    if (!app.gs('userInfoAll').uid) {
      return app.toast({
        content: '您尚未登录哦'
      })
    }
    app
      .wxrequest({
        url: app.getUrl().userInfo,
        data: {
          uid: app.gs('userInfoAll').uid
        }
      })
      .then(res => {
        this.setData({
          user: res,
          'uiOp[0].n': res.posts_count,
          'uiOp[1].n': res.posts_discuss_count,
          'uiOp[2].n': res.fans
        })
      })
    app
      .wxrequest({
        url: app.getUrl().shopUser,
        data: {
          uid: app.gs('userInfoAll').uid
        }
      })
      .then(res => {
        this.setData({
          rank: res.rank,
          rankText: app.gs('rankLv')[res.rank]
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {},
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
    this.userInfo()
    this.setData({
      userInfoAll: app.gs('userInfoAll')
    })
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
      path: `/user/index/index`
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
