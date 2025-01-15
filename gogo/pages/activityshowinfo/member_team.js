// pages/activityshowinfo/member_team.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_users:[],
    member_num_nonteam_list:[],
    member_num_team_dict:{},
    member_users:{},
    sel_values:[],
    group_team_tag:"",
    admin_flag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   
    if(options.hasOwnProperty("activity_id")){
      this.setData({
        activity_id: options.activity_id,
      })
      this.get_member_list(options.activity_id);
    }
  },
  get_member_list(activity_id){
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_memberlist', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "user_id":app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        
        var member_users = {};
        var info = res.data["user_info_part_info_list"];
        info.forEach(item => {
          var member_num = item.member_num;
          member_users[member_num] = item;
        })
        var group_users = info;
      var member_num_nonteam_list = [];
      var member_num_team_dict = {};
      for(var i in group_users){
        if(group_users[i].group_team_tag == ""||group_users[i].group_team_tag == undefined){
          member_num_nonteam_list.push(group_users[i].member_num)
        }else{
          if(member_num_team_dict.hasOwnProperty(group_users[i].group_team_tag)){
            var temp = member_num_team_dict[group_users[i].group_team_tag];
            console.log(temp)
            temp.push(group_users[i].member_num)

          }else{
            member_num_team_dict[group_users[i].group_team_tag] = [group_users[i].member_num]
          }
        }
      }
     var admin_flag = false;
     var activity_info = res.data.activity_info;
     if(activity_info["user_id"] == app.globalData.login_userInfo["user_id"]){
       admin_flag = true;
     }
        //更新活动的时间限制信息
        that.setData({
          group_users:info,
          member_users:member_users,
          member_num_nonteam_list:member_num_nonteam_list,
        member_num_team_dict:member_num_team_dict,
        admin_flag:admin_flag
        });
       
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {},
          });
        },3000)
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: "活动异常",
          icon: "error"
        })
      }
    });
  },
  edit_group_tag(e) {
    console.log("分组标签" + e.detail.value);
    var group_team_tag = e.detail.value.trim();
    this.setData({
      group_team_tag: e.detail.value.trim()
    });
    //this.update_save_group_button_status();
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
  save_team(e){
    var sel_values = this.data.sel_values;

    if(sel_values.length < 1){
      wx.showToast({
        title: '未选择搭档成员',
        icon:"none",
        duration:3000
      })
      return
    }
    if(this.data.group_team_tag == ""){
      wx.showToast({
        title: '请填写队伍名称',
        icon:"none",
        duration:3000
      })
      return
    }
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'save_group_team_member', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_id,
        "group_team_tag": this.data.group_team_tag,
        "group_users":this.data.sel_values
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        if(res.data.code == 200){
          var member_num_nonteam_list = that.data.member_num_nonteam_list
          for(var i in sel_values){
            member_num_nonteam_list.splice(member_num_nonteam_list.indexOf(sel_values[i]),1)
          }
          var member_num_team_dict = that.data.member_num_team_dict;
          member_num_team_dict[that.data.group_team_tag] = that.data.sel_values;
          that.setData({
            member_num_nonteam_list:member_num_nonteam_list,
            sel_values:[],
            group_team_tag:"",
            member_num_team_dict:member_num_team_dict
          })
        }
      }
    });

},
clear_group_team(e){
  var group_team_tag = e.currentTarget.dataset.tag;
  var that = this;
    wx.request({
      url: app.globalData.hosturl + 'clear_group_team_member', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_id,
        "group_team_tag": group_team_tag,
        "group_users":this.data.member_num_team_dict[group_team_tag]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        if(res.data.code == 200){
          var clear_team = that.data.member_num_team_dict[group_team_tag]
          var member_num_nonteam_list = that.data.member_num_nonteam_list
          var member_num_team_dict = that.data.member_num_team_dict;
          delete member_num_team_dict[group_team_tag]
          for(var i in clear_team){
            member_num_nonteam_list.push(clear_team[i])
          }
          that.setData({
            member_num_nonteam_list:member_num_nonteam_list,
            member_num_team_dict:member_num_team_dict,
            
            
          })
        }
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