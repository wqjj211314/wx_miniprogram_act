// pages/index/place.js
const util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    place_list:[],
    show_index:-1,
    show_address:false,
    triggered:false,
    hobby_tags: ["羽毛球", "篮球", "乒乓球", "台球", "跑步", "骑行","棋牌","露营"],
    search_word:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  add_place(){
    wx.navigateTo({
      url: 'addplace',
    })
  },
  show_address(){
    this.setData({
      show_address:!this.data.show_address
    })
  },
  onScrollRefresh(){
    this.get_all_clubplace();
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false,
      })
    }, 2000);
  },
  get_all_clubplace(){
    if(!util.check_login(app)){
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_all_clubplace',
      data: {
        "user_id": app.globalData.login_userInfo["user_id"]
      },
      success: (res) => {
        console.log("appjs用户openid");
        console.log(res.data);
        if(res.data.code == 200){
          that.setData({
            place_list:res.data.result
          })
        }
      }
    })
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
  go_to_place(e){
   
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
  show_location(e){
    var index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      show_index:index
    })
  },
  edit_place_info(e){
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var place = this.data.place_list[index];
    wx.navigateTo({
      url: 'editplace?placeinfo='+encodeURIComponent(JSON.stringify(place)),
    })
  },
  more_img(e){
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var place = this.data.place_list[index];
    var url = place.club_place_img[0]
    wx.previewImage({
      urls: place.club_place_img,
      current: url
    })
  },
  go_to_miniprogram(e){
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
  search_clubplace_list(e){
    this.setData({
      search_word:e.currentTarget.dataset.search
    })
    wx.showLoading({
      title: '搜索中...',
    })
    var _that = this;
    wx.request({
      url: app.globalData.hosturl + 'search_clubplace', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.login_userInfo["user_id"],
        "search_word":this.data.search_word,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data)
        var list = [];
        console.log("获取list");
        console.log(res.data);
        if(res.data.code == 200){
          res.data.result.forEach(element => {
            console.log(element.activity_id)
            list.push(element);
          });
          if(list.length == 0){
            wx.showToast({
              title: '搜索为空',
              icon:"error",
              duration:3000
            })
          }else{
            _that.setData({
              place_list: list,
            })
          }
        }else{
          wx.showToast({
            title: '服务器异常',
            icon:"error",
            duration:3000
          })
        }
        
        
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {},
          });
        },3000)
      },
      fail(res){
        wx.hideLoading({
          success: (res) => {},
        });
        wx.showToast({
          title: '网络可能异常...',
          icon:"error",
          duration:4000
        })
  
      }
    });
  },
})