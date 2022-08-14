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
        if(res.data.length>=0){
          console.log("创建的活动")
          console.log(JSON.stringify(res.data))
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
    var index_activity = this.data.activity_create_list[index];
    var activity_id = index_activity["id"];
    if(index_activity["activity_status"] == -1){
      wx.showToast({
        title: '审核中，无法查看',
        icon:"none",
        mask:true
      })
      return;
    }
    let id = JSON.stringify({"activity_id":activity_id});
    wx.navigateTo({
      url: '../index/index?activity_id='+encodeURIComponent(id)
    })
  },
  delete_activity(e){
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(typeof index);
    console.log(this.data.activity_create_list.length);
    var index_activity = this.data.activity_create_list[index];
    var activity_id = index_activity["id"];
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