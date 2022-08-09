// pages/activitycreate/activitycreate.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_create_list:[],
    hosturl:app.globalData.hosturl
  },
  get_checking_activity_list(){
    var that = this;
    wx.request({
      url: app.globalData.hosturl+'get_checking_activity_list', //仅为示例，并非真实的接口地址
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if(res.data.length>=0){
          console.log("待审核的活动")
          console.log(JSON.stringify(res.data))
          //JSON.stringify(this.data.activity_info);
          that.setData({
            activity_create_list:res.data
          });
          if(res.data.length == 0){
            wx.showToast({
              title: '活动都已审核',
              icon: 'success',
              duration: 2000
            })
          }
          
        }
        
      }
    });
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_checking_activity_list();
  },
  update_activity_bg_issue(e){
    var activity_id = e.currentTarget.dataset.id;
    this.update_activity_status(activity_id,0,"已审核，图片敏感");
    this.get_checking_activity_list();
  },
  update_activity_pass(e){
    var activity_id = e.currentTarget.dataset.id;
    this.update_activity_status(activity_id,1,"已审核，正常");
    this.get_checking_activity_list();
  },
  update_activity_status(activity_id,activity_status,activity_status_comment){
    wx.request({
      url: app.globalData.hosturl+'update_activity_status', //仅为示例，并非真实的接口地址
      data: {
        "activity_id":activity_id,
        "activity_status":activity_status,
        "activity_status_comment":activity_status_comment
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if(res.data.length>=0){
          
        }
        
      }
    });
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