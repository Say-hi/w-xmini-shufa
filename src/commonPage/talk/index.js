// 获取全局应用程序实例对象
const app = getApp()
const UpLoad = require('../upLoad')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fix: app.data.fix,
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    textArr: ['非常差', '差', '一般', '好', '非常好'],
    imgArr: [],
    sos: [
      '笔画求教',
      '单字求救',
      '作品求救',
      '分享作品'
    ],
    sosIndex: 0,
    commentLV: 4
  },
  chooseSoS () {
    let that = this
    wx.showActionSheet({
      itemList: this.data.sos,
      success (res) {
        that.setData({
          sosIndex: res.tapIndex
        })
      }
    })
  },
  _chooseLv (e) {
    this.setData({
      commentLV: e.currentTarget.dataset.index
    })
  },
  upImgSingle (src) {
    new UpLoad({
      imgArr: 'imgArr'
    }).upImgSingle(src)
  },
  upload () {
    new UpLoad({
      imgArr: 'imgArr'
    }).chooseImage()
  },
  checkAll () {
    return new UpLoad({
      imgArr: 'imgArr'
    }).checkAll()
  },
  imgOp (e) {
    new UpLoad({
      imgArr: e.currentTarget.dataset.img,
      index: e.currentTarget.dataset.index
    }).imgOp()
  },
  getRealUrl () {
    let url = []
    for (let v of this.data.imgArr) {
      url.push(v.real)
    }
    return url
  },
  hundredPostsSub (e) {
    let that = this
    switch (this.data.options.type) {
      case 'hundred':
        if (!e.detail.value.title.trim()) {
          return app.toast({
            content: '标题不能为空'
          })
        } else if (!e.detail.value.comment.trim()) {
          return app.toast({
            content: '内容不能为空'
          })
        }
        if (!new UpLoad({
          imgArr: 'imgArr'
        }).checkAll()) return
        app.wxrequest({
          url: app.getUrl().hundredPostsSub,
          data: {
            uid: app.gs('userInfoAll').uid || 10000,
            title: e.detail.value.title.trim(),
            comment: e.detail.value.comment.trim(),
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          }
        }).then(res => {
          app.toast({
            content: '发布成功,等待系统审核',
            image: '',
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        })
        break
      case 'community':
        if (!e.detail.value.title.trim()) {
          return app.toast({
            content: '标题不能为空'
          })
        } else if (!e.detail.value.comment.trim()) {
          return app.toast({
            content: '内容不能为空'
          })
        }
        if (!new UpLoad({
          imgArr: 'imgArr'
        }).checkAll()) return
        app.wxrequest({
          url: app.getUrl().communityPostsSub,
          data: {
            uid: app.gs('userInfoAll').uid || 10000,
            is_video: -1,
            title: e.detail.value.title.trim(),
            comment: e.detail.value.comment.trim(),
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          }
        }).then(res => {
          app.toast({
            content: '发布成功,等待系统审核',
            image: '',
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        })
        break
      case 'camera':
        if (!e.detail.value.camear.trim()) {
          return app.toast({
            content: '内容不能为空'
          })
        }
        if (!new UpLoad({
          imgArr: 'imgArr'
        }).checkAll()) return
        app.wxrequest({
          url: app.getUrl().communityPostsSub,
          data: {
            uid: app.gs('userInfoAll').uid || 10000,
            is_video: -1,
            title: this.data.sos[this.data.sosIndex],
            comment: e.detail.value.camear.trim(),
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          }
        }).then(res => {
          app.toast({
            content: '发布成功,等待系统审核',
            image: '',
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        })
        break
      case 'comment':
        if (!e.detail.value.comment.trim()) {
          return app.toast({
            content: '评价内容不能为空'
          })
        }
        if (!new UpLoad({
          imgArr: 'imgArr'
        }).checkAll()) {
          return app.toast({
            content: '请等待图片上传完成后继续操作'
          })
        }
        app.wxrequest({
          url: app.getUrl()[this.data.info.goodsType === 'sell' ? 'sellDiscussSub' : 'shopDiscussSub'],
          data: this.data.info.goodsType === 'sell' ? {
            uid: app.gs('userInfoAll').uid || 10000,
            pid: this.data.info.id,
            out_trade_no: this.data.info.out_trade_no,
            star: this.data.commentLV * 1 + 1,
            comment: e.detail.value.comment.trim(),
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          } : {
            uid: app.gs('userInfoAll').uid || 10000,
            pid: this.data.info.id,
            sku_id: this.data.info.list[0].id,
            value: this.data.info.list[0].value || -1,
            out_trade_no: this.data.info.out_trade_no,
            star: this.data.commentLV * 1 + 1,
            comment: e.detail.value.comment.trim(),
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          }
        }).then(res => {
          app.toast({
            content: '评价成功',
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        })
        break
      case 'suggest':
        if (!e.detail.value.comment.trim()) {
          return app.toast({
            content: '内容不能为空'
          })
        } else if (!e.detail.value.phone.trim() || app.checkMobile(e.detail.value.phone)) {
          return app.toast({
            content: '需要有效的手机号码'
          })
        } else if (!new UpLoad({
          imgArr: 'imgArr'
        }).checkAll()) {
          return app.toast({
            content: '请等待图片上传完成后继续操作'
          })
        }
        app.wxrequest({
          url: app.getUrl().userFeedback,
          data: {
            uid: app.gs('userInfoAll').uid,
            content: e.detail.value.comment,
            phone: e.detail.value.phone,
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          }
        }).then(() => {
          app.toast({
            content: '反馈成功',
            image: ''
          })
        })
        break
      default:
        return app.toast({
          content: '错误！！请返回上一页重新进入'
        })
    }
  },
  getJson () {
    let that = this
    wx.request({
      url: app.getExactlyUrl(app.getUrl().toJson),
      success (res) {
        if (res.statusCode === 200) {
          that.setData({
            tojson: res.data.data.toJson
          })
        } else {} // todo cloud tojson add
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getJson()
    this.setData({
      options
    })
    if (options.type === 'comment') {
      this.setData({
        info: app.gs('pjInfo')
      })
    }
    if (options.url && options.url.length > 5) {
      this.upImgSingle(options.url)
    }
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
