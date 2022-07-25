// pages/user/user.js
//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismask:'block',
    faceid:"",
    userinfo:{},
    t_length:0

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  navigateToActivity(){
    wx.navigateTo({
      url: '../activity/activity'
    })
  },
  navigateToActivitycreate(){
    wx.request({
      url: app.globalData.hosturl+'get_create_actlist', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if(res.data.length>=0){
          console.log("创建的活动")
          console.log(JSON.stringify(res.data))
          //JSON.stringify(this.data.activity_info);
          wx.navigateTo({
            url: '../activitycreate/activitycreate?actlist='+encodeURIComponent(JSON.stringify(res.data))
          })
        }
        
      }
    });
   
  },
  navigateToActivityadd(){
    wx.request({
      url: app.globalData.hosturl+'get_partactlist', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if(res.data.length>=0){
          console.log("参与的活动")
          console.log(JSON.stringify(res.data))
          //JSON.stringify(this.data.activity_info);
          wx.navigateTo({
            url: '../activitycreate/activitycreate?actlist='+encodeURIComponent(JSON.stringify(res.data))
          })
        }
        
      }
    });
  },
  navigateToindex(){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  navigateToFriendList(){
    wx.navigateTo({
      url: '../friend/friend'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_info = JSON.parse(decodeURIComponent(options.userinfo))
    //console.log("创建的活动"+options);
    this.setData({
      userinfo:user_info
    });
   
  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      t_length: t_text
    }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})