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
    op: [{
      t: '评价管理',
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sell_op_0.png',
      c: '#ff0000',
      url: '/user/message/index?type=sellcomment'
    },
    {
      t: '流谦公约',
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sell_op_1.png',
      c: '#f39800',
      url: '/user/collect/index?type=zan'
    }
    ],
    uiOp: [{
      t: '我的提醒',
      n: 0,
      url: '/sell/notice/index'
    },
    {
      t: '发布的商品',
      n: 0,
      url: '/sell/goods/index?type=sell'
    },
    {
      t: '仓库中的商品',
      n: 0,
      url: '/sell/goods/index?type=warehouse'
    }
    ],
    tabArr: [{
      t: '待付款',
      n: 0,
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sell_tab_0.png',
      url: '/shop/order/index?type=1&from=sellShop' // 用户订单端
    },
    {
      t: '待发货 ',
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sell_tab_1.png',
      n: 0,
      url: '/shop/order/index?type=2&from=sellShop' // 用户销售端
    },
    {
      t: '待收货 ',
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sell_tab_2.png',
      n: 0,
      url: '/shop/order/index?type=3&from=sellShop'
    },
    {
      t: '已完成 ',
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sell_tab_3.png',
      n: 0,
      url: '/shop/order/index?type=4&from=sellShop'
    },
    {
      t: '退货中 ',
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sell_tab_4.png',
      n: 0,
      url: '/shop/order/index?type=5&from=sellShop'
    }
    ]
  },
  upFormId (e) {
    app.upFormId(e)
  },
  _toggleSign () {
    this.setData({
      sign: !this.data.sign
    })
  },
  shopUser () {
    if (this.data.userInfo) return
    app.wxrequest({
      url: app.getUrl().shopUser,
      data: {
        uid: app.gs('userInfoAll').uid
      }
    }).then(res => {
      res['rankText'] = app.gs('rankLv')[res.rank]
      this.setData({
        userInfo: res
      })
      this.sellInfo()
    }, () => {
      app.toast({
        content: '您尚未登陆，请先登陆系统',
        mask: true
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/user/login/index'
        })
      }, 1000)
    })
  },
  sellInfo () {
    app.wxrequest({
      url: app.getUrl().sellInfo,
      data: {
        uid: app.gs('userInfoAll').uid
      }
    }).then(res => {
      this.setData({
        'uiOp[0].n': res.remind_message,
        'uiOp[1].n': res.product_release,
        'uiOp[2].n': res.product_store,
        'tabArr[0].n': res.order_need_pay,
        'tabArr[1].n': res.order_deliver,
        'tabArr[2].n': res.order_need_receive,
        'tabArr[3].n': res.order_receive,
        'tabArr[4].n': res.order_refund
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
    this.shopUser()
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
    this.sellInfo()
    // this.getCourse()
  }
})
