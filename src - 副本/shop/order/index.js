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
    height: app.data.height,
    tabIndex: 0,
    addressInfo: app.gs('addressInfo'),
    tabId: 0,
    // '', '待付款', '待发货', '待收货', '待评价'
    tabArr: [{
      t: '全部',
      s: 0
    },
    {
      t: '待付款',
      s: -1
    },
    {
      t: '待发货',
      s: 1
    },
    {
      t: '待收货',
      s: 2
    },
    {
      t: '待评价',
      s: 3
    }
    ],
    tabArrSell: [{
      t: '全部',
      s: 0
    },
    {
      t: '待付款',
      s: -1
    },
    {
      t: '待发货',
      s: 1
    },
    {
      t: '待收货',
      s: 2
    },
    {
      t: '已完成',
      s: 3
    },
    {
      t: '退货中',
      s: -2
    }
    ],
    cancelArr: ['收货地址填错了', '忘记支付密码／余额不足', '无法正常支付', '不想购买', '其他原因'],
    cancelIndex: 0,
    page: 0,
    list: [],
    more: true
  },
  payAgain (e) {
    // let that = this
    app.wxrequest({
      url: app.getUrl().payShopAgain,
      data: {
        oid: this.data.list[e.currentTarget.dataset.index].id,
        uid: app.gs('userInfoAll').uid,
        openid: app.gs('userInfoAll').openid
      }
    }).then(res => {
      app.wxpay2(res.msg).then(() => {
        app.toast({
          content: '付款成功',
          image: ''
        })
        this.setData({
          [`list[${e.currentTarget.dataset.index}].status`]: '待发货',
          [`list[${e.currentTarget.dataset.index}].statuss`]: 1
        })
      }, () => {
        app.toast({
          content: '未完成支付,如有支付遇到问题,请联系客服处理'
        })
      })
    })
  },
  changeAddress () {
    // console.log(this.data.chooseOrderIndex)
    app.wxrequest({
      url: app.getUrl().shopOrderUpdate,
      data: {
        oid: this.data.list[this.data.chooseOrderIndex].id,
        out_trade_no: this.data.list[this.data.chooseOrderIndex].out_trade_no,
        uid: app.gs('userInfoAll').uid,
        name: this.data.addressInfo.userName,
        phone: this.data.addressInfo.telNumber,
        address: `${this.data.addressInfo.provinceName}${this.data.addressInfo.cityName}${this.data.addressInfo.countyName}${this.data.addressInfo.detailInfo}`
      }
    }).then(() => {
      app.toast({
        content: '地址修改成功',
        image: ''
      })
      this._toggleMask({
        currentTarget: {
          dataset: {
            type: 'changeAdd'
          }
        }
      })
    })
  },
  showExpress (e) {
    console.log(e)
    if (e.currentTarget.dataset.skuorderid) {
      this.setData({
        expressObj: {
          out_trade_no: this.data.list[e.currentTarget.dataset.index].out_trade_no,
          order_num: e.currentTarget.dataset.skuordernum,
          state: this.data.options.from ? 2 : 1,
          sku_order_id: e.currentTarget.dataset.skuorderid
        }
      })
    } else {
      this.setData({
        expressObj: {
          out_trade_no: this.data.list[e.currentTarget.dataset.index].out_trade_no,
          order_num: this.data.list[e.currentTarget.dataset.index].order_num,
          state: this.data.options.from ? 2 : 1
        }
      })
    }
  },
  chooseIndex (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      tabId: e.currentTarget.dataset.index
    }, () => {
      this.data.page = 0
      this.data.list = []
      this.shopOrderList()
    })
  },
  _cancelChoose (e) {
    this.setData({
      cancelIndex: e.currentTarget.dataset.index
    })
  },
  // _cancelMask () {
  //   if (this.data.cancelOrder) {
  //     this.setData({
  //       cancelOrderAnimate: !this.data.cancelOrderAnimate
  //     })
  //     setTimeout(() => {
  //       this.setData({
  //         cancelOrder: !this.data.cancelOrder
  //       })
  //     }, 900)
  //     return
  //   }
  //   this.setData({
  //     cancelOrderAnimate: !this.data.cancelOrderAnimate,
  //     cancelOrder: !this.data.cancelOrder
  //   })
  // },
  _toggleMask (e) {
    let type = e.currentTarget.dataset.type
    let animate = type + 'Animate'
    if (this.data[type]) {
      this.setData({
        [animate]: !this.data[animate]
      })
      setTimeout(() => {
        this.setData({
          [type]: !this.data[type]
        })
      }, 900)
      return
    }
    this.setData({
      [animate]: !this.data[animate],
      [type]: !this.data[type]
    })
    this.data.chooseOrderIndex = e.currentTarget.dataset.index
  },
  // 选择地址
  chooseAddress () {
    if (this.data.lostTime) return
    let that = this
    wx.chooseAddress({
      success (res) {
        if (res.telNumber) { // 获取信息成功
          wx.setStorageSync('addressInfo', res)
          that.setData({
            needSetting: false,
            addressInfo: res
          })
        }
      },
      fail () {
        wx.getSetting({
          success (res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              })
              app.toast({
                content: '需授权获取地址信息'
              })
            }
          }
        })
      }
    })
  },
  // 获取设置
  openSetting () {
    let that = this
    wx.openSetting({
      success (res) {
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          })
          that.chooseAddress()
        }
      }
    })
  },
  _remind (e) {
    app.wxrequest({
      url: app.getUrl().shopRemind,
      data: {
        oid: e.currentTarget.dataset.id,
        uid: app.gs('userInfoAll').uid
      }
    }).then(() => {
      app.toast({
        content: '提醒商家发货成功',
        image: ''
      })
    })
  },
  _buyAgain () {
    app.toast({
      content: '商品已添加到您的购物车中',
      image: ''
    })
  },
  shopOrderList () {
    app.wxrequest({
      url: app.getUrl()[this.data.options.from === 'sellShop' ? 'sellOrderList' : 'shopOrderList'],
      data: {
        page: ++this.data.page,
        uid: app.gs('userInfoAll').uid,
        // 0获取全部 -1未支付 1已支付准备发货 2已发货 3已收货 4收货后删除订单 -2申请退款 -3 退款成功 -4 未支付删除 -5 退款并删除订单 -6拒绝退款
        status: this.data[this.data.options.from === 'sellShop' ? 'tabArrSell' : 'tabArr'][this.data.tabIndex]['s']
      }
    }).then(res => {
      for (let v of res.lists) {
        // v.order_num = '544629261291'
        v.create_at = v.create_at ? app.momentFormat(v.create_at * 1000, this.data.options.from === 'sellShop' ? 'MM月DD日 HH:mm' : 'YYYY-MM-DD HH:mm') : '时间不详'
        v.statuss = v.status
        switch (v.status * 1) {
          case 0:
            v.status = '无状态'
            break
          case 1:
            v.status = '待发货'
            break
          case 2:
            v.status = '待收货'
            break
          case 3:
            v.status = '待评价'
            break
          case 4:
            v.status = '已删除'
            break
          case -1:
            v.status = '待付款'
            break
          case -2:
            v.status = '退款中'
            break
          case -3:
            v.status = '退款成功'
            break
          case -4:
            v.status = '无效订单'
            break
          case -5:
            v.status = '已退款'
            break
          case -6:
            v.status = '退款失败'
            break
        }
        if (this.data.options.from !== 'sellShop') {
          v.all_count = 0
          for (let s of v.list) {
            v.all_count += s.count * 1
          }
        }
      }
      this.setData({
        list: this.data.list.concat(res.lists)
      })
      this.data.more = res.lists.length >= res.pre_page
    })
  },
  orderOperate (e) {
    app.wxrequest({
      url: app.getUrl().shopOrderOperate,
      data: {
        oid: this.data.list[e.currentTarget.dataset.op === 'confirm' ? e.currentTarget.dataset.index : this.data.chooseOrderIndex].id,
        uid: app.gs('userInfoAll').uid,
        state: e.currentTarget.dataset.op === 'confirm' ? 3 : -4,
        remark: e.currentTarget.dataset.op === 'confirm' ? '' : this.data.cancelArr[this.data.cancelIndex],
        out_trade_no: this.data.list[e.currentTarget.dataset.op === 'confirm' ? e.currentTarget.dataset.index : this.data.chooseOrderIndex].out_trade_no
      }
    }).then(() => {
      app.toast({
        content: e.currentTarget.dataset.op === 'confirm' ? '订单信息修改成功' : '订单已删除',
        image: ''
      })
      this.data.list.splice(e.currentTarget.dataset.op === 'confirm' ? e.currentTarget.dataset.index : this.data.chooseOrderIndex, 1)
      this.setData({
        list: this.data.list
      })
      this._toggleMask(e)
    })
  },
  orderListOperate (e) {
    app.wxrequest({
      url: app.getUrl().orderListOperate,
      data: {
        sku_order_id: e.currentTarget.dataset.skuorderid,
        uid: app.gs('userInfoAll').uid
      }
    }).then(res => {
      console.log(res)
    })
  },
  backMoney (e) {
    if (e.currentTarget.dataset.item >= 0) {
      app.su('backInfoItem', e.currentTarget.dataset.item)
    }
    app.su('backInfo', this.data.options.from === 'sell' ? Object.assign(this.data.list[e.currentTarget.dataset.index], {
      goodsType: 'sell' // 自售订单用户退款增加类型检测
    }) : this.data.list[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: '/commonPage/back/back'
    })
  },
  goPJ (e) {
    app.su('pjInfo', this.data.options.from === 'sell' ? Object.assign(this.data.list[e.currentTarget.dataset.index], {
      goodsType: 'sell' // 自售订单用户退款增加类型检测
    }) : this.data.list[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: `/commonPage/talk/index?type=comment`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options,
      tabIndex: options.type || 0,
      tabId: options.type
    }, this.shopOrderList)
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
  // onShareAppMessage () {
  //   // return {
  //   //   title: app.gs('shareText').t || '绣学问，真纹绣',
  //   //   path: `/pages/index/index`,
  //   //   imageUrl: app.gs('shareText').g
  //   // }
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
