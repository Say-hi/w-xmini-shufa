// 获取全局应用程序实例对象
const app = getApp()
const UpLoad = require('../upLoad')
let x = null
let y = null
// let xx = null
// let yy = null
let moveYT = null
let moveXT = null
// let canvas = null
let start = null
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    bottomImg: [{
      i: '',
      t: '无'
    },
    {
      i: 'https://c.jiangwenqiang.com/lqsy/camera_mi.png',
      t: '米字格'
    },
    {
      i: 'https://c.jiangwenqiang.com/lqsy/camera_hui.png',
      t: '回字格'
    },
    {
      i: 'https://c.jiangwenqiang.com/lqsy/camera_jiu.png',
      t: '九宫格'
    }
    ],
    painting: {},
    bottomIndex: 0,
    rotate: 0,
    scale: 1,
    moveX: 166,
    moveY: 166,
    height: app.data.height,
    main: app.gs('alphaImg'),
    bgImg: app.gs('alphaImg2'),
    cameraType: [{
      i: 'jwqshequ',
      t: '社区'
    },
    {
      i: 'jwqweixin',
      t: '微信好友'
    },
    {
      i: 'jwqpengyouquan',
      t: '朋友圈'
    }
    ]
  },
  touchStart (e) {
    start = e.touches
    if (e.touches.length <= 1) {
      x = e.touches[0].pageX
      y = e.touches[0].pageY
      moveYT = this.data.moveY
      moveXT = this.data.moveX
    } else if (e.touches.length <= 2) {
      start = e.touches
    } else {
      app.toast({
        content: '囧，小主人的手指太灵活了，无法识别呢，请双指或单指操作'
      })
    }
  },
  touchMove (e) {
    if (e.touches.length <= 1 && start.length <= 1) {
      this.setData({
        moveX: moveXT + (e.touches[0].pageX - x) * app.data.fixPxToRpx,
        moveY: moveYT + (e.touches[0].pageY - y) * app.data.fixPxToRpx
      })
    } else if (e.touches.length <= 2) {
      if (start.length < 1) start = e.touches
      let now = e.touches
      let scale = (this.getDistance(now[0], now[1]) / this.getDistance(start[0], start[1])).toFixed(1)
      let rotate = (this.getAngle(now[0], now[1]) - this.getAngle(start[0], start[1])).toFixed(1)
      this.setData({
        scale: scale > 2 ? 2 : scale < 1 ? 1 : scale,
        rotate
      })
    }
  },
  getDistance (p1, p2) {
    let x = p2.pageX - p1.pageX
    let y = p2.pageY - p1.pageY
    return Math.sqrt((x * x) + (y * y))
  },
  getAngle (p1, p2) {
    let x = p1.pageX - p2.pageX
    let y = p1.pageY - p2.pageY
    return Math.atan2(y, x) * 180 / Math.PI
  },
  changeSlider (e) {
    this.setData({
      scale: e.detail.value / 100
    })
  },
  chooseType (e) {
    this.setData({
      bottomIndex: e.currentTarget.dataset.index
    })
  },
  _chooseLv (e) {
    this.setData({
      commentLV: e.currentTarget.dataset.index
    })
  },
  upload () {
    new UpLoad({
      imgArr: 'imgArr'
    }).chooseImage()
  },
  checkAll () {
    if (new UpLoad({
      imgArr: 'imgArr'
    }).checkAll()) {}
  },
  imgOp (e) {
    new UpLoad({
      imgArr: e.currentTarget.dataset.img,
      index: e.currentTarget.dataset.index
    }).imgOp()
  },
  choosePhoto () {
    if (this.data.options.type > 1) {
      let that = this
      if (!app.gs('firstCamera')) {
        app.toast({
          content: '建议您选取图片后通过【预览】--【编辑】将图片裁剪为【正方形】以体验更佳的对比效果',
          image: '',
          time: 5000,
          mask: true
        })
      }
      setTimeout(() => {
        app.su('firstCamera', true)
        wx.chooseImage({
          count: 1,
          sourceType: [that.data.options.type < 3 ? 'album' : 'camera'],
          success (res1) {
            app.toast({
              content: '图片上传处理中',
              mask: true,
              time: 99999
            })
            app.cloud().getImgCheck(res1.tempFilePaths[0]).then(() => {
              wx.uploadFile({
                url: app.getExactlyUrl(app.getUrl().stackingImg),
                filePath: res1.tempFilePaths[0],
                name: 'file',
                formData: {
                  uid: app.gs('userInfoAll').uid,
                  file: res1.tempFilePaths[0]
                },
                success (res) {
                  wx.hideLoading()
                  app.toast({
                    content: '',
                    image: '',
                    time: 20
                  })
                  // let data = JSON.parse(res.data).data
                  wx.getImageInfo({
                    src: JSON.parse(res.data).data,
                    success (res2) {
                      that.data.imageWidth = 165.5
                      that.data.imageHeight = 165.5 * res2.height / res2.width
                    }
                  })
                  that.setData({
                    main: JSON.parse(res.data).data
                  })
                }
              })
            }, () => {
              wx.hideLoading()
              app.toast({
                content: '为了营造绿色的网络环境，检测发现您的图片存在违规内容，请更换图片',
                mask: true
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 2000)
            })
          },
          fail () {
            app.toast({
              content: '您取消了操作~~'
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          }
        })
      }, app.gs('firstCamera') ? 100 : 5000)
    }
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
  // getImageInfo (src, flag) {
  //   let that = this
  //   wx.getImageInfo({
  //     src,
  //     success (res) {
  //       if (flag) {
  //         that.setData({
  //           chooseImageInfo: res
  //         })
  //       } else {
  //         that.setData({
  //           backImageInfo: res,
  //           systemWidth: app.data.system.windowWidth,
  //           backImageHeight: app.data.system.windowWidth * res.height / res.width
  //         })
  //         that.getImageInfo('https://c.jiangwenqiang.com/lqsy/list1.png', true)
  //       }
  //     }
  //   })
  // },
  // canvasDraw () {
  //   let ctx = wx.createCanvasContext('cOne', this)
  //   let that = this
  //   ctx.setFillStyle('white')
  //   ctx.fillRect(0, 0, that.data.systemWidth, that.data.backImageHeight)
  //   // let chooseWidth = that.data.chooseImageInfo.width
  //   // let chooseHeight = that.data.chooseImageInfo.height
  //   // let scale = that.data.scale
  //
  //
  //   // if (that.data.rotate != 0) {
  //   //   ctx.translate(that.data.moveX + that.data.chooseImageInfo.width / 2, that.data.moveY + that.data.chooseImageInfo.height / 2)
  //   //   ctx.rotate(that.data.rotate * Math.PI / 180)
  //   //   ctx.drawImage(that.data.chooseImageInfo.path, that.data.moveX - ((that.data.chooseImageInfo.width * that.data.scale - that.data.chooseImageInfo.width) / 2) - that.data.systemWidth / 2, that.data.moveY - ((that.data.chooseImageInfo.height * that.data.scale - that.data.chooseImageInfo.height) / 2) - that.data.backImageHeight / 2, that.data.chooseImageInfo.width * that.data.scale, that.data.chooseImageInfo.height * that.data.scale)
  //   // } else {
  //   //   ctx.drawImage(that.data.chooseImageInfo.path, that.data.moveX - ((that.data.chooseImageInfo.width * that.data.scale - that.data.chooseImageInfo.width) / 2), that.data.moveY - ((that.data.chooseImageInfo.height * that.data.scale - that.data.chooseImageInfo.height) / 2), that.data.chooseImageInfo.width * that.data.scale, that.data.chooseImageInfo.height * that.data.scale)
  //   // }
  //   // if (that.data.rotate != 0) {
  //   //   ctx.rotate((360 - that.data.rotate) * Math.PI / 180)
  //   //   ctx.translate(-that.data.moveX + that.data.chooseImageInfo.width / 2, -that.data.moveY + that.data.chooseImageInfo.height / 2)
  //   //   ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.systemWidth, that.data.backImageHeight)
  //   // } else {
  //   //   ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.systemWidth, that.data.backImageHeight)
  //   // }
  //   ctx.draw()
  //   setTimeout(() => {
  //     wx.canvasToTempFilePath({
  //       x: 0,
  //       y: 0,
  //       width: that.data.systemWidth,
  //       height: that.data.backImageHeight,
  //       destWidth: that.data.systemWidth,
  //       destHeight: that.data.backImageHeight,
  //       canvasId: 'cOne',
  //       success: res => {
  //         if (res.errMsg === 'canvasToTempFilePath:ok') {
  //           that.setData({
  //             temp: res.tempFilePath
  //           })
  //           // wx.saveImageToPhotosAlbum({
  //           //   filePath: res.tempFilePath,
  //           //   success () {
  //           //     wx.showToast({
  //           //       title: '保存成功'
  //           //     })
  //           //   },
  //           //   fail () {
  //           //     // app.setToast(that, {content: '请授权相册保存'})
  //           //     // that.setData({
  //           //     //   buttonShow: true
  //           //     // })
  //           //   }
  //           // })
  //         }
  //       }
  //     }, this)
  //   }, 100)
  // },
  eventDraw (e) {
    wx.showLoading({
      title: '图片生成中',
      mask: true
    })
    let views = this.data.options.type < 2 ? [{
      type: 'image',
      url: this.data.main,
      top: 0,
      left: 0,
      width: 331,
      height: 331
    }] : [{
      type: 'image',
      url: this.data.bgImg,
      top: 0,
      left: 0,
      width: 331,
      height: 331
    },
    {
      type: 'image',
      url: this.data.main,
      top: this.data.moveY / app.data.fixPxToRpx,
      left: this.data.moveX / app.data.fixPxToRpx,
      width: this.data.imageWidth,
      height: this.data.imageHeight.toFixed(2) * 1
    }
    ]
    if (this.data.bottomIndex > 0) {
      views.push({
        type: 'image',
        url: this.data.bottomImg[this.data.bottomIndex].i,
        top: 0,
        left: 0,
        width: 331,
        height: 331
      })
    }
    this.setData({
      painting: {
        width: 331,
        height: 331,
        clear: true,
        views
      }
    })
    this._toggleMask(e)
  },
  eventGetImage (event) {
    // console.log(1)
    wx.hideLoading()
    const {
      tempFilePath
    } = event.detail
    this.setData({
      SteleShareImage: tempFilePath
    })
    // app.data['SteleShareImage'] = tempFilePath
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // this.getImageInfo('https://c.jiangwenqiang.com/lqsy/canvas_bottom.jpg')
    this.setData({
      options,
      bgImg: app.gs('alphaImg2'),
      main: app.gs('alphaImg')
    }, this.choosePhoto)
    // if (options.type > 1) {
    //   canvas = wx.createCanvasContext('cOne')
    // }
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
  onShareAppMessage (e) {
    if (e.from === 'button') {
      let temps = app.gs('shareUrl')
      let url = 'camera/detail/index'
      for (let i in temps) {
        if (temps[i].indexOf(url) >= 0) {
          return {
            title: `我正在学习【${this.data.options.word}】字`,
            imageUrl: this.data.SteleShareImage,
            path: `/openShare/index/index?url=${i}&q=${this.data.options.wid},${this.data.options.oid},${app.gs('userInfoAll').uid}`
          }
        }
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
