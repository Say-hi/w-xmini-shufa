// 获取全局应用程序实例对象
const app = getApp()
const UpLoad = require('../upLoad')
// const bmap = require('../../utils/bmap-wx')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    now: true,
    upImgType: 'img',
    // swiperImg: [],
    swiperImg: [],
    step: 60,
    move_index: -1,
    X: -1,
    desImg: [],
    derationImg: [
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png',
      'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png'
    ]
  },
  del () {
    if (this.data.swiperImg.length <= 1) {
      return app.toast({content: '至少保留一张图片哦'})
    }
    let temp = []
    for (let v of this.data.swiperImg) {
      if (!v.active) temp.push(v)
    }
    for (let [i, v] of temp.entries()) {
      v['x'] = 60 * i + 10
      v['s'] = i
      v['active'] = false
      // console.log(this.data.swiperImgX[i])
    }
    temp[0]['active'] = true
    this.setData({
      swiperImg: temp
    })
  },
  changeImage () {
    if (!this.data.toggle) {
      // let max = this.data.swiperImg.length
      for (let [i, v] of this.data.swiperImg.entries()) {
        v['x'] = 60 * i + 10
        v['s'] = i
        v['active'] = false
        // console.log(this.data.swiperImgX[i])
      }
      this.data.swiperImg[0]['active'] = true
      this.setData({
        swiperImg: this.data.swiperImg
      })
    }
    this.setData({
      toggle: !this.data.toggle
    })
  },
  start (e) {
    for (let v of this.data.swiperImg) {
      v['active'] = false
    }
    this.data.swiperImg[e.currentTarget.dataset.index]['active'] = true
    this.setData({
      animation: true,
      move_index: this.data.swiperImg[e.currentTarget.dataset.index].s * 1,
      swiperImg: this.data.swiperImg
    })
    this.data.X = this.data.swiperImg[e.currentTarget.dataset.index].s * 1
  },
  movechange (e) {
    if (e.detail.source === 'touch') {
      let change = Math.floor(e.detail.x / this.data.step)
      if (this.data.X === change) return
      for (let [i, v] of this.data.swiperImg.entries()) {
        if (v.s === change) {
          let temp2 = this.data.swiperImg[this.data.move_index].x
          this.data.swiperImg[this.data.move_index].x = this.data.swiperImg[i].x
          this.setData({
            [`swiperImg[${i}].x`]: temp2
          })
          let temp = this.data.swiperImg[i].s
          this.data.swiperImg[i].s = this.data.swiperImg[this.data.move_index].s
          this.data.swiperImg[this.data.move_index].s = temp
          this.data.X = change
          return
        }
      }
    }
  },
  end () {
    this.setData({
      animation: false
    })
    let that = this
    this.data.X = -1
    let s = that.data.swiperImg.sort((a, b) => { return a.x - b.x })
    for (let [i, v] of s.entries()) {
      v.s = i
    }
    this.setData({
      swiperImg: s,
      move_index: -1,
      active_index: -1
    })
  },
  _toggleSpec (e) {
    if (e.currentTarget.dataset.type === 'showSpec2') {
      if (e.currentTarget.dataset.confirm === 'confirm') {
        this.setData({
          showSpec2: !this.data.showSpec2
        }, this.subGoods)
      } else {
        this.setData({
          showSpec2: !this.data.showSpec2
        })
        this.data.up = e.currentTarget.dataset.up || 1
      }
    } else {
      this.setData({
        showSpec: !this.data.showSpec
      })
    }
  },
  pickerChoose (e) {
    this.setData({
      [`${e.currentTarget.dataset.type}`]: e.currentTarget.dataset.type === 'wareHouse' ? e.detail.value.join(' ') : e.detail.value
    })
  },
  toggleTime () {
    this.setData({
      now: !this.data.now
    })
  },
  uploadSingleImg (url) {
    new UpLoad({
      imgArr: this.data.upImgType === 'img' ? 'swiperImg' : 'desImg',
      this: this
    }).upImgSingle(url)
  },
  inputValue (e) {
    this.data[`${e.currentTarget.dataset.type}`] = e.detail.value
  },
  chooseType (e) {
    this.data.upImgType = e.currentTarget.dataset.type
    wx.showActionSheet({
      itemList: ['拍照', '作品装裱', '从手机相册选择'],
      success (e) {
        switch (e.tapIndex) {
          case 0:
            new UpLoad({
              imgArr: 'swiperImg',
              sourceType: ['camera']
            }).chooseImage()
            break
          case 1:
            wx.navigateTo({
              url: '/commonPage/canvas2/step_one/index?from=sell_release'
            })
            break
          case 2:
            new UpLoad({
              imgArr: 'swiperImg',
              sourceType: ['album']
            }).chooseImage()
            break
          default:
            break
        }
      }
    })
  },
  subGoods () {
    if (!this.data.title) {
      return app.toast({
        content: '请输入商品标题'
      })
    } else if (!this.data.price) {
      return app.toast({
        content: '请输入商品售价'
      })
    } else if (!this.data.freight) {
      return app.toast({
        content: '请输入商品运费，如不需要运费输入0'
      })
    } else if (!this.data.phone || this.data.phone.length <= 10) {
      return app.toast({
        content: '请输入正确的手机号码'
      })
    }
    let imgsUrl = []
    for (let v of this.data.swiperImg) {
      if (!v.real) {
        return app.toast({
          content: '图片上传中，请稍后尝试'
        })
      }
      imgsUrl.push({
        img_url: v.real
      })
    }
    app.wxrequest({
      url: app.getUrl().sellProductSub,
      data: {
        uid: app.gs('userInfoAll').uid,
        title: this.data.title,
        price: this.data.price,
        freight: this.data.freight,
        des: this.data.des || '',
        phone: this.data.phone,
        is_up: this.data.up,
        delivery: this.data.wareHouse || '广东省 广州市 海珠区',
        imgs_url: JSON.stringify(imgsUrl)
      }
    }).then(() => {
      app.toast({
        content: '添加成功',
        image: '',
        mask: true
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    })
    if (options.u && options.u.length > 10) {
      this.uploadSingleImg(options.u)
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
