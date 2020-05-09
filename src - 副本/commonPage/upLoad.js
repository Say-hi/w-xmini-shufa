/**
 * Created by kkk on 2019/3/11.
 */
const app = getApp()
const config = require('./config')
const COS = require('./cos-js-sdk-v5.min')
const cos = new COS({
  getAuthorization (params, callback) {
    let authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    })
    callback(authorization)
  }
})
class upLoad {
  constructor (param) {
    this.count = param['count'] || 999
    this.sourceType = param['sourceType'] || ['album', 'camera']
    this._that = param['this'] || getCurrentPages()[getCurrentPages().length - 1]
    this.imgArr = param['imgArr'] || 'imgArr'
    this.fileIndex = param['index'] * 1 + 1 > 0 ? param['index'] : -1
    this.tempFilpaths = []
    this.itemList = param['itemList'] || ['查看图片', '替换图片', '删除图片']
  }
  imgOp () {
    let that = this
    wx.showActionSheet({
      itemList: that.itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that._that.data[that.imgArr][that.fileIndex].real, [that._that.data[that.imgArr][that.fileIndex].real])
        } else if (res.tapIndex === 1) {
          that.chooseImage()
        } else if (res.tapIndex === 2) {
          that._that.data[that.imgArr].splice(that.fileIndex, 1)
          that._that.setData({
            [that.imgArr]: that._that.data[that.imgArr]
          })
        }
      }
    })
  }
  checkAll () {
    let status = true
    for (let v of this._that.data[this.imgArr]) {
      if (v.progress < 99) status = false
    }
    if (!status) {
      app.toast({
        toastType: 'ontop',
        content: `请等待所有图片上传完成后再继续操作`,
        bgc: 'rgba(255, 0, 0, 0.67)',
        color: '#fff'
      })
    }
    return status
  }
  upImgSingle (url) {
    let that = this
    wx.showLoading({
      title: '图片上传中'
    })
    that.tempFilpaths = [url]
    let temp = [{
      temp: url,
      real: '',
      key: '',
      progress: 0
    }]
    // console.log(that.imgArr)
    that._that.setData({
      [that.imgArr]: that._that.data[that.imgArr] ? that._that.data[that.imgArr].concat(temp) : temp
    }, () => {
      that.upLoad()
    })
  }
  chooseImage () {
    let that = this
    if (!this.checkAll()) return
    wx.showLoading()
    wx.chooseImage({
      count: that.fileIndex > -1 ? 1 : that.count - (that._that.data[that.imgArr].length || 0),
      sourceType: that.sourceType,
      success (res) {
        wx.hideLoading()
        that.tempFilpaths = res.tempFilePaths
        let temp = []
        for (let v of res.tempFilePaths) {
          temp.push({
            temp: v,
            real: '',
            key: '',
            progress: 0
          })
        }
        if (that.fileIndex > -1) {
          that._that.setData({
            [`${that.imgArr}[${that.fileIndex}]`]: {
              temp: res.tempFilePaths[0],
              real: '',
              key: '',
              progress: 0
            }
          }, () => {
            that.upLoad()
          })
        } else {
          that._that.setData({
            [that.imgArr]: that._that.data[that.imgArr] ? that._that.data[that.imgArr].concat(temp) : temp
          }, () => {
            that.upLoad()
          })
        }
      },
      fail (err) {
        wx.hideLoading()
        console.log(err)
      }
    })
  }
  upLoad (i = 0) {
    if (!this.tempFilpaths[i]) return wx.hideLoading()
    let that = this
    let FilePath = this.tempFilpaths[i]
    let Key = `image/${app.gs('userInfoAll').id || 10000}/${FilePath.substr(FilePath.lastIndexOf('/') + 1)}`
    // console.log(Key)
    // console.log(FilePath)
    cos.postObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key,
      FilePath,
      onProgress (info) {
        that._that.setData({
          [`${that.imgArr}[${that.fileIndex > -1 ? that.fileIndex : that._that.data[[that.imgArr]].length - that.tempFilpaths.length + i}].progress`]: info.percent * 100
        })
      }
    }, (err, data) => {
      if (err) {
        that._that.setData({
          [`${that.imgArr}[${that.fileIndex > -1 ? that.fileIndex : that._that.data[that.imgArr].length - that.tempFilpaths.length + i}].temp`]: false
        }, () => {
          that.upLoad(++i)
        })
      } else {
        that._that.setData({
          [`${that.imgArr}[${that.fileIndex > -1 ? that.fileIndex : that._that.data[that.imgArr].length - that.tempFilpaths.length + i}]`]: {
            real: `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`,
            key: Key,
            temp: FilePath,
            progress: 100
          }
        }, () => {
          that.upLoad(++i)
        })
      }
    })
  }
}

module.exports = upLoad
