// 获取全局应用程序实例对象
const app = getApp()
const UpLoad = require('../upLoad')
let start = null
let moveYT = null
let moveXT = null
let x = null
let y = null
let changeIndex = 0
// let beforeIndex = -1
let tapTime = null
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    imgArr: [
      {
        src: 'https://c.jiangwenqiang.com/lqsy/nav_0.png',
        scale: 1,
        rotate: 0
      },
      {
          src: 'https://c.jiangwenqiang.com/lqsy/list1.png',
          scale: 1,
          rotate: 0
      }
    ],
    canUseWidth: 100,
    canUseHeight: 100,
    centerX: 375 / 2,
    centerY: 150,
    borderImg: 'https://c.jiangwenqiang.com/lqsy/canvas_border.jpg'
  },
  itemStart (e) {
    if (e.touches.length < 2) tapTime = e.timeStamp
    changeIndex = e.currentTarget.dataset.index
    // beforeIndex = beforeIndex < - 1 ? this.data.imgArr[changeIndex].zIndex : beforeIndex
    // this.setData({
    //   [`imgArr[${changeIndex}].zIndex`]: 20
    // })
  },
  itemEnd (e) {
    if (e.touches.length >= 2) return
    let that = this
    if (e.timeStamp - tapTime < 100) {
      tapTime = 0
      wx.showActionSheet({
        itemList: ['替换图片', '删除图片'],
        success (res) {
          if (res.tapIndex === 0) {
            wx.chooseImage({
              count: 1,
              success (img) {
                console.log(img)
                that.data.imgArr[changeIndex].src = img.tempFilePaths[0]
                that.getItemImageInfo(changeIndex, true)
              }
            })
          } else if (res.tapIndex === 1) {
            that.data.imgArr.splice(changeIndex, 1)
            that.setData({
              imgArr: that.data.imgArr
            })
          }
        }
      })
    }
  },
  touchStart (e) {
    start = e.touches
    if (e.touches.length <= 1) {
      x = e.touches[0].pageX
      y = e.touches[0].pageY
      moveYT = this.data.imgArr[changeIndex].top
      moveXT = this.data.imgArr[changeIndex].left
    } else if (e.touches.length <= 2) {
      start = e.touches
    } else {
      app.toast({content: '囧，小主人的手指太灵活了，无法识别呢，请双指或单指操作'})
    }
  },
  touchMove (e) {
    if (e.touches.length <= 1 && start.length <= 1) {
      this.setData({
        [`imgArr[${changeIndex}].left`]: moveXT + (e.touches[0].pageX - x),
        [`imgArr[${changeIndex}].top`]: moveYT + (e.touches[0].pageY - y)
      })
    } else if (e.touches.length <= 2) {
      if (start.length < 1) start = e.touches
      let now = e.touches
      let scale = (this.getDistance(now[0], now[1]) / this.getDistance(start[0], start[1])).toFixed(1)
      let rotate = (this.getAngle(now[0], now[1]) - this.getAngle(start[0], start[1])).toFixed(1)
      this.setData({
        [`imgArr[${changeIndex}].scale`]: scale > 2 ? 2 : scale < 1 ? 1 : scale,
        [`imgArr[${changeIndex}].rotate`]: rotate
      })
    }
  },
  touchEnd () {
    // this.setData({
    //   [`imgArr[${changeIndex}].zIndex`]: beforeIndex
    // })
  },
  longpress (e) {
    let that = this
    wx.chooseImage({
      count: 1,
      success (res) {
        that.data.imgArr[e.currentTarget.dataset.index].src = res.tempFilePaths[0]
        that.getItemImageInfo(e.currentTarget.dataset.index, true)
      }
    })
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
  upload () {
    new UpLoad({imgArr: 'imgArr'}).chooseImage()
  },
  checkAll () {
    if (new UpLoad({imgArr: 'imgArr'}).checkAll()) {
    }
  },
  imgOp (e) {
    new UpLoad({imgArr: e.currentTarget.dataset.img, index: e.currentTarget.dataset.index}).imgOp()
  },
  getBackImageInfo (src) {
    let that = this
    wx.showLoading({
      title: '加载图片中'
    })
    wx.getImageInfo({
      src,
      success (res) {
        wx.hideLoading()
        that.setData({
          backImageInfo: {
            oWidth: res.width,
            oHeight: res.height,
            path: res.path,
            showWidth: app.data.system.windowWidth,
            showHeight: app.data.system.windowWidth * res.height / res.width,
            zIndex: 1
          }
        }, that.getItemImageInfo(0))
      }
    })
  },
  getItemImageInfo (index, change = false) {
    let that = this
    wx.showLoading({
      title: '加载图片中'
    })
    wx.getImageInfo({
      src: that.data.imgArr[index].src,
      success (res) {
        wx.hideLoading()
        that.setData({
          [`imgArr[${index}].oWidth`]: res.width,
          [`imgArr[${index}].oHeight`]: res.height,
          [`imgArr[${index}].showWidth`]: res.width > that.data.canUseWidth ? that.data.canUseWidth : that.data.backImageInfo.showWidth ? res.width : that.data.backImageInfo.showWidth,
          [`imgArr[${index}].showHeight`]: res.width > that.data.canUseWidth ? that.data.canUseWidth * res.height / res.width : that.data.backImageInfo.showWidth ? res.height : that.data.backImageInfo.showWidth * res.height / res.width,
          [`imgArr[${index}].path`]: res.path,
          [`imgArr[${index}].left`]: that.data.imgArr[index].left ? that.data.imgArr[index].left : that.data.centerX - (res.width > that.data.canUseWidth ? that.data.canUseWidth : that.data.backImageInfo.showWidth ? res.width : that.data.backImageInfo.showWidth) / 2,
          [`imgArr[${index}].top`]: that.data.imgArr[index].top ? that.data.imgArr[index].top : that.data.centerY - (res.width > that.data.canUseWidth ? that.data.canUseWidth * res.height / res.width : that.data.backImageInfo.showWidth ? res.height : that.data.backImageInfo.showWidth * res.height / res.width) / 2,
          [`imgArr[${index}].zIndex`]: index + 1
        }, () => {
          change ? '' : index >= that.data.imgArr.length - 1 ? '' : that.getItemImageInfo(index + 1)
        })
      }
    })
  },
  // canvas 绘图
  canvasDrawUp () {
    let ctx = wx.createCanvasContext('outPic', this)
    let that = this
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, that.data.backImageInfo.showWidth, that.data.backImageInfo.showHeight)
    for (let v of that.data.imgArr) {
      ctx.save()
      ctx.translate(v.left + v.showWidth / 2, v.top + v.showHeight / 2)
      ctx.rotate(v.rotate * Math.PI / 180)
      ctx.drawImage(v.path, -(v.showWidth * v.scale) / 2, -(v.showHeight * v.scale) / 2, v.showWidth * v.scale, v.showHeight * v.scale)
      ctx.restore()
    }
    ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.showWidth, that.data.backImageInfo.showHeight)
    ctx.draw()
    setTimeout(() => {
      this.outImage()
    }, 300)
  },
  canvasDrawDown () {
    let ctx = wx.createCanvasContext('outPic', this)
    let that = this
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, that.data.backImageInfo.showWidth, that.data.backImageInfo.showHeight)
    ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.showWidth, that.data.backImageInfo.showHeight)
    for (let v of that.data.imgArr) {
      ctx.save()
      ctx.translate(v.left + v.showWidth / 2, v.top + v.showHeight / 2)
      ctx.rotate(v.rotate * Math.PI / 180)
      ctx.drawImage(v.path, -(v.showWidth * v.scale) / 2, -(v.showHeight * v.scale) / 2, v.showWidth * v.scale, v.showHeight * v.scale)
      ctx.restore()
    }
    ctx.draw()
    setTimeout(() => {
      this.outImage()
    }, 300)
  },
  canvasDraw () {
    wx.showLoading({
      title: '疯狂生成中',
      mask: true
    })
    let ctx = wx.createCanvasContext('outPic', this)
    let that = this
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, that.data.backImageInfo.showWidth * 2, that.data.backImageInfo.showHeight * 2)
    if (that.data.backImageInfo.zIndex <= 1) {
      ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.showWidth * 2, that.data.backImageInfo.showHeight * 2)
    }
    for (let v of that.data.imgArr) {
      ctx.save()
      ctx.translate(v.left * 2 + v.showWidth, v.top * 2 + v.showHeight)
      ctx.rotate(v.rotate * Math.PI / 180)
      ctx.drawImage(v.path, -(v.showWidth * v.scale), -(v.showHeight * v.scale), v.showWidth * v.scale * 2, v.showHeight * v.scale * 2)
      if (v.border) {
          // 左上角
          ctx.translate(-v.showWidth * v.scale, -v.showHeight * v.scale)
          ctx.rotate(45 * Math.PI / 180)
          ctx.drawImage(v.border.path, -(v.border.width * v.scale), -(v.border.width * v.scale), v.border.width * v.scale * 2, v.border.width * v.scale * 2)
          ctx.rotate(-45 * Math.PI / 180)
          ctx.translate(v.showWidth * 2 * v.scale, 0)
          ctx.rotate(135 * Math.PI / 180)
          ctx.drawImage(v.border.path, -(v.border.width * v.scale), -(v.border.width * v.scale), v.border.width * v.scale * 2, v.border.width * v.scale * 2)
          ctx.rotate(-135 * Math.PI / 180)
          ctx.translate(0, v.showHeight * 2 * v.scale)
          ctx.rotate(225 * Math.PI / 180)
          ctx.drawImage(v.border.path, -(v.border.width * v.scale), -(v.border.width * v.scale), v.border.width * v.scale * 2, v.border.width * v.scale * 2)
          ctx.rotate(-225 * Math.PI / 180)
          ctx.translate(-v.showWidth * 2 * v.scale, 0)
          ctx.rotate(315 * Math.PI / 180)
          ctx.drawImage(v.border.path, -(v.border.width * v.scale), -(v.border.width * v.scale), v.border.width * v.scale * 2, v.border.width * v.scale * 2)
      }
      ctx.restore()
    }

    if (that.data.backImageInfo.zIndex >= 10) {
      ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.showWidth * 2, that.data.backImageInfo.showHeight * 2)
    }
    ctx.draw()
    setTimeout(() => {
      this.outImageDouble()
    }, 300)
  },

  outImage () {
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.backImageInfo.showWidth,
      height: that.data.backImageInfo.showHeight,
      destWidth: that.data.backImageInfo.showWidth,
      destHeight: that.data.backImageInfo.showHeight,
      canvasId: 'outPic',
      success: res => {
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          that.setData({
            showImgSrc: res.tempFilePath
          })
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success () {
              wx.showToast({
                title: '保存成功'
              })
            },
            fail () {
              // app.setToast(that, {content: '请授权相册保存'})
              // that.setData({
              //   buttonShow: true
              // })
            }
          })
        }
      }
    })
  },
  outImageDouble () {
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.backImageInfo.showWidth * 2,
      height: that.data.backImageInfo.showHeight * 2,
      destWidth: that.data.backImageInfo.showWidth * 2,
      destHeight: that.data.backImageInfo.showHeight * 2,
      canvasId: 'outPic',
      success: res => {
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          that.setData({
            showImgSrc: res.tempFilePath
          })
          wx.hideLoading()
          // wx.saveImageToPhotosAlbum({
          //   filePath: res.tempFilePath,
          //   success () {
          //     wx.showToast({
          //       title: '图片已存入相册'
          //     })
          //   },
          //   fail () {
          //     // app.setToast(that, {content: '请授权相册保存'})
          //     // that.setData({
          //     //   buttonShow: true
          //     // })
          //   }
          // })
        }
      }
    })
  },
  previeImg () {
    app.showImg(this.data.showImgSrc, [this.data.showImgSrc])
  },
  setBorder () {
    let that = this
    wx.showLoading({
      title: '加载边框中',
      mask: true
    })
    wx.getImageInfo({
      src: that.data.borderImg,
      success (res) {
        wx.hideLoading()
        that.setData({
          [`imgArr[${changeIndex}].border`]: {
            width: res.width > that.data.imgArr[changeIndex].showWidth / 4 ? that.data.imgArr[changeIndex].showWidth / 4 : res.width,
            path: res.path
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getBackImageInfo('https://c.jiangwenqiang.com/lqsy/canvas_bottom_2.jpg')
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