'use strict';

var UpLoad = require('../upLoad');
var app = getApp();
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
  readOnlyChange: function readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    });
  },
  onLoad: function onLoad() {
    var platform = wx.getSystemInfoSync().platform;
    var isIOS = platform === 'ios';
    this.setData({ isIOS: isIOS });
    var that = this;
    this.updatePosition(0);
    var keyboardHeight = 0;
    wx.onKeyboardHeightChange(function (res) {
      if (res.height === keyboardHeight) return;
      var duration = res.height > 0 ? res.duration * 1000 : 0;
      keyboardHeight = res.height;
      setTimeout(function () {
        wx.pageScrollTo({
          scrollTop: 0,
          success: function success() {
            that.updatePosition(keyboardHeight);
            that.editorCtx.scrollIntoView();
          }
        });
      }, duration);
    });
  },
  updatePosition: function updatePosition(keyboardHeight) {
    var toolbarHeight = 50;

    var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
        windowHeight = _wx$getSystemInfoSync.windowHeight;

    var editorHeight = keyboardHeight > 0 ? windowHeight - keyboardHeight - toolbarHeight : windowHeight;
    this.setData({ editorHeight: editorHeight, keyboardHeight: keyboardHeight });
  },
  calNavigationBarAndStatusBar: function calNavigationBarAndStatusBar() {
    var systemInfo = wx.getSystemInfoSync();
    var statusBarHeight = systemInfo.statusBarHeight,
        platform = systemInfo.platform;

    var isIOS = platform === 'ios';
    var navigationBarHeight = isIOS ? 44 : 48;
    return statusBarHeight + navigationBarHeight;
  },
  onEditorReady: function onEditorReady() {
    var that = this;
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
    }).exec();
  },
  blur: function blur() {
    this.editorCtx.blur();
  },
  format: function format(e) {
    var _e$target$dataset = e.target.dataset,
        name = _e$target$dataset.name,
        value = _e$target$dataset.value;

    if (!name) return;
    // console.log('format', name, value)
    this.editorCtx.format(name, value);
  },
  onStatusChange: function onStatusChange(e) {
    var formats = e.detail;
    this.setData({ formats: formats });
  },
  insertDivider: function insertDivider() {
    this.editorCtx.insertDivider({
      success: function success() {
        console.log('insert divider success');
      }
    });
  },
  clear: function clear() {
    this.editorCtx.clear({
      success: function success(res) {
        console.log('clear success');
      }
    });
  },
  removeFormat: function removeFormat() {
    this.editorCtx.removeFormat();
  },
  insertDate: function insertDate() {
    var date = new Date();
    var formatDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    this.editorCtx.insertText({
      text: formatDate
    });
  },
  insertImage: function insertImage() {
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '作品装裱', '从手机相册选择'],
      success: function success(e) {
        switch (e.tapIndex) {
          case 0:
            new UpLoad({
              imgArr: 'swiperImg',
              sourceType: ['camera']
            }).chooseImage();
            break;
          case 1:
            wx.navigateTo({
              url: '/commonPage/canvas2/step_one/index?from=sell_release_editor'
            });
            break;
          case 2:
            new UpLoad({
              imgArr: 'swiperImg',
              sourceType: ['album']
            }).chooseImage();
            break;
          default:
            break;
        }
      }
    });
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
});