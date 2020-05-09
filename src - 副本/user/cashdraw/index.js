// 获取全局应用程序实例对象
const app = getApp()
let second = 60
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
    capsules: app.data.capsule,
    codeText: '获取验证码'
  },
  _getCode () {
    if (this.timer) {
      return app.toast({
        content: `${second}秒后可再次获取验证码`
      })
    }
    let that = this
    app.wxrequest({
      url: app.getUrl().shopCode,
      data: {
        uid: app.gs('userInfoAll').uid
      }
    }).then(res => {
      that.setData({
        codeText: `${second}秒`
      })
      that.timer = setInterval(() => {
        second--
        if (second <= 0) {
          that.setData({
            codeText: '获取验证码'
          })
          clearInterval(that.timer)
          that.timer = null
          second = 60
        } else {
          that.setData({
            codeText: `${second}秒`
          })
        }
      }, 1000)
    })
  },
  inputvlaue (e) {
    this.data.money = e.detail.value
  },
  _phoneLogin () {
    if (!this.data.money || this.data.money > this.data.info.appear_money) {
      return app.toast({
        content: '请输入合理的金额'
      })
    } else if (this.data.money < 10) {
      return app.toast({
        content: '最小提现金额为10元'
      })
    }
    this.setData({
      phoneLogin: !this.data.phoneLogin
    }, () => {
      !this.timer && this._getCode()
    })
  },
  close () {
    this.setData({
      phoneLogin: !this.data.phoneLogin
    })
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
      this.setData({
        codeText: '获取验证码'
      })
    }
  },
  shopUser () {
    app.wxrequest({
      url: app.getUrl().shopUser,
      data: {
        uid: app.gs('userInfoAll').uid
      }
    }).then(res => {
      res.phones = res.phone.slice(0, 3) + '***' + res.phone.slice(7)
      this.setData({
        info: res
      })
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
  getAll () {
    this.setData({
      money: this.data.info.appear_money
    })
  },
  cash (e) {
    if (!e.detail.value.code) {
      return app.toast({
        content: '请输入验证码'
      })
    } else if (this.data.money < 10) {
      return app.toast({
        content: '最小提现金额为10元'
      })
    } else if (this.data.money > this.data.info.appear_money) {
      return app.toast({
        content: `您的余额不足, 请重新输入提现金额`
      })
    }
    app.wxrequest({
      url: app.getUrl().shopAppear,
      data: {
        openid: app.gs('userInfoAll').openid,
        uid: app.gs('userInfoAll').uid,
        amount: this.data.money,
        code: e.detail.value.code
      }
    }).then(res => {
      app.toast({
        content: '提现成功',
        image: ''
      })
      this.shopUser()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.timer && clearInterval(this.timer)
    // this.shopUser()
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
    this.shopUser()
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
