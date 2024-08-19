//const chooseLocation = requirePlugin('chooseLocation');
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ungroup_partinfo_list:[],
    sel_values:[],
    re_group_flag:false,
    group_tag:"",
    group_room:"",
    group_limit:"",
    member_users:{},
    activity_info:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let ungroup_partinfo_list = this.data.ungroup_partinfo_list;
    let re_group_flag = false;
    let member_users = {}
    let activity_info = {}
    if (options.hasOwnProperty("ungroup_partinfo_list")){
      ungroup_partinfo_list = JSON.parse(decodeURIComponent(options.ungroup_partinfo_list));
    }
    if (options.hasOwnProperty("activity_info")){
      activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    }
    if (options.hasOwnProperty("member_users")){
      member_users = JSON.parse(decodeURIComponent(options.member_users));
    }
    if (options.hasOwnProperty("re_group_flag")){
      re_group_flag = JSON.parse(decodeURIComponent(options.re_group_flag));
    }
    that.setData({
      ungroup_partinfo_list:ungroup_partinfo_list,
      re_group_flag:re_group_flag,
      member_users:member_users,
      activity_info:activity_info
    });
  },
  edit_group_tag(e) {
    console.log("分组标签" + e.detail.value);
    var group_tag = e.detail.value.trim();
    this.setData({
      group_tag: e.detail.value.trim()
    });
    
  },
 
 
  listenCheckboxChange(e){
    console.log('当checkbox-group中的checkbox选中或者取消是我被调用');
      //打印对象包含的详细信息
      console.log(e.detail.value);
      var sel_values = e.detail.value;
      this.setData({
        sel_values:sel_values
      })
      
  },
  save_group(){
    //不能带参数，那就存在app里面吧
    var temp = app.globalData.edit_group_user;
    var edit_group_user = temp.concat(this.data.sel_values);
    app.globalData.edit_group_user = edit_group_user;
    console.log(edit_group_user);
    wx.navigateBack({
      url: 'activityshowinfo'
    })
  },
  save_re_group(){
    if(this.data.group_tag == ""){
      wx.showToast({
        title: '请填写分组名称',
      })
      return
    }
    
   
    if(this.data.sel_values.length == 0){
      wx.showToast({
        title: '请选择分组成员',
      })
      return
    }
    var group_users = []
    this.data.sel_values.forEach(item => {
      var temp = {};
      temp["member_num"] = item;
      temp["group_tag2"] = this.data.group_tag;
      group_users.push(temp);
    })

    //保存再分组
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'edit_re_group_member', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_info.activity_id,
        "group_users": JSON.stringify(group_users),
        "activity_tag": this.data.activity_info.activity_tag
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //app.globalData.edit_group_user = [];
        //app.globalData.group_sel_values = [];
        console.log(res.data)
        if(res.data.code == 200){
          wx.showToast({
            title: res.data.result,
            icon:'success',
            duration:3000
          })
        }
        var re_group_users = {}
        re_group_users["group_tag"] = that.data.group_tag
        re_group_users["group_users"] = group_users
        app.globalData.re_group_users = re_group_users;
        console.log(re_group_users);
        wx.navigateBack({
          url: 'activityshowinfo'
        })
      }
    })
  }
})