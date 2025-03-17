// pages/activityshowinfo/activitypkrank.js
const score = require("score.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_info: {},
    sort_users_score: {},
    sort_users_score_empty_flag: true,
    like_dict: {},
    member_users: {},
    group_users: [],
    part_member_num:"",
    group_rank: {},
    team_rank: {},
    sel_group_type:"个人排名"


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    this.setData({
      activity_info: activity_info
    })
    this.init_activity_pk_rank(activity_info);

  },
  init_activity_pk_rank(activity_info) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_memberlist', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_info.activity_id,
        "user_id": app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        var member_users = {};
        var part_member_num = "";
        var info = res.data["user_info_part_info_list"];
        info.forEach(item => {
          var member_num = item.member_num;
          member_users[member_num] = item;
          if (item["user_id"] == app.globalData.login_userInfo["user_id"] && part_member_num == "") {
            console.log("已参与")
            part_member_num = item["member_num"];
          }
        })

        //更新活动的时间限制信息
        that.setData({
          group_users: info,
          member_users: member_users,
          part_member_num:part_member_num
        });
        score.get_pk_groups_list(app.globalData.hosturl, that, activity_info.activity_id, activity_info.activity_tag)
        score.get_like_list(app.globalData.hosturl, that, activity_info.activity_id)
        that.get_activity_pk_rank(activity_info);
        setTimeout(function () {
          wx.hideLoading({
            success: (res) => { },
          });
        }, 3000)
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
  get_activity_pk_rank(activity_info) {
    
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_activity_pk_rank', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_info.activity_id,
        "hobby_tag": activity_info.activity_tag,
        "user_id": app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          var group_rank = res.data.result["group_rank"];
          var team_rank = res.data.result["team_rank"]
          that.setData({
            group_rank:group_rank,
            team_rank:team_rank
          })
        }
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
  sel_group_type(e){
    var group_type = e.currentTarget.dataset.grouptype;
    this.setData({sel_group_type:group_type})
  },
  like(e) {
    var like_member_group = e.currentTarget.dataset.likemembergroup;
    var part_member_num = this.data.part_member_num;
    var that = this;
    var url = "";//去点赞
    var like_dict = this.data.like_dict;
    if (!like_dict.hasOwnProperty(like_member_group)) {
      like_dict[like_member_group] = { "like_flag": false, "member_nums": [] };
    }
    var member_nums = like_dict[like_member_group]["member_nums"];
    if (like_dict[like_member_group]["like_flag"] == true) {
      url = "del_activity_member_like"//取消点赞
      like_dict[like_member_group]["like_flag"] = false;
      member_nums.splice(member_nums.indexOf(part_member_num), 1)//删除
    } else {
      url = "like_activity_member";//去点赞
      like_dict[like_member_group]["like_flag"] = true;
      member_nums.push(part_member_num)//新增
    }
    this.setData({
      like_dict: like_dict
    })
    wx.request({
      url: app.globalData.hosturl + url, //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "like_member_group": like_member_group,
        "member_num": part_member_num
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("点赞了")
      },
      fail(res) {

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
    return {
      title: this.data.activity_info["title"]+"-比赛排名",
      path: '/pages/activityshowinfo/activitypkrank?activity_info=' + encodeURIComponent(JSON.stringify(this.data.activity_info))
    }
  },
  
  nagivateActivityInfo() {
    let activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));

    let activity_user_info = encodeURIComponent(JSON.stringify(this.data.activity_info["createuser"]));
    console.log("跳转至活动报名界面")
    console.log(activity_info);
    console.log(activity_user_info)
    wx.navigateTo({
      url: '/pages/activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info
    })

  },
})