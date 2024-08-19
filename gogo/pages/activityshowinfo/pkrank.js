// pages/activityshowinfo/pkrank.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_info:{},
    club_pk_rank_dict:{},
    sel_group_type:"",
    sel_group_rank:[],
    modify_time:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    this.setData({
      activity_info:activity_info,
      modify_time:activity_info.begintimeweek
    })
    this.get_club_pk_rank(activity_info.user_id,activity_info.activity_tag)
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

  },
  get_club_pk_rank(user_id,activity_tag){
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_club_pk_rank', //仅为示例，并非真实的接口地址
      data: {
        "user_id": user_id,
        "hobby_tag": activity_tag,
        "club_name":this.data.activity_info.club_name
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if(res.data.code == 200){
          var default_dict_keys = ["混双","男单","女单","男双","女双"];
          var sel_group_type = "";
          var sel_group_rank = {};
          for(var key in res.data.result){
            sel_group_type = key;
            sel_group_rank = res.data.result[key];
            break;
          }
          that.setData({
            club_pk_rank_dict:res.data.result,
            sel_group_type:sel_group_type,
            sel_group_rank:sel_group_rank,
            modify_time:sel_group_rank["modify_time"]
          })
        }
        
      },
      fail(res) {
       
      }
    });
  },
  sel_group_type(e){
    var sel_group_type_value = e.currentTarget.dataset.grouptype;
    var sel_group_rank = this.data.club_pk_rank_dict[sel_group_type_value];
    
    this.setData({
      sel_group_type:sel_group_type_value,
      sel_group_rank:sel_group_rank
    })

  }
})