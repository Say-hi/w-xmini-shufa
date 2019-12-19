// 获取全局应用程序实例对象
const app = getApp()
const UpLoad = require('../upLoad')
let start = null
let moveYT = null
let moveXT = null
let x = null
let y = null
let changeIndex = 0
let canChoose = true
// let beforeIndex = -1
let tapTime = null
let chooseArea = {}
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
      }
    ],
    canUseWidth: 100,
    canUseHeight: 100,
    positionLeft: 250,
    positionTop: 150,
    positionLeftShow: 0,
    positionTopShow: 0,
    borderImg: 'https://c.jiangwenqiang.com/lqsy/canvas_border.jpg',
    tabArr: [
      {
        src: 'https://c.jiangwenqiang.com/lqsy/canvas_bottom_0.jpg',
        oX: 750 / 2 - 100,
        oY: 750 / 2 - 175,
        oW: 200,
        oH: 250
      },
      {
        src: 'https://c.jiangwenqiang.com/lqsy/canvas_bottom_0.jpg',
        oX: 150,
        oY: 100,
        oW: 200,
        oH: 200
      },
      {
        src: 'https://c.jiangwenqiang.com/lqsy/canvas_bottom_0.jpg',
        oX: 232.441,
        oY: 93.543,
        oW: 283,
        oH: 198
      },
      {
        src: 'https://c.jiangwenqiang.com/lqsy/canvas_bottom_0.jpg',
        oX: 200,
        oY: 200,
        oW: 200,
        oH: 200
      }
    ],
    tabIndex: null,
    tabBorderArr: [
      '关注',
      '推荐',
      '热议',
      '视频',
      '关注',
      '推荐',
      '热议',
      '视频'
    ],
    tabBorderIndex: -1,
    chooseAreaInfo: {
      path: 'https://c.jiangwenqiang.com/api/logo.jpg',
      x: 0,
      y: 0,
      w: 100,
      h: 100,
      imgW: 375,
      imgH: 375
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
  chooseIndex (e) {
    if (!canChoose) return
    if (e.currentTarget.dataset.type === 'bgc') {
      if (this.data.tabIndex === e.currentTarget.dataset.index) return
      canChoose = false
      this.setData(
        {
          tabIndex: e.currentTarget.dataset.index
          // tabId: e.currentTarget.dataset.index
        },
        () => {
          this.getBackImageInfo(
            `https://c.jiangwenqiang.com/lqsy/canvas_bottom_${e.currentTarget.dataset.index}.jpg`
          )
        }
      )
    } else {
      canChoose = false
      this.setData(
        {
          tabBorderIndex: e.currentTarget.dataset.index
        },
        () => {
          this.setBorder()
        }
      )
    }
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
        itemList:
          that.data.imgArr.length >= 2
            ? [
              '替换图片',
              '垂直放置',
              '水平放置',
              '复位',
              '裁切图片',
              '删除图片'
            ]
            : ['替换图片', '垂直放置', '水平放置', '复位', '裁切图片'],
        success (res) {
          if (res.tapIndex === 0) {
            wx.chooseImage({
              count: 1,
              success (img) {
                that.fixImg(img.tempFilePaths[0])
              }
            })
          } else if (res.tapIndex === 5) {
            that.data.imgArr.splice(changeIndex, 1)
            that.setData({
              imgArr: that.data.imgArr
            })
          } else if (res.tapIndex === 2) {
            that.setData({
              reload: true
            })
            that.setData(
              {
                [`imgArr[${changeIndex}].rotate`]: 0
              },
              () => {
                setTimeout(() => {
                  that.setData({
                    reload: false
                  })
                }, 530)
              }
            )
          } else if (res.tapIndex === 1) {
            that.setData({
              reload: true
            })
            that.setData(
              {
                [`imgArr[${changeIndex}].rotate`]: 90
              },
              () => {
                setTimeout(() => {
                  that.setData({
                    reload: false
                  })
                }, 530)
              }
            )
          } else if (res.tapIndex === 3) {
            that.setData({
              reload: true
            })
            that.setData(
              {
                [`imgArr[${changeIndex}].rotate`]: 0,
                [`imgArr[${changeIndex}].scale`]: 1,
                [`imgArr[${changeIndex}].left`]: that.data.backImageInfo.sX,
                [`imgArr[${changeIndex}].top`]: that.data.backImageInfo.sY
              },
              () => {
                setTimeout(() => {
                  that.setData({
                    reload: false
                  })
                }, 530)
              }
            )
          } else if (res.tapIndex === 4) {
            that.fixImg(that.data.imgArr[changeIndex].path)
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
      app.toast({
        content: '囧，小主人的手指太灵活了，无法识别呢，请双指或单指操作'
      })
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
      let scale = (
        this.getDistance(now[0], now[1]) / this.getDistance(start[0], start[1])
      ).toFixed(1)
      let rotate = (
        this.getAngle(now[0], now[1]) - this.getAngle(start[0], start[1])
      ).toFixed(1)
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
        that.data.imgArr[e.currentTarget.dataset.index].src =
          res.tempFilePaths[0]
        that.getItemImageInfo(e.currentTarget.dataset.index, true)
      }
    })
  },
  getDistance (p1, p2) {
    let x = p2.pageX - p1.pageX
    let y = p2.pageY - p1.pageY
    return Math.sqrt(x * x + y * y)
  },
  getAngle (p1, p2) {
    let x = p1.pageX - p2.pageX
    let y = p1.pageY - p2.pageY
    return (Math.atan2(y, x) * 180) / Math.PI
  },
  upload () {
    new UpLoad({ imgArr: 'imgArr' }).chooseImage()
  },
  checkAll () {
    if (new UpLoad({ imgArr: 'imgArr' }).checkAll()) {
    }
  },
  imgOp (e) {
    new UpLoad({
      imgArr: e.currentTarget.dataset.img,
      index: e.currentTarget.dataset.index
    }).imgOp()
  },
  getBackImageInfo (src) {
    let that = this
    wx.showLoading({
      title: '加载底图中',
      mask: true
    })
    let storage = app.gs('canvasImgArr') || []
    if (storage.length) {
      for (let v of storage) {
        if (src === v.src) {
          for (let [i] of that.data.imgArr.entries()) {
            that.setData({
              [`imgArr[${i}].left`]: v.backImageInfo.sX,
              [`imgArr[${i}].top`]: v.backImageInfo.sY
            })
          }
          that.setData(
            {
              backImageInfo: v.backImageInfo
            },
            that.getItemImageInfo(0)
          )
          return
        }
      }
    }
    wx.getImageInfo({
      src,
      success (res) {
        wx.hideLoading()
        let backImageInfo = {
          oWidth: res.width,
          oHeight: res.height,
          path: res.path,
          showWidth: app.data.system.windowWidth,
          showHeight: (app.data.system.windowWidth * res.height) / res.width,
          zIndex: 1,
          sX:
            (app.data.system.windowWidth *
              that.data.tabArr[that.data.tabIndex].oX) /
            res.width,
          sY:
            (((app.data.system.windowWidth * res.height) / res.width) *
              that.data.tabArr[that.data.tabIndex].oY) /
            res.height,
          imgWidth:
            (app.data.system.windowWidth *
              that.data.tabArr[that.data.tabIndex].oW) /
            res.width,
          imgHeight:
            (that.data.tabArr[that.data.tabIndex].oH /
              that.data.tabArr[that.data.tabIndex].oW) *
            ((app.data.system.windowWidth *
              that.data.tabArr[that.data.tabIndex].oW) /
              res.width)
        }
        storage.push({ src, backImageInfo })
        for (let [i] of that.data.imgArr.entries()) {
          that.setData({
            [`imgArr[${i}].left`]: backImageInfo.sX,
            [`imgArr[${i}].top`]: backImageInfo.sY
          })
        }
        that.setData(
          {
            backImageInfo
          },
          that.getItemImageInfo(0)
        )
        app.su('canvasImgArr', storage)
      }
    })
  },
  getItemImageInfo (index, change = false) {
    let that = this
    wx.showLoading({
      title: '加载图片中',
      mask: true
    })
    wx.getImageInfo({
      src: that.data.imgArr[index].src,
      success (res) {
        wx.hideLoading()
        that.setData(
          {
            cutImg: false,
            [`imgArr[${index}].oWidth`]: res.width,
            [`imgArr[${index}].oHeight`]: res.height,
            [`imgArr[${index}].showWidth`]: that.data.backImageInfo.imgWidth,
            [`imgArr[${index}].showHeight`]: that.data.backImageInfo.imgHeight,
            [`imgArr[${index}].path`]: res.path,
            [`imgArr[${index}].left`]: that.data.imgArr[index].left
              ? that.data.imgArr[index].left
              : that.data.backImageInfo.sX,
            [`imgArr[${index}].top`]: that.data.imgArr[index].top
              ? that.data.imgArr[index].top
              : that.data.backImageInfo.sY,
            [`imgArr[${index}].zIndex`]: index + 1,
            [`imgArr[${index}].rotate`]: 0
          },
          () => {
            canChoose = true
            change
              ? ''
              : index >= that.data.imgArr.length - 1
              ? ''
              : that.getItemImageInfo(index + 1)
          }
        )
      }
    })
  },
  fixImg (src) {
    let that = this
    wx.showLoading({
      title: '获取图片信息'
    })
    wx.getImageInfo({
      src,
      success (res) {
        wx.hideLoading()
        that.setData({
          chooseAreaInfo: {
            path: res.path,
            x: that.data.backImageInfo.sX,
            y: that.data.backImageInfo.sY,
            w: that.data.backImageInfo.imgWidth,
            h: that.data.backImageInfo.imgHeight,
            imgW: that.data.backImageInfo.showWidth,
            imgH: (res.height * that.data.backImageInfo.showWidth) / res.width
          },
          cutImg: true
        })
      }
    })
  },
  // canvas 绘图
  canvasDraw () {
    wx.showLoading({
      title: '疯狂生成中',
      mask: true
    })
    let ctx = wx.createCanvasContext('outPic', this)
    let that = this
    ctx.setFillStyle('white')
    ctx.fillRect(
      0,
      0,
      that.data.backImageInfo.showWidth * 2,
      that.data.backImageInfo.showHeight * 2
    )
    if (that.data.backImageInfo.zIndex <= 1) {
      ctx.drawImage(
        that.data.backImageInfo.path,
        0,
        0,
        that.data.backImageInfo.showWidth * 2,
        that.data.backImageInfo.showHeight * 2
      )
    }
    for (let v of that.data.imgArr) {
      ctx.save()
      ctx.translate(v.left * 2 + v.showWidth, v.top * 2 + v.showHeight)
      ctx.rotate((v.rotate * Math.PI) / 180)
      ctx.drawImage(
        v.path,
        -(v.showWidth * v.scale),
        -(v.showHeight * v.scale),
        v.showWidth * v.scale * 2,
        v.showHeight * v.scale * 2
      )
      if (v.border) {
        // 左上角
        ctx.translate(-v.showWidth * v.scale, -v.showHeight * v.scale)
        ctx.rotate((45 * Math.PI) / 180)
        ctx.drawImage(
          v.border.path,
          -(v.border.width * v.scale),
          -(v.border.width * v.scale),
          v.border.width * v.scale * 2,
          v.border.width * v.scale * 2
        )
        ctx.rotate((-45 * Math.PI) / 180)
        ctx.translate(v.showWidth * 2 * v.scale, 0)
        ctx.rotate((135 * Math.PI) / 180)
        ctx.drawImage(
          v.border.path,
          -(v.border.width * v.scale),
          -(v.border.width * v.scale),
          v.border.width * v.scale * 2,
          v.border.width * v.scale * 2
        )
        ctx.rotate((-135 * Math.PI) / 180)
        ctx.translate(0, v.showHeight * 2 * v.scale)
        ctx.rotate((225 * Math.PI) / 180)
        ctx.drawImage(
          v.border.path,
          -(v.border.width * v.scale),
          -(v.border.width * v.scale),
          v.border.width * v.scale * 2,
          v.border.width * v.scale * 2
        )
        ctx.rotate((-225 * Math.PI) / 180)
        ctx.translate(-v.showWidth * 2 * v.scale, 0)
        ctx.rotate((315 * Math.PI) / 180)
        ctx.drawImage(
          v.border.path,
          -(v.border.width * v.scale),
          -(v.border.width * v.scale),
          v.border.width * v.scale * 2,
          v.border.width * v.scale * 2
        )
        ctx.rotate((-315 * Math.PI) / 180)
        ctx.translate(v.showWidth * v.scale, -v.showHeight * v.scale)
        ctx.drawImage(
          v.path,
          -(v.showWidth * v.scale),
          -(v.showHeight * v.scale),
          v.showWidth * v.scale * 2,
          v.showHeight * v.scale * 2
        )
      }
      ctx.restore()
    }

    if (that.data.backImageInfo.zIndex >= 10) {
      ctx.drawImage(
        that.data.backImageInfo.path,
        0,
        0,
        that.data.backImageInfo.showWidth * 2,
        that.data.backImageInfo.showHeight * 2
      )
    }
    ctx.draw()
    setTimeout(() => {
      this.outImageDouble()
    }, 300)
  },
  // canvas 裁切图片
  canvasCut () {
    wx.showLoading({
      title: '图片裁切中',
      mask: true
    })
    let ctx = wx.createCanvasContext('outPic', this)
    let that = this
    ctx.clearRect(
      0,
      0,
      that.data.chooseAreaInfo.imgW * 2,
      that.data.chooseAreaInfo.imgH * 2
    )
    ctx.drawImage(
      that.data.chooseAreaInfo.path,
      0,
      0,
      that.data.chooseAreaInfo.imgW * 2,
      that.data.chooseAreaInfo.imgH * 2
    )
    ctx.draw()
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: that.data.chooseAreaInfo.x * 2,
        y: that.data.chooseAreaInfo.y * 2,
        width: that.data.chooseAreaInfo.w * 2,
        height: that.data.chooseAreaInfo.h * 2,
        destWidth: that.data.chooseAreaInfo.w * 2,
        destHeight: that.data.chooseAreaInfo.h * 2,
        canvasId: 'outPic',
        success (res) {
          wx.hideLoading()
          // console.log(res.tempFilePath)
          that.data.imgArr[changeIndex].src = res.tempFilePath
          that.getItemImageInfo(changeIndex, true)
        }
      })
    }, 300)
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
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success () {
              wx.showToast({
                title: '图片已存入相册'
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
  previeImg () {
    app.showImg(this.data.showImgSrc, [this.data.showImgSrc])
  },
  setBorder () {
    if (this.data.tabBorderIndex < 0) {
      this.setData({
        [`imgArr[${changeIndex}].border`]: null
      })
      canChoose = true
      return
    }
    let that = this
    wx.showLoading({
      title: '加载边框中',
      mask: true
    })
    wx.getImageInfo({
      src: `https://c.jiangwenqiang.com/lqsy/canvas_border_${that.data.tabBorderIndex}.jpg`,
      success (res) {
        wx.hideLoading()
        that.setData({
          [`imgArr[${changeIndex}].border`]: {
            width:
              res.width > that.data.imgArr[changeIndex].showWidth / 4
                ? that.data.imgArr[changeIndex].showWidth / 4
                : res.width,
            path: res.path
          }
        })
        canChoose = true
      }
    })
  },
  chooseAreaStart (e) {
    chooseArea.x = e.touches[0].pageX
    chooseArea.y = e.touches[0].pageY
    chooseArea.xx = this.data.chooseAreaInfo.x
    chooseArea.yy = this.data.chooseAreaInfo.y
    chooseArea.w = this.data.chooseAreaInfo.w
    chooseArea.h = this.data.chooseAreaInfo.h
  },
  chooseAreaMove (e) {
    let chooseAreaInfo = this.data.chooseAreaInfo
    if (e.currentTarget.dataset.type === 'img') {
      let x = chooseArea.xx + (e.touches[0].pageX - chooseArea.x)
      let y = chooseArea.yy + (e.touches[0].pageY - chooseArea.y)
      this.setData({
        [`chooseAreaInfo.x`]:
          x < 0
            ? 0
            : x >= chooseAreaInfo.imgW - chooseAreaInfo.w
            ? chooseAreaInfo.imgW - chooseAreaInfo.w
            : x,
        [`chooseAreaInfo.y`]:
          y < 0
            ? 0
            : y >= chooseAreaInfo.imgH - chooseAreaInfo.h
            ? chooseAreaInfo.imgH - chooseAreaInfo.h
            : y
      })
    } else if (e.currentTarget.dataset.type === 'point') {
      let width =
        chooseArea.w + (e.touches[0].pageX - chooseArea.x) < 10
          ? 10
          : chooseArea.w + (e.touches[0].pageX - chooseArea.x)
      let height = (chooseArea.h * width) / chooseArea.w
      if (width > chooseAreaInfo.imgW || height > chooseAreaInfo.imgH) return
      this.setData({
        [`chooseAreaInfo.w`]: width,
        [`chooseAreaInfo.h`]: height
      })
    }
  },
  onShareAppMessage () {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.chooseIndex({
      currentTarget: {
        dataset: {
          index: 0,
          type: 'bgc'
        }
      }
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
    app.su('canvasImgArr', [])
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
