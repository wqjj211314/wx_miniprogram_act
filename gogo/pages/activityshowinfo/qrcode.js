// pages/activityshowinfo/qrcode.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode_url:"",
    sign_res:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.hasOwnProperty("activity_id")){
      var activity_id = options.activity_id;
      this.sign_qrcode(activity_id);
    }else if(options.hasOwnProperty("q")){
      var q = decodeURIComponent(options.q)
      console.log(q)//https://www.2week.club:5000/static/activity_id?activity_id=20241211_1733925362.8226078o1fAa5PPELB1SokZQPZLzwcRHwa0
      var params = q.split("?")[1].split("&&|&");
      console.log(params)
      var params_dict = {}
      params.forEach(item=>{
        var key = item.split("=")[0]
        var value = item.split("=")[1]
        console.log(key)
        console.log(value)
        params_dict[key] = value
      })
      console.log(params_dict)
      wx.showLoading({
        title: '签到中',
      })
      this.user_sign(params_dict.activity_id)
    }
    
    

    
  },
  sign_qrcode(activity_id){
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_activity_qrcode_url', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "user_id":app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          qrcode_url:res.data.qrcode_url
        })
      },
      fail(res) {
        
      }
    });
  },
  ViewImagebg(e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
      current: e.currentTarget.dataset.url
    });
  },
  user_sign(activity_id){
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'user_qrcode_sign', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "user_id":app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        
        that.setData({
          sign_res:res.data.result
        })
        console.log(res.data)
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: "网络异常",
        })
      }
    });
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

  }
})