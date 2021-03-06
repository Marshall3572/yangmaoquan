//app.js
App({   
  onLaunch: function () {
      var openId = (wx.getStorageSync('openId'))        
      wx.request({
        url: 'url',
      })
      if (openId) {
      wx.getUserInfo({  
        success: function (res) {
        },
        fail: function () {
          // fail
          console.log("获取失败！")
        },
        complete: function () {
          // complete
          console.log("获取用户信息完成！")
        }
      })
    } else {
      wx.login({
        success: function (res) {
          console.log(res.code)              
          if (res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (res_user) {
                wx.request({                     //后台接口地址
                  url: 'http://tp.adplay.ink/wx.login.php',
                  data: {
                    code: res.code,
                  },
                  method: 'GET',
                  header: {                     
                       'content-type': 'application/json'
                  },
                  success: function (res) {
                    wx.setStorageSync('openId', res.data.openid);        
                  }
                })
              }, 
              fail: function () {
                wx.showModal({
                  title: '警告通知',
                  content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {                              
                          if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                            wx.login({
                              success: function (res_login) {
                                if (res_login.code) {
                                  wx.getUserInfo({
                                    withCredentials: true,
                                    success: function (res_user) {
                                      wx.request({
                                       url: 'http://tp.adplay.ink/wx.login.php',
                                        data: {
                                          code: res_login.code,
                                          encryptedData: res_user.encryptedData,
                                          iv: res_user.iv
                                        },
                                        method: 'GET',
                                        header: {                                              'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                          that.setData({
                                            nickName: res.data.nickName,
                                            avatarUrl: res.data.avatarUrl,                                             })
                                          wx.setStorageSync('openId', res.data.openid);
                                        }
                                      })
                                    }
                                  })
                                }
                              }
                            });
                          }
                        }, fail: function (res) {                           }
                      })                       }
                  }
                })
              }, complete: function (res) {                 }
            })
          }
        }
      })       
    }},
    
  globalData: {
    info:"",
    product_array:"",
    jd_product_array:""
  }
})