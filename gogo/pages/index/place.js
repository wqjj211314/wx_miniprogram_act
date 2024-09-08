// pages/index/place.js
const util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    place_list: [],
    show_index: -1,
    show_address: false,
    triggered: false,
    hobby_tags: ["羽毛球", "篮球", "乒乓球", "台球", "跑步", "骑行", "棋牌", "露营"],
    search_word: "",
    latitude: "",
    longitude: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.again_getLocation();
  },
  getLocation(that) {
    var that = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        wx.getLocation({
          type: 'wgs84',
          success (res) {
            const latitude = res.latitude
            const longitude = res.longitude
            const speed = res.speed
            const accuracy = res.accuracy
            that.setData({
              latitude: latitude,
              longitude: longitude
            }) 
          }
         })
         
      }
    });

  },
  again_getLocation: function () {
    let that = this;
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        console.log("位置信息" + res)
        console.log(res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function (res) {
              console.log(res)
              if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
                
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    console.log(dataAu)
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                     
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          that.getLocation();

        }
        else { //授权后默认加载
          that.getLocation();
        }
      }
    })

  },
  add_place() {
    wx.navigateTo({
      url: 'addplace',
    })
  },
  show_address() {
    this.setData({
      show_address: !this.data.show_address
    })
  },
  onScrollRefresh() {
    this.get_all_clubplace();
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false,
      })
    }, 2000);
  },
  get_all_clubplace() {
    if (!util.check_login(app)) {
      return;
    }
    wx.showLoading({
      title: '',
    })
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_all_clubplace',
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "longitude":that.data.longitude,
        "latitude":that.data.latitude
      },
      success: (res) => {
        console.log("appjs用户openid");
        console.log(res.data);
        if (res.data.code == 200) {
          var place_list = res.data.result;
          place_list.forEach(item=>{
            if(that.data.latitude!=""&&that.data.longitude!=""){
              item["distance"] = util.GetDistance(that.data.latitude,  that.data.longitude,  item.latitude,  item.longitude)
            }else{
              item["distance"] = ""
            }
            
          })
          that.setData({
            place_list: place_list
          })
        }
      }
    })
    setTimeout(function(){
      wx.hideLoading()
    },3000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.get_all_clubplace()
  },
  go_to_place(e) {

    var index = e.currentTarget.dataset.index;
    console.log(index)
    var place = this.data.place_list[index];
    wx.openLocation({
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      name: place.club_place_address.split("--")[0],
      address: place.club_place_address.split("--")[1],
      scale: 28
    })
  },
  show_location(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      show_index: index
    })
  },
  edit_place_info(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var place = this.data.place_list[index];
    wx.navigateTo({
      url: 'editplace?placeinfo=' + encodeURIComponent(JSON.stringify(place)),
    })
  },
  more_img(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var place = this.data.place_list[index];
    var url = place.club_place_img[0]
    wx.previewImage({
      urls: place.club_place_img,
      current: url
    })
  },
  go_to_miniprogram(e) {
    var url = e.currentTarget.dataset.url;
    console.log(url)
    wx.navigateToMiniProgram({
      shortLink: url,
      success(res) {
        // 打开成功
        wx.showToast({
          title: '打开成功',
        })
      },
      fail(res) {
        // 打开失败
        console.log(res)
        wx.showToast({
          title: '打开失败',
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: "查看附近场馆信息",

      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log("成功", res)
        }
      },
      fail: function (res) {
        console.log("失败", res)
      }
    }
  },
  search_clubplace_list(e) {
    this.setData({
      search_word: e.currentTarget.dataset.search
    })
    wx.showLoading({
      title: '搜索中...',
    })
    var _that = this;
    var that= this;
    wx.request({
      url: app.globalData.hosturl + 'search_clubplace', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "search_word": this.data.search_word,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        var list = [];
        console.log("获取list");
        console.log(res.data);
        if (res.data.code == 200) {
          res.data.result.forEach(element => {
            console.log(element.activity_id)
            if(that.data.latitude!=""&&that.data.longitude!=""){
              element["distance"] = util.GetDistance(that.data.latitude,  that.data.longitude,  element.latitude,  element.longitude)
            }else{
              element["distance"] = ""
            }
            list.push(element);
          });
          if (list.length == 0) {
            wx.showToast({
              title: '搜索为空',
              icon: "error",
              duration: 3000
            })
          } else {
            _that.setData({
              place_list: list,
            })
          }
        } else {
          wx.showToast({
            title: '服务器异常',
            icon: "error",
            duration: 3000
          })
        }


        setTimeout(function () {
          wx.hideLoading({
            success: (res) => { },
          });
        }, 3000)
      },
      fail(res) {
        wx.hideLoading({
          success: (res) => { },
        });
        wx.showToast({
          title: '网络可能异常...',
          icon: "error",
          duration: 4000
        })

      }
    });
  },
})