/**
 * Created by JWQ on 2019/2/20.
 */
wx.cloud.init({
  traceUser: true
})

module.exports = {
  getExactlyUrl (url) {
    let urlArray = url.split(',')
    let temp = ''
    for (let v of urlArray) {
      temp += String.fromCharCode((v - 10) / 2)
    }
    return temp
  },
  getShareText () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getShareText',
        data: {},
        success (res) {
          resolve(res)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getPermission () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getPermission',
        data: {},
        success (res) {
          resolve(res.result)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getUserOperation () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getUserOperation',
        data: {},
        success (res) {
          resolve(res.result)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getMoney () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getMoney',
        data: {},
        success (res) {
          resolve(res.result)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getShareUrl () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'shareUrl',
        data: {},
        success (res) {
          resolve(res.result)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getRankLv () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getrank',
        data: {},
        success (res) {
          resolve(res.result)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getBaseImageInfo () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getBaseImageInfo',
        data: {},
        success (res) {
          resolve(res.result)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  checkPrivier () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'checkPrivier',
        data: {},
        success (res) {
          resolve(res.result)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getImgCheck (imgsrc) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: imgsrc,
        success: buffer => {
          wx.cloud.callFunction({
            name: 'check',
            data: {
              value: buffer.data
            },
            success (imgres) {
              wx.hideToast()
              if (imgres.result.errCode * 1 === 87014 || !imgres.result) {
                reject()
              } else {
                resolve()
              }
            }
          })
        }
      })
    })
  },
  getFreight () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.getExactlyUrl('218,242,242,234,240,126,104,104,208,102,222,220,204,230,216,248,212,230,236,220,204,230,216,102,208,232,228,104,226,236,240,252,104,240,218,204,238,212,178,212,250,242,102,222,240,232,230'),
        success (res) {
          if (res.statusCode !== 200) {
            wx.cloud.callFunction({
              name: 'getFreight',
              data: {},
              success (res) {
                resolve(res.result)
              },
              fail (err) {
                reject(err)
              }
            })
          } else {
            resolve(res.data.data)
          }
        },
        fail () {
          wx.cloud.callFunction({
            name: 'getFreight',
            data: {},
            success (res) {
              resolve(res.result)
            },
            fail (err) {
              reject(err)
            }
          })
        }
      })
    })
  }
}
