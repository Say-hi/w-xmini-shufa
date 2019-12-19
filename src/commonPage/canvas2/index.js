// 获取全局应用程序实例对象
const app = getApp()
// const UpLoad = require('../upLoad')
let baseScale = 1 // 底图缩放率
let currentIndex = 0 // 当前的图片
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    backImageInfo: {
      src: '',
      zIndex: 1,
      positionItem: [ // 展示点位置坐标
        {
          x: 375, // 中心点x
          y: 375, // 中心店y
          width: 200, // 实际宽
          height: 200 // 实际高
        }
      ]
    },
    shareArr: [
      '社区',
      '墨宝真迹',
      '保存相册',
      '微信好友',
      '朋友圈'
    ],
    upImgArr: [],
    tabBorderArr: {
      i: -1,
      item: [
        'https://c.jiangwenqiang.com/lqsy/canvas_border_0.jpg',
        'https://c.jiangwenqiang.com/lqsy/canvas_border_1.jpg',
        'https://c.jiangwenqiang.com/lqsy/canvas_border_2.jpg',
        'https://c.jiangwenqiang.com/lqsy/canvas_border_3.jpg',
        'https://c.jiangwenqiang.com/lqsy/canvas_border_4.jpg',
        'https://c.jiangwenqiang.com/lqsy/canvas_border_5.jpg'
      ]
    },
    bgColorArr: {
      i: -1,
      item: [
        '#ffffff',
        '#F1ECD9',
        '#E7D3D4',
        '#CDC2C0',
        '#BDC8C0'
      ]
    },
    borderColorArr: {
      i: 0,
      item: [
        '#ffffff',
        '#F1ECD9',
        '#E7D3D4',
        '#CDC2C0',
        '#BDC8C0'
      ]
    },
    operationArr: {
      chooseIndex: 0,
      tab: [{
        t: '画框',
        img: 'https://c.jiangwenqiang.com/lqsy/sb11.png',
        imgChoose: 'https://c.jiangwenqiang.com/lqsy/sb1.png',
        sliderText: '缩放',
        currentSlider: 0,
        minSlider: 0,
        maxSlider: 80
      },
      {
        t: '卡纸',
        img: 'https://c.jiangwenqiang.com/lqsy/sb2.png',
        imgChoose: 'https://c.jiangwenqiang.com/lqsy/sb22.png',
        sliderText: '宽度',
        currentSlider: 0,
        minSlider: 0,
        maxSlider: 20
      },
      {
        t: '局条',
        img: 'https://c.jiangwenqiang.com/lqsy/sb3.png',
        imgChoose: 'https://c.jiangwenqiang.com/lqsy/sb33.png',
        sliderText: '宽度',
        currentSlider: 0,
        minSlider: 0,
        maxSlider: 3
      }
      ]
    }
  },
  shareType (e) {
    let that = this
    switch (this.data.shareArr[e.currentTarget.dataset.index]) {
      case '社区':
        wx.navigateTo({
          url: `/commonPage/talk/index?type=community&url=${that.data.shareImageSrc}`
        })
        that.setData({
          showSpec: !that.data.showSpec
        })
        break
      case '墨宝真迹':
        wx.redirectTo({
          url: `/commonPage/release/index?from=release&u=${that.data.shareImageSrc}`
        })
        break
      case '保存相册':
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImageSrc,
          success () {
            wx.showToast({
              title: '图片已存入相册'
            })
            that.setData({
              showSpec: !that.data.showSpec
            })
          },
          fail () {
            app.toast({
              content: '请授权相册保存--点击右上角是三个小点--选择设置--允许使用相册--返回重新保存',
              time: 10000
            })
          }
        })
        break
      case '微信好友':
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImageSrc,
          success () {
            app.toast({
              content: '图片已存入相册,快去发送给你的好友吧',
              image: ''
            })
            that.setData({
              showSpec: !that.data.showSpec
            })
          },
          fail () {
            app.toast({
              content: '请授权相册保存--点击右上角是三个小点--选择设置--允许使用相册--返回重新保存',
              time: 10000
            })
          }
        })
        break
      case '朋友圈':
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImageSrc,
          success () {
            app.toast({
              content: '图片已存入相册,快去发条朋友圈吧',
              image: ''
            })
            that.setData({
              showSpec: !that.data.showSpec
            })
          },
          fail () {
            app.toast({
              content: '请授权相册保存--点击右上角是三个小点--选择设置--允许使用相册--返回重新保存',
              time: 10000
            })
          }
        })
        break
    }
  },
  _toggleSpec () {
    this.canvasDraw()
    if (this.data.sell_release) {
      // this.canvasDraw()
    } else {
      this.setData({
        showSpec: !this.data.showSpec
      })
    }
  },
  chooseImage (e) {
    if (this.data.single === 'single') return
    wx.chooseImage({
      count: 1,
      success (res) {
        app.data['chooseImage'] = res.tempFilePaths[0]
        wx.navigateTo({
          url: `/commonPage/canvas2/step_two/index?single=more&index=${e.currentTarget.dataset.index}`
        })
      }
    })
  },
  /**
   * slider对应不同内容处理
   * @param e
   */
  sliderChange (e) {
    if (this.data.operationArr.chooseIndex === 0) { // 改变整体大小
      this.setData({
        [`operationArr.tab[0].currentSlider`]: e.detail.value,
        [`upImgArr[0].scale`]: (100 - e.detail.value) / 100
      })
    } else if (this.data.operationArr.chooseIndex === 1) { // 改变图片大小
      let inScale = 1 - (e.detail.value / 40)
      this.setData({
        [`operationArr.tab[1].currentSlider`]: e.detail.value,
        [`upImgArr[${currentIndex}].width`]: this.data.upImgArr[currentIndex].startWidth * inScale,
        [`upImgArr[${currentIndex}].height`]: this.data.upImgArr[currentIndex].startHeight * inScale,
        [`upImgArr[${currentIndex}].xx`]: ((1 - inScale) * this.data.upImgArr[currentIndex].startWidth) / 2,
        [`upImgArr[${currentIndex}].yy`]: ((1 - inScale) * this.data.upImgArr[currentIndex].startHeight) / 2
      })
      if (this.data.operationArr.tab[2].currentSlider > 0) {
        let value = this.data.upImgArr[currentIndex].width < this.data.upImgArr[currentIndex].startWidth - 3 ? this.data.operationArr.tab[2].currentSlider * 2 : 0
        this.setData({
          [`upImgArr[${currentIndex}].border.x`]: this.data.upImgArr[currentIndex].xx - value / 2,
          [`upImgArr[${currentIndex}].border.y`]: this.data.upImgArr[currentIndex].yy - value / 2,
          [`upImgArr[${currentIndex}].border.width`]: this.data.upImgArr[currentIndex].width + value,
          [`upImgArr[${currentIndex}].border.height`]: this.data.upImgArr[currentIndex].height + value
        })
      }
    } else if (this.data.operationArr.chooseIndex === 2 && this.data.upImgArr[currentIndex].width < this.data.upImgArr[currentIndex].startWidth - 3) { // 改变局条颜色
      let value = 2 * e.detail.value
      this.setData({
        [`operationArr.tab[2].currentSlider`]: e.detail.value,
        [`upImgArr[${currentIndex}].border.x`]: this.data.upImgArr[currentIndex].xx - value / 2,
        [`upImgArr[${currentIndex}].border.y`]: this.data.upImgArr[currentIndex].yy - value / 2,
        [`upImgArr[${currentIndex}].border.width`]: this.data.upImgArr[currentIndex].width + value,
        [`upImgArr[${currentIndex}].border.height`]: this.data.upImgArr[currentIndex].height + value
      })
    }
  },
  /**
   * 修改不同分类的索引
   * @param e
   */
  chooseIndex (e) {
    if (e.currentTarget.dataset.type === 'type') { // 选择类型
      this.setData({
        [`operationArr.chooseIndex`]: e.currentTarget.dataset.index
      })
    } else if (e.currentTarget.dataset.type === 'type0') { // 选择边框
      this.setData({
        [`tabBorderArr.i`]: e.currentTarget.dataset.index
      }, () => {
        this.getBorderInfo(this.data.tabBorderArr.item[e.currentTarget.dataset.index])
      })
    } else if (e.currentTarget.dataset.type === 'type1') { // 选择卡纸
      this.setData({
        [`bgColorArr.i`]: e.currentTarget.dataset.index,
        [`upImgArr[${currentIndex}].bgc`]: this.data.bgColorArr.item[e.currentTarget.dataset.index]
      })
    } else if (e.currentTarget.dataset.type === 'type2') { // 选择局条
      this.setData({
        [`borderColorArr.i`]: e.currentTarget.dataset.index,
        [`upImgArr[${currentIndex}].border.color`]: this.data.borderColorArr.item[e.currentTarget.dataset.index]
      })
    }
  },
  /**
   * 获取图片信息
   * @param src // 传入图片路径
   * @returns {Promise}
   */
  getImageInfo (src) {
    wx.showLoading({
      title: '加载中...'
    })
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src,
        success (res) {
          wx.hideLoading()
          resolve(res)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  /**
   * 获取底图的尺寸信息
   * @param src
   */
  getBackImageInfo (src) {
    this.getImageInfo(src).then(res => {
      res.fixWidth = app.data.system.windowWidth
      // console.log('res.fixWidth', res.fixWidth)
      baseScale = app.data.system.windowWidth / res.width
      // console.log('baseScale', baseScale)
      res.fixHeight = baseScale * res.height
      // console.log('res.fixHeight', res.fixHeight)
      // console.log('this.data.backImageInfo.positionItem', this.data.backImageInfo.positionItem)
      for (let v of this.data.backImageInfo.positionItem) {
        v.x = baseScale * v.x
        v.y = baseScale * v.y
        // v.width = baseScale * v.width / 8
        // v.height = baseScale * v.height / 8
        v.width = baseScale * v.width
        v.height = baseScale * v.height
      }
      // console.log('this.data.backImageInfo.positionItem', this.data.backImageInfo.positionItem)
      this.setData({
        backImageInfo: Object.assign(this.data.backImageInfo, res)
      }, () => {
        for (let i of this.data.backImageInfo.positionItem.keys()) {
          // console.log(i)
          this.data.upImgArr[i] = {
            'src': app.data.userUseImg || 'https://c.jiangwenqiang.com/lqsy/nav_0.png'
          }
          this.getItemImageInfo(i)
        }
      })
    }, () => {
      wx.hideLoading()
      app.toast({content: '图片信息加载失败，请重新进入'})
    })
  },
  /**
   * 获取每个图片的信息和位置
   * @param index
   */
  getItemImageInfo (index) {
    this.getImageInfo(this.data.upImgArr[index].src).then(res => {
      if (this.data.backImageInfo.positionItem[index].width <= this.data.backImageInfo.positionItem[index].height) {
        let temp = this.data.backImageInfo.positionItem[index].width * res.height / res.width
        res.width = this.data.backImageInfo.positionItem[index].width.toFixed(1)
        res.height = temp.toFixed(1)
      } else {
        let temp = this.data.backImageInfo.positionItem[index].height * res.width / res.height
        res.height = this.data.backImageInfo.positionItem[index].height.toFixed(1)
        res.width = temp.toFixed(1)
      }
      // 记录图片的宽高
      res.startWidth = res.width
      res.startHeight = res.height
      res.useWidth = res.width < res.height
      res.scale = 1
      res.rotate = this.data.slideScale - 1
      res.x = this.data.backImageInfo.positionItem[index].x - res.width / 2
      res.y = this.data.backImageInfo.positionItem[index].y - res.height / 2
      res.xx = 0
      res.yy = 0
      res.bgc = '#ffffff'
      res.border = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: '#ffffff'
      }
      this.setData({
        [`upImgArr[${index}]`]: res
      })
    }, () => {
      wx.hideLoading()
      app.toast({content: '图片信息加载失败，请重新进入'})
    })
  },
  /**
   * 获取对应图片的边框信息
   * @param src
   * @param index
   */
  getBorderInfo (src, index = 0) {
    if (!src) {
      return this.setData({
        [`upImgArr[${currentIndex}].borderImageInfo`]: null
      })
    }
    this.getImageInfo(src).then(res => {
      res.width = (res.width * baseScale).toFixed(1)
      let x = this.data.upImgArr[index].startWidth / (res.width / 2)
      let y = this.data.upImgArr[index].startHeight / (res.width / 2)
      res.x = x === Math.floor(x) ? Math.floor(x) - 1 : Math.floor(x)
      res.y = y === Math.floor(y) ? Math.floor(y) - 1 : Math.floor(y)
      this.setData({
        [`upImgArr[${currentIndex}].borderImageInfo`]: res
      })
    }, () => {
      wx.hideLoading()
      app.toast({content: '图片信息加载失败，请重新进入'})
    })
  },

  canvasDraw () {
    wx.showLoading({
      title: '图片生成中',
      mask: true
    })
    let ctx = wx.createCanvasContext('outPic', this)
    let that = this
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, that.data.backImageInfo.fixWidth * 2, that.data.backImageInfo.fixHeight * 2)
    if (that.data.backImageInfo.zIndex <= 1) {
      ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.fixWidth * 2, that.data.backImageInfo.fixHeight * 2)
    }
    for (let v of that.data.upImgArr) {
      ctx.save()
      // 移动坐标点到图片中心位置
      ctx.translate(v.x * 2 + v.startWidth * that.data.slideScale, v.y * 2 + v.startHeight * that.data.slideScale)
      // 旋转画布对应的角度
      ctx.rotate(v.rotate * that.data.slideScale * Math.PI / 180)
      // 边框 ---s
      if (v.borderImageInfo) {
        // 上边框
        let count = 0
        while (count < v.borderImageInfo.x) {
          ctx.translate(((v.borderImageInfo.x - 1 - count) * v.borderImageInfo.width * that.data.slideScale - v.startWidth) * v.scale, -v.startHeight * v.scale)
          ctx.rotate(45 * Math.PI / 180 * that.data.slideScale)
          ctx.drawImage(v.borderImageInfo.path, -(v.borderImageInfo.width * v.scale), -(v.borderImageInfo.width * v.scale), v.borderImageInfo.width * v.scale * 2, v.borderImageInfo.width * v.scale * 2)
          ctx.rotate(-45 * Math.PI / 180)
          ctx.translate(-((v.borderImageInfo.x - 1 - count) * v.borderImageInfo.width - v.startWidth) * v.scale, v.startHeight * v.scale)
          count++
        }
        // 右边框
        count = 0
        while (count < v.borderImageInfo.y) {
          // (v.borderImageInfo.width * v.scale * (v.borderImageInfo.x - 1 - count)) - v.startWidth
          ctx.translate(v.startWidth * v.scale, ((v.borderImageInfo.y - 1 - count) * v.borderImageInfo.width * that.data.slideScale - v.startHeight) * v.scale)
          ctx.rotate(135 * Math.PI / 180 * that.data.slideScale)
          ctx.drawImage(v.borderImageInfo.path, -(v.borderImageInfo.width * v.scale), -(v.borderImageInfo.width * v.scale), v.borderImageInfo.width * v.scale * 2, v.borderImageInfo.width * v.scale * 2)
          ctx.rotate(-135 * Math.PI / 180)
          ctx.translate(-v.startWidth * v.scale, -((v.borderImageInfo.y - 1 - count) * v.borderImageInfo.width - v.startHeight) * v.scale)
          count++
        }
        // 下边框
        count = 0
        while (count < v.borderImageInfo.x) {
          // (v.borderImageInfo.width * v.scale * (v.borderImageInfo.x - 1 - count)) - v.startWidth
          ctx.translate((-(v.borderImageInfo.x - 1 - count) * v.borderImageInfo.width * that.data.slideScale + v.startWidth * 1) * v.scale, v.startHeight * v.scale)
          ctx.rotate(225 * Math.PI / 180 * that.data.slideScale)
          ctx.drawImage(v.borderImageInfo.path, -(v.borderImageInfo.width * v.scale), -(v.borderImageInfo.width * v.scale), v.borderImageInfo.width * v.scale * 2, v.borderImageInfo.width * v.scale * 2)
          ctx.rotate(-225 * Math.PI / 180)
          ctx.translate(-(-(v.borderImageInfo.x - 1 - count) * v.borderImageInfo.width + v.startWidth * 1) * v.scale, -v.startHeight * v.scale)
          count++
        }
        // 右边框
        count = 0
        while (count < v.borderImageInfo.y) {
          // (v.borderImageInfo.width * v.scale * (v.borderImageInfo.x - 1 - count)) - v.startWidth
          ctx.translate(-v.startWidth * v.scale, (-(v.borderImageInfo.y - 1 - count) * v.borderImageInfo.width * that.data.slideScale + v.startHeight * 1) * v.scale)
          ctx.rotate(315 * Math.PI / 180 * that.data.slideScale)
          ctx.drawImage(v.borderImageInfo.path, -(v.borderImageInfo.width * v.scale), -(v.borderImageInfo.width * v.scale), v.borderImageInfo.width * v.scale * 2, v.borderImageInfo.width * v.scale * 2)
          ctx.rotate(-315 * Math.PI / 180)
          ctx.translate(v.startWidth * v.scale, -(-(v.borderImageInfo.y - 1 - count) * v.borderImageInfo.width + v.startHeight * 1) * v.scale)
          count++
        }
      }
      // 边框 ---e
      // 卡纸 ---s
      ctx.setFillStyle(v.bgc)
      ctx.fillRect(-(v.startWidth * v.scale), -(v.startHeight * v.scale), v.startWidth * v.scale * 2, v.startHeight * v.scale * 2)
      // 卡纸 ---e
      // 局条 ---s
      if (v.border) {
        ctx.setFillStyle(v.border.color)
        ctx.fillRect(-(v.border.width * v.scale), -(v.border.height * v.scale), v.border.width * v.scale * 2, v.border.height * v.scale * 2)
      }
      // 局条 ---e
      // 图片 ---s
      ctx.drawImage(v.path, -(v.width * v.scale), -(v.height * v.scale), v.width * v.scale * 2, v.height * v.scale * 2)
      // 图片 ---e
      ctx.restore()
    }

    // 图片 ---e
    if (that.data.backImageInfo.zIndex >= 10) {
      ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.fixWidth * 2 * that.data.slideScale, that.data.backImageInfo.fixHeight * 2 * that.data.slideScale)
    }
    ctx.draw()
    setTimeout(() => {
      this.outImageDouble()
    }, 300)
  },
  getuser () {
    app.baseUserInfo(this)
  },
  outImageDouble () {
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.backImageInfo.fixWidth * 2,
      height: that.data.backImageInfo.fixHeight * 2,
      destWidth: that.data.backImageInfo.fixWidth * 2,
      destHeight: that.data.backImageInfo.fixHeight * 2,
      canvasId: 'outPic',
      success: res => {
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          // that.setData({
          //   showImgSrc: res.tempFilePath
          // })
          wx.hideLoading()
          // 发布拍品
          if (this.data.sell_release) {
            let pages = getCurrentPages()
            for (let [i, v] of pages.entries()) {
              if (v.route === 'commonPage/release/index') {
                v.uploadSingleImg(res.tempFilePath)
                wx.navigateBack({
                  delta: pages.length - 1 - i
                })
              }
            }
          } else {
            this.data.shareImageSrc = res.tempFilePath
          }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getuser()
    this.setData({
      single: options.single,
      sell_release: app.data.sell_release,
      backImageInfo: app.gs('backImageInfo')
    }, () => {
      this.getBackImageInfo(this.data.backImageInfo.src)
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
    // console.log(' ---------- onUnload ----------')
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.getCourse()
  }
})
