// 获取全局应用程序实例对象
// 创建页面实例对象
const app = getApp()
const maxSize = app.data.system.windowWidth - 40 // left & right give gap 20
let chooseArea = {}
let x = null
let y = null
let start = null
let moveYT = null
let moveXT = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    cjIndex: 2,
    cjArr: [{
      t: '1:1',
      w: 750,
      h: 750
    },
    {
      t: '3:4',
      w: 540,
      h: 720
    },
    {
      t: '原始比例',
      w: 0,
      h: 0
    },
    {
      t: '3:2',
      w: 750,
      h: 500
    },
    {
      t: '16:9',
      w: 750,
      h: 422
    }
    ],
    bottomOpD: 'cj',
    single: 'single',
    options: null
  },
  setcj (e) {
    this.setData({
      cjIndex: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index * 1 === 2) {
      return this.getImageInfo(this.data.img.path)
    }
    let cutOx = (maxSize + 40) / 2
    let cutOy = this.data.img.cutY + this.data.img.cutH / 2
    let cutcW = this.data.cjArr[this.data.cjIndex].w / 750 * maxSize
    let cutcH = this.data.cjArr[this.data.cjIndex].h / 750 * maxSize
    this.setData({
      'img.cutW': cutcW,
      'img.cutH': cutcH,
      'img.cutX': Math.abs(cutOx - cutcW / 2),
      'img.cutY': cutOy - cutcH / 2 > 0 ? cutOy - cutcH / 2 : 0
    })
  },
  chooseAreaStart (e) {
    this.setData({
      cutAreaMove: true
    })
    chooseArea.x = e.touches[0].pageX
    chooseArea.y = e.touches[0].pageY
    chooseArea.xx = this.data.img.cutX
    chooseArea.yy = this.data.img.cutY
    chooseArea.w = this.data.img.cutW
    chooseArea.h = this.data.img.cutH
    // x = e.touches[0].pageX
    // y = e.touches[0].pageY
    // moveYT = this.data.img.y
    // moveXT = this.data.img.x
  },
  chooseAreaMove (e) {
    if (e.currentTarget.dataset.type === 'img') {
      this.setData({
        [`img.cutX`]: chooseArea.xx + (e.touches[0].pageX - chooseArea.x),
        [`img.cutY`]: chooseArea.yy + (e.touches[0].pageY - chooseArea.y)
      })
      // this.setData({
      //   [`img.x`]: moveXT + (e.touches[0].pageX - x),
      //   [`img.y`]: moveYT + (e.touches[0].pageY - y)
      // })
    } else if (e.currentTarget.dataset.type === 'point') {
      let width = chooseArea.w + (e.touches[0].pageX - chooseArea.x)
      let height = chooseArea.h + (e.touches[0].pageY - chooseArea.y)
      let cutX = chooseArea.xx + (e.touches[0].pageX - chooseArea.x)
      let cutY = chooseArea.yy + (e.touches[0].pageY - chooseArea.y)
      if (e.currentTarget.dataset.scroll === 'xy') {
        if (chooseArea.h - (e.touches[0].pageY - chooseArea.y) < 80 || chooseArea.w - (e.touches[0].pageX - chooseArea.x) < 80) return
        this.setData({
          [`img.cutX`]: cutX,
          [`img.cutY`]: cutY,
          [`img.cutH`]: chooseArea.h - (e.touches[0].pageY - chooseArea.y),
          [`img.cutW`]: chooseArea.w - (e.touches[0].pageX - chooseArea.x)
        })
      } else if (e.currentTarget.dataset.scroll === 'y') {
        if (chooseArea.h - (e.touches[0].pageY - chooseArea.y) < 80 || width < 80) return
        this.setData({
          [`img.cutY`]: cutY,
          [`img.cutH`]: chooseArea.h - (e.touches[0].pageY - chooseArea.y),
          [`img.cutW`]: width
        })
        height = chooseArea.h - (e.touches[0].pageY - chooseArea.y)
      } else if (e.currentTarget.dataset.scroll === 'x') {
        if (height < 80 || chooseArea.w - (e.touches[0].pageX - chooseArea.x) < 80) return
        this.setData({
          [`img.cutX`]: cutX,
          [`img.cutH`]: height,
          [`img.cutW`]: chooseArea.w - (e.touches[0].pageX - chooseArea.x)
        })
      } else {
        if (height < 80 || width < 80) return
        this.setData({
          [`img.cutH`]: height,
          [`img.cutW`]: width
        })
      }
    }
  },
  chooseAreaEnd () {
    this.setData({
      cutAreaMove: false
    })
  },
  getImageInfo (src) {
    let that = this
    this.setData({
      time: 0.5
    })
    wx.getImageInfo({
      src,
      success (res) {
        wx.hideLoading()
        let {
          width,
          height
        } = res
        let useWidth = width >= height
        let img = {
          path: res.path,
          y: 20,
          width: useWidth ? maxSize : maxSize * res.width / res.height,
          height: !useWidth ? maxSize : maxSize * res.height / res.width
        }
        img.scale = 1
        img.rotate = 0
        img.x = img.width < maxSize ? 20 + (maxSize - img.width) / 2 : 20
        img.y = img.height < maxSize ? 20 + (maxSize - img.height) / 2 : 20
        img.cutX = img.x - 2
        img.cutY = img.y - 2
        img.cutW = img.width + 4
        img.cutH = img.height + 4
        img.cutOW = img.width + 4
        img.cutOH = img.height + 4
        that.setData({
          img
        }, () => {
          setTimeout(() => {
            that.setData({
              time: 0
            })
          }, 600)
        })
      }
    })
  },
  sliderChange (e) {
    this.setData({
      'img.scale': e.detail.value
    })
  },
  changeRotate (e) {
    this.setData({
      'img.rotate': e.detail.value
    })
  },
  go (e) {
    if (e.currentTarget.dataset.type === 'back') wx.navigateBack()
    else if (e.currentTarget.dataset.type === 'init') {
      this.getImageInfo(this.data.img.path)
    } else {
      this.canvasDraw()
    }
  },
  touchStart (e) {
    // console.log(1)
    start = e.touches
    if (e.touches.length <= 1) {
      x = e.touches[0].pageX
      y = e.touches[0].pageY
      moveYT = this.data.img.y
      moveXT = this.data.img.x
    } else {
      app.toast({
        // content: '囧，小主人的手指太灵活了，无法识别呢，请双指或单指操作'
        content: '囧，小主人的手指太灵活了，无法识别呢，请单指操作'
      })
    }
    // else if (e.touches.length <= 2) {
    //   start = e.touches
    // }
  },
  touchMove (e) {
    // console.log(2)
    if (e.touches.length <= 1 && start.length <= 1) {
      // console.log(`3-single`)
      this.setData({
        [`img.x`]: moveXT + (e.touches[0].pageX - x),
        [`img.y`]: moveYT + (e.touches[0].pageY - y)
      })
    }
    //  else if (e.touches.length <= 2) {
    //   if (start.length < 1) start = e.touches
    //   let now = e.touches
    //   let scale = (this.getDistance(now[0], now[1]) / this.getDistance(start[0], start[1])).toFixed(1)
    //   let rotate = (this.getAngle(now[0], now[1]) - this.getAngle(start[0], start[1])).toFixed(1)
    //   // console.log(`3-more`)
    //   this.setData({
    //     [`img.scale`]: scale > 2 ? 2 : scale < 1 ? 1 : scale,
    //     [`img.rotate`]: rotate
    //   })
    // }
  },
  touchEnd () {
    // this.setData({
    //   [`imgArr[${changeIndex}].zIndex`]: beforeIndex
    // })
  },
  bottomOp (e) {
    switch (e.currentTarget.dataset.op) {
      case 'back':
        wx.navigateBack()
        break
      case 'confirm':
        this.canvasDraw()
        break
      default:
        this.setData({
          'bottomOpD': e.currentTarget.dataset.op
        })
        break
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
  canvasDraw () {
    wx.showLoading({
      title: '获取所需区域中',
      mask: true
    })
    let ctx = wx.createCanvasContext('outPic', this)
    // let that = this
    let img = this.data.img
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, maxSize * 2, img.height * 2)
    ctx.save()
    ctx.translate(img.x * 2 + img.width, img.y * 2 + img.height)
    ctx.rotate(img.rotate * Math.PI / 180)
    ctx.drawImage(img.path, -(img.width * img.scale), -(img.height * img.scale), img.width * img.scale * 2, img.height * img.scale * 2)
    ctx.restore()
    ctx.draw()
    setTimeout(() => {
      this.outImageDouble()
    }, 300)
  },
  outImageDouble () {
    // let that = this
    let img = this.data.img
    wx.canvasToTempFilePath({
      x: (img.cutX + 2) * 2,
      y: (img.cutY + 2) * 2,
      width: (img.cutW - 4) * 2,
      height: (img.cutH - 4) * 2,
      destWidth: (img.cutW - 4) * 2,
      destHeight: (img.cutH - 4) * 2,
      canvasId: 'outPic',
      success: res => {
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          app.data['userUseImg'] = res.tempFilePath
          wx.hideLoading()
          if (this.data.single === 'single') {
            wx.navigateTo({
              url: '/commonPage/canvas2/step_three/index?single=single'
            })
          } else if (this.data.single === 'literacy') {
            wx.redirectTo({
              url: '/commonPage/literacyShow/index'
            })
          } else if (this.data.single === 'compare') {
            wx.redirectTo({
              url: '/commonPage/camera_two/index'
            })
          } else {
            let index = this.data.options.index
            let _this = getCurrentPages()[getCurrentPages().length - 2]
            _this.setData({
              [`upImgArr[${index}].src`]: res.tempFilePath
            }, () => {
              _this.getItemImageInfo(index)
              wx.navigateBack({})
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    wx.showLoading({
      title: '加载图片中',
      mask: true
    })
    let that = this

    // that.data.single = options.single
    // that.data.options = options
    // that.getImageInfo(app.data.chooseImage)

    app.cloud().getImgCheck(app.data.chooseImage).then(() => {
      that.data.single = options.single
      that.data.options = options
      that.getImageInfo(app.data.chooseImage)
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
