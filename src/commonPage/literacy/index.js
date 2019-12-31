// 获取全局应用程序实例对象
const app = getApp()
// const config = require('../config')
// const COS = require('../cos-js-sdk-v5.min')
// const cos = new COS({
//   getAuthorization (params, callback) {
//     let authorization = COS.getAuthorization({
//       SecretId: config.SecretId,
//       SecretKey: config.SecretKey,
//       Method: params.Method,
//       Key: params.Key
//     })
//     callback(authorization)
//   }
// })
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    tab: [{
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/camera.png',
      t: '拍照'
    },
    {
      i: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/camera_pic.png',
      t: '照片'
    }
    ],
    page: 0,
    more: true,
    outList: [],
    itemIndex: 0
  },
  _literacy (e) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [e.currentTarget.dataset.index > 0 ? 'album' : 'camera'],
      success (res1) {
        app.toast({
          content: '图片上传中',
          mask: true,
          time: 999999
        })
        let FilePath = res1.tempFilePaths[0]
        that.setData({
          imgUrl: FilePath
        })
        app.cloud().getImgCheck(FilePath).then(() => {
          wx.uploadFile({
            url: app.getExactlyUrl(app.getUrl().distinguishKnow),
            filePath: FilePath,
            name: 'file',
            formData: {
              uid: app.gs('userInfoAll').uid,
              file: FilePath
            },
            success (res) {
              wx.hideLoading()
              app.toast({
                content: '',
                image: '',
                time: 100
              })
              that.data.page = 0
              that.data.outList = []
              let list = JSON.parse(res.data).data.words_result
              for (let v of list) {
                v.probability.average = Math.floor(v.probability.average * 100)
                v.words = v.words.slice(0, 1)
              }
              list.sort((a, b) => {
                return b.probability.average - a.probability.average
              })
              that.setData({
                list
              }, () => {
                that._toggleShow()
                list[0] && list[0].words && that.getWordOut(list[0].words)
              })
            },
            fail () {
              wx.hideLoading()
              app.toast({
                content: '上传失败'
              })
            }
          })
        }, () => {
          wx.hideLoading()
          app.toast({
            content: '为了营造绿色的网络环境，检测发现您的图片存在违规内容，请更换图片'
          })
        })
      }
    })
  },
  _toggleShow () {
    this.setData({
      literacy: !this.data.literacy
    })
  },
  getWordOut (word) {
    let words = word.slice(0, 1)
    let that = this
    app.wxrequest({
      url: app.getUrl().stackingSearch,
      data: {
        word: words,
        page: ++that.data.page
      }
    }).then(res => {
      that.setData({
        outList: that.data.outList.concat(res.lists)
      })
      that.data.more = res.lists.length >= res.pre_page
    })
  },
  getShiYi (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl().distinguishWord,
      data: {
        uid: app.gs('userInfoAll').uid,
        word: that.data.list[e.currentTarget.dataset.index].words
      }
    }).then(res => {
      that.setData({
        shiYiInfo: res
      }, () => {
        that._toggleMask(e)
      })
    })
  },
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
  },
  onReachBottom () {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多内容了'
      })
    }
    this.getWordOut(this.data.list[0].words)
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
    app.checkUser({
      login: false
    })
    // app.toast()
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
    return {
      path: `commonPage/literacy/index`
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
