// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fix: app.data.fix,
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    capsules: app.data.capsule
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
        // console.log(res)
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          })
          that.chooseAddress()
        }
      }
    })
  },
  pay () {
    if (this.data.oid) return this.payAgain()
    if (!this.data.addressInfo || !this.data.addressInfo.telNumber) {
      return app.toast({
        content: '请填写收货地址信息'
      })
    }
    let carts = []
    let that = this
    for (let v of this.data.info) {
      carts.push({
        pid: v.pid,
        count: v.count,
        sku_id: v.sku_id,
        value: v.product.value
      })
    }
    app.wxrequest({
      url: app.getUrl().payShop,
      data: {
        name: this.data.addressInfo.userName,
        phone: this.data.addressInfo.telNumber,
        uid: app.gs('userInfoAll').uid,
        openid: app.gs('userInfoAll').openid,
        address: `${this.data.addressInfo.provinceName}${this.data.addressInfo.cityName}${this.data.addressInfo.countyName}${this.data.addressInfo.detailInfo}`,
        carts: JSON.stringify(carts)
      }
    }).then(res => {
      that.data.oid = res.oid
      app.wxpay2(res.msg).then(() => {
        that.setData({
          paySuccess: true
        })
      }, () => {
        app.toast({
          content: '未完成支付,如有支付遇到问题,请联系客服处理'
        })
      })
    })
  },
  payAgain () {
    let that = this
    app.wxrequest({
      url: app.getUrl().payShopAgain,
      data: {
        oid: this.data.oid,
        uid: app.gs('userInfoAll').uid,
        openid: app.gs('userInfoAll').openid
      }
    }).then(res => {
      app.wxpay2(res.msg).then(() => {
        that.setData({
          paySuccess: true
        })
      }, () => {
        app.toast({
          content: '未完成支付,如有支付遇到问题,请联系客服处理'
        })
      })
    })
  },
  getMaxFreight () {
    let maxFreight = 0
    for (let v of this.data.info) {
      maxFreight = maxFreight > v.product.freight ? maxFreight : v.product.freight
    }
    app.getMaxFright(this)
    this.setData({
      maxFreight: maxFreight * 1
    }, this.getGoodsMoney)
  },
  getGoodsMoney () {
    let goodsMoney = 0
    for (let v of this.data.info) {
      goodsMoney += v.count * v.product.price
    }
    this.setData({
      goodsMoney,
      totalMoney: goodsMoney + this.data.maxFreight
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options,
      info: app.gs('buyInfo'),
      addressInfo: app.gs('addressInfo')
    }, this.getMaxFreight)
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
      rank: false
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
