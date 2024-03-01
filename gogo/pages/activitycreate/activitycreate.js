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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据获取中...',
    });
    this.navigateToActivitycreate();
  },
  navigateToActivitycreate(){
    var that = this;
    wx.request({
      url: app.globalData.hosturl+'get_create_actlist', //仅为示例，并非真实的接口地址
      data: {
        "user_id":app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        wx.hideLoading();
        if(res.data.length>=0){
          console.log("创建的活动")
          //console.log(JSON.stringify(res.data))
          //JSON.stringify(this.data.activity_info);
          that.setData({
            activity_create_list:res.data
          });
          if(res.data.length == 0){
            wx.showToast({
              title: '还没创建活动哦',
              icon:"success",
              duration:2500
            })
          }
        }
        
      }
    });
   
  },
  navigateToActivityIndex(e){
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    wx.navigateTo({
      url: '../index/index?activity_id='+ encodeURIComponent(JSON.stringify({ "activity_id": activity_info.activity_id }))
    })
  },
  delete_activity(e){
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    var activity_id = activity_info["activity_id"];
    wx.request({
      url: app.globalData.hosturl+'delete_activity', //仅为示例，并非真实的接口地址
      data: {
        "activity_id":activity_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log("成功删除活动");
        that.navigateToActivitycreate();
      }
    });
    
  },
  update_activity_info(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var activity_info = this.data.activity_create_list[index];
    //直接跳转到创建activity的界面
    activity_info = encodeURIComponent(JSON.stringify(activity_info));
    wx.navigateTo({
      url: '../activity/activity?activity_info=' + activity_info
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

  }
})