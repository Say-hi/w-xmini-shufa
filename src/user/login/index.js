// 获取全局应用程序实例对象
const app = getApp()
let timer = null
let second = 60
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
    codeText: '获取验证码'
  },
  upFormId (e) {
    app.upFormId(e)
  },
  _getCode (phone) {
    if (timer) {
      return app.toast({
        content: `${second}秒后可再次获取验证码`
      })
    }
    let that = this
    that.setData({
      codeText: `${second}秒`
    })
    timer = setInterval(() => {
      second--
      if (second <= 0) {
        that.setData({
          codeText: '获取验证码'
        })
        clearInterval(timer)
        timer = null
        second = 60
      } else {
        that.setData({
          codeText: `${second}秒`
        })
      }
    }, 1000)
    app
      .wxrequest({
        url: app.getUrl().userCode,
        data: {
          phone
        }
      })
      .then(() => {
        app.toast({
          content: '验证码已发送,请注意查收',
          image: ''
        })
      })
  },
  _phoneLogin () {
    this.setData({
      phoneLogin: !this.data.phoneLogin
    })
  },
  _login (e) {
    // let that = this
    app
      .wxrequest({
        url: app.getUrl().userToken,
        data: {
          phone: e.detail.value.phone,
          code: e.detail.value.code
        }
      })
      .then(res => {
        res.phone = e.detail.value.phone
        if (app.gs('userInfoAll')) {
          app.su('userInfoAll', Object.assign(app.gs('userInfoAll'), res))
        } else {
          app.su('userInfoAll', res)
        }
        app.su('access_token', res.access_token)
        app.toast({
          content: '登录成功',
          mask: true
        })
        wx.login({
          success (loginRes) {
            console.log(e.detail.userInfo)
            app
              .wxrequest({
                url: app.getUrl().wechatOpenid,
                data: {
                  uid: app.gs('userInfoAll').uid,
                  code: loginRes.code,
                  avatar_url: e.detail.userInfo.avatarUrl,
                  nickname: e.detail.userInfo.nickName,
                  sex: e.detail.userInfo.gender,
                  phone: e.detail.value.phone
                }
              })
              .then(res => {
                app.su(
                  'userInfoAll',
                  Object.assign(app.gs('userInfoAll') || {}, res, {
                    avatar_url: e.detail.userInfo.avatarUrl,
                    nickname: e.detail.userInfo.nickName
                  })
                )
                wx.navigateBack()
              })
          }
        })
      })
  },
  phoneLogin (e) {
    if (e.detail.value.phone.length !== 11) {
      return app.toast({
        content: '请输入正确的手机号码'
      })
    }
    if (e.detail.target.id === 'code') {
      this._getCode(e.detail.value.phone)
    } else {
      if (!e.detail.value.code) {
        return app.toast({
          content: '请输入验证码'
        })
      }
      this._login(e)
    }
  },
  inputValue (e) {
    if (e.target.id === 'phone') this.data.phone = e.detail.value
    else if (e.target.id === 'code') this.data.code = e.detail.value
  },
  _getUserInfo (e) {
    if (!e.detail.signature) {
      return app.toast({
        content: '请授权后再操作'
      })
    }
    e.detail['value'] = {}
    e.detail['target'] = {}
    e.detail['target']['id'] = 'login'
    e.detail['value']['phone'] = this.data.phone || 0
    e.detail['value']['code'] = this.data.code || 0
    this.phoneLogin(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    setTimeout(() => {
      this.setData({
        bounceInUp: 'bounceInUp',
        logo: 'logo'
      })
    }, 200)
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
