// pages/activity/customgroup.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_tag_list:new Array(1),
    group_room_list:[],
    group_limit_list:[],
    group_tag_dict:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var group_limit_list = JSON.parse(decodeURIComponent(options.group_limit_list));
    var group_tag_list = JSON.parse(decodeURIComponent(options.group_tag_list));
    var group_room_list = JSON.parse(decodeURIComponent(options.group_room_list));
    this.setData({
      group_limit_list:group_limit_list,
      group_tag_list:group_tag_list,
      group_room_list:group_room_list
    })
  },
  grouptagInput: function (e) {
    var value = e.detail.value;
    var grouptagindex = e.currentTarget.dataset.index;
    console.log(value)
    console.log(grouptagindex)
    console.log(typeof grouptagindex)//number
    var group_tag_list = this.data.group_tag_list;
    group_tag_list[grouptagindex] = value;
    this.setData({
      group_tag_list:group_tag_list
    })
   
  },
  grouproomInput: function (e) {
    var value = e.detail.value;
    var grouproomindex = e.currentTarget.dataset.index;
    console.log(value)
    console.log(grouproomindex)
    console.log(typeof grouproomindex)//number
    var group_room_list = this.data.group_room_list;
    group_room_list[grouproomindex] = value;
    this.setData({
      group_room_list:group_room_list
    })
    
  },
  grouplimitInput: function (e) {
    var value = e.detail.value;
    var grouplimitindex = e.currentTarget.dataset.index;
    console.log(value)
    console.log(grouplimitindex)
    console.log(typeof grouplimitindex)//number

    var group_limit_list = this.data.group_limit_list;
    group_limit_list[grouplimitindex] = value;
    this.setData({
      group_limit_list:group_limit_list
    })
    
  },
  save_group_tag_dict(){
    var group_tag_dict = this.data.group_tag_dict;
    var group_tag_list = this.data.group_tag_list;
    var group_room_list = this.data.group_room_list;
    var group_limit_list = this.data.group_limit_list;
    console.log(group_tag_list)
    group_tag_list.forEach((group_tag,index)=>{
      if(group_tag!=undefined && group_tag!=""  && !group_tag_dict.hasOwnProperty(group_tag)){
        group_tag_dict[group_tag] = {"name":group_tag,"room":group_room_list[index]==undefined?"":group_room_list[index],"limit":group_limit_list[index]==undefined?"":group_limit_list[index]}
      }
    })
    this.setData({
      group_tag_dict:group_tag_dict,
    })
    console.log("保存分组")
    console.log(group_tag_dict)
    app.globalData.custom_group_tag_dict = group_tag_dict;
    wx.switchTab({
      url: 'activity',
    })
    console.log(group_tag_dict)
  },
  addgroup(){
    var group_tag_list = this.data.group_tag_list;
    group_tag_list.push(null)
    console.log(group_tag_list)
    this.setData({
      group_tag_list:group_tag_list
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