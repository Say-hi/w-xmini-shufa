const UpLoad = require('../upLoad')
const app = getApp()
Page({
  data: {
    swiperImg: [],
    formats: {},
    readOnly: false,
    placeholder: '请填写您的宝贝描述',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  readOnlyChange () {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad () {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success () {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })
  },
  updatePosition (keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar () {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady () {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur () {
    this.editorCtx.blur()
  },
  format (e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },
  onStatusChange (e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider () {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear () {
    this.editorCtx.clear({
      success: function (res) {
        console.log('clear success')
      }
    })
  },
  removeFormat () {
    this.editorCtx.removeFormat()
  },
  insertDate () {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage () {
    const that = this
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
              url: '/commonPage/canvas2/step_one/index?from=sell_release_editor'
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
    // wx.chooseImage({
    //   count: 1,
    //   success: function (res) {
    //     that.editorCtx.insertImage({
    //       src: res.tempFilePaths[0],
    //       data: {
    //         id: 'abcd',
    //         role: 'god'
    //       },
    //       width: '100%',
    //       success: function () {
    //         console.log('insert image success')
    //       }
    //     })
    //   }
    // })
  }
})
