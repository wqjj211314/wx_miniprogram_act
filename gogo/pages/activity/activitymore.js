// pages/activity.js
const util = require("../../utils/util.js");
const datatime_util = require("../../utils/datatime.js");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partinfo: [],
    partinfo_all_options: ["姓名", "性别","自评等级", "籍贯", "公司", "职业", "学校"],
    sel_index: -1,
    part_limit_picker: ["所有人均可参与", "通过发起人和成员分享可以参与", "通过发起人分享可以参与"],
    part_limit_index: 0,
   
    group_tag_list:[],
    group_room_list:[],
    group_limit_list:[],
    group_tag_dict:{},
    take_flag:true,
    location_list:[],
    route:{},
  },
 
  takechange(e){
    var value = e.detail.value;
    console.log(value)
    this.setData({
      take_flag:value
    })
  },
  part_limit_change(e) {
    this.setData({
      part_limit_index: e.detail.value
    })
  },
  choose_route(){
    wx.navigateTo({
      url: '/pages/routePlanning/routePlanning?route='+encodeURIComponent(JSON.stringify(this.data.route)),
    })
  },
  partinfoInput(e){
    this.setData({
      partinfo: e.detail.value.split(",")
    })
  },
  choose_partinfo(event) {
    var partinfovalue = event.target.dataset.partinfo;
    var partinfo = this.data.partinfo;
    if (partinfo.indexOf(partinfovalue) != -1) {
      partinfo.splice(partinfo.indexOf(partinfovalue), 1)
    } else {
      partinfo.push(partinfovalue);
    }
    this.setData({
      partinfo: partinfo
    });

  },
  getpartinfo() {
    var that = this;
    var info = [];
    this.data.partinfo_all_options_bg.forEach(function (item, index, self) {
      if (item == "bg-green") {
        info.push(that.data.partinfo_all_options[index])
      }
    });
    return info;
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //const _this = this;
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("活动创建页onshow")
    var group_tag_dict = app.globalData.custom_group_tag_dict;
    var group_tag_list = [];
    var group_room_list = [];
    var group_limit_list = [];
    for(var key in group_tag_dict){
      group_tag_list.push(group_tag_dict[key]["name"])
      group_room_list.push(group_tag_dict[key]["room"])
      group_limit_list.push(group_tag_dict[key]["limit"])
    }
    this.setData({
      group_tag_dict:app.globalData.custom_group_tag_dict,
      group_tag_list:group_tag_list,
      group_room_list:group_room_list,
      group_limit_list:group_limit_list
    })
    
    if(app.globalData.route!=""){
      console.log(JSON.stringify(app.globalData.route))
      this.setData({
        route:app.globalData.route
      })
    }
    var activity_more_setting = app.globalData.activity_more_setting;
    const dataToUpdate = {};
    for (const [key, value] of Object.entries(activity_more_setting)) {
      dataToUpdate[key] = value;
    }
    // 使用 this.setData 修改数据
    this.setData(dataToUpdate);
  },
 
  onbindblur(){
    this.setData({
      //scroll_flag:true
      //modalName:"partinfo_modal"
    });
  },
  onbindfocus(){
    this.setData({
      //scroll_flag:false
      //modalName:"partinfo_modal"
    });
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
  save_setting(){
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
    //保存分组
    app.globalData.custom_group_tag_dict = group_tag_dict;
    //保存其他配置
    var activity_more_setting = {}
    activity_more_setting["part_limit_index"] = this.data.part_limit_index
    activity_more_setting["partinfo"] = this.data.partinfo
    activity_more_setting["take_flag"] = this.data.take_flag
    app.globalData.activity_more_setting = activity_more_setting;
    wx.navigateBack()
    
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //chooseLocation.setLocation(null);
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
 
})