//const chooseLocation = requirePlugin('chooseLocation');
const app = getApp();
const util = require("../../utils/util.js");
//const score = require("score.js");
const share = require("share.js");
const manage_activity = require("manage_activity.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    activity_info: {},
    room_list: [],
    is_begin: false,
    is_end: true,
    is_end_12h: false,
    is_addend: false,
    is_cancelend: false,
    activity_user_info: {},
    title_tags: [],
    partinfo: [],
    partinfo_list: [],
    partinfoinput: {},
    memberlist: {},
    ispart: false,
    part_flag: false, //是否参与
    part_member_num: "", //当前用户参与的编号
    part_group_tag: "",
    like_flag: false,
    isend: false,
    partbuttonmsg: "我要报名",
    modalName: "",
    avatarUrl_list: [],
    user_info_list: [],
    addendtime: "",
    member: 0,
    hosturl: app.globalData.hosturl,
    admin_flag: false, //是否是发布者，超级权限：编辑活动，删除成员
    edit_group_flag: false,
    announcement: "",
    new_announcement: "",
    partinfo_sex: "",
    picker_index: 0,
    picker: ["1级", "2级", "3级", "4级", "5级", "6级", "7级", "8级", "9级", "10级"],
    activity_date: "",
    share_user_id: "",
    part_limit: 1, //0不限制参与，1限制参与,
    entire_part_info: [],
    group_name: "",
    hidden_del_tag: true,
    ungroup_partinfo_list: [],
    pre_edit_group: [], //老的分组成员
    current_edit_group: [], //当前分组成员
    all_group_tag_dict: {},
    all_group_tag_list: [],
    all_group_tag2_dict: {},
    all_group_tag2_list: [],
    unuse_group_tag_dict: {},
    disable_save_group: true,
    current_swiper_item_index: 0,
    sort_users_score: {},
    sort_users_score_empty_flag: true,
    member_users: {},
    login_user_part_list: [],
    cancel_part_members: [],
    confirm_cancel_part: false,
    like_dict: {},
    group_tag: "", //编辑分组
    group_room: "", //编辑分组
    group_limit: "", //编辑分组
    edit_group_tag_dict: {}, //编辑分组
    triggered: false,
    select_group_tag: "", //报名所选择的分组
    pk_hobby_list: ["羽毛球", "篮球", "乒乓球", "台球", "跑步", "骑行", "网球", "击剑", "棋牌"],
    is_pk_hobby: true,
    show_part_flag: false,
    show_admin_flag: false,
    empty_group_tag_dict: true, //用来显示报名预分组的
    recommend_list: [],
    barbg_url: "https://www.2week.club:5000/static/barbg/羽毛球.jpg",
    barbg_tags: ["羽毛球", "台球", "篮球", "棋牌", "乒乓球"],
    loading_tip: "加载中",
    show_detail_flag: false,
    safeArea: app.globalData.safeArea,
    is_display: false,
    is_focus: false,
    chat_msgs: [],
    inputMsg: "",
    scrollTop: 0,
    edit_member_num: "",
    share_num: 0,
    shareImageUrl: "",
    login_userInfo:{},
    pay_type:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("加载用户活动详情页");
    console.log(options)
    let activity_info = JSON.parse(decodeURIComponent(options.activity_info));
    console.log(activity_info)
    //let activity_user_info = JSON.parse(decodeURIComponent(options.activity_user_info));
    if (options.hasOwnProperty("share_user_id")) {
      let share_user_id = decodeURIComponent(options.share_user_id);
      this.setData({
        share_user_id: share_user_id
      });
    }
    if (activity_info.hasOwnProperty("addendtime")) {

      console.log(activity_info);
      //console.log(activity_user_info);
      var addendtime = activity_info["addendtime"];
      if (new Date("2024-03-22 10:00") - new Date() > 0) {
        console.log("日期比较大")
      }
      this.setData({
        activity_info: activity_info,
        room_list: activity_info.room.split(","),
        is_begin: new Date(activity_info["begintime"]) - new Date() <= 0,
        is_end: new Date(activity_info["endtime"]) - new Date() <= 0,
        is_end_12h: new Date(activity_info["endtime"]) - new Date() <= -(1000 * 60 * 60 * 12),
        is_addend: new Date(activity_info["addendtime"]) - new Date() <= 0,
        is_cancelend: new Date(activity_info["cancelendtime"]) - new Date() <= 0,
        new_announcement: activity_info["announcement"],
        member: activity_info["member"],
        addendtime: addendtime,
        activity_user_info: activity_info.createuser, //activity_user_info,
        partinfo: activity_info.partinfo,
        title_tags: activity_info.title_tags,
        share_res_limit: activity_info["part_limit"],
        is_pk_hobby: this.data.pk_hobby_list.indexOf(activity_info.activity_tag) != -1
      });
      var that = this;
      console.log(new Date(addendtime).getTime());
      console.log(new Date().getTime());
    } else {
      this.setData({
        activity_info: activity_info,
        activity_user_info: activity_info["createuser"]
      })
    }
    if (this.data.barbg_tags.includes(activity_info.activity_tag)) {
      this.setData({
        barbg_url: "https://www.2week.club:5000/static/barbg/" + activity_info.activity_tag + ".jpg"
      })
    }
    this.init_activity_all_info(activity_info);
    this.setData({
      login_userInfo:app.globalData.login_userInfo
    })
    // 绑定分享参数
    wx.onCopyUrl(() => {
      console.log("复制链接");
      var share_user_id = app.globalData.login_userInfo["user_id"];
      var activity_info2 = {}
      activity_info2["activity_id"] = activity_info["activity_id"]
      activity_info2["activity_tag"] = activity_info["activity_tag"]
      activity_info2["createuser"] ={"user_id":activity_info["createuser"]["user_id"]}
      activity_info2 = encodeURIComponent(JSON.stringify(activity_info2));
      return {
        query: "activity_info=" + activity_info2 + "&&share_user_id=" + share_user_id
      }
    })
  },
  show_all_part() {
    this.setData({
      show_part_flag: !this.data.show_part_flag
    })
  },
  show_detail() {
    this.setData({
      show_detail_flag: !this.data.show_detail_flag
    })
  },
  go_to_place(e) {
    wx.openLocation({
      latitude: Number(this.data.activity_info.latitude),
      longitude: Number(this.data.activity_info.longitude),
      name: this.data.activity_info.show_activityaddress,
      address: this.data.activity_info.activityaddress,
      scale: 28
    })
  },
  show_admin_options(e) {
    this.setData({
      edit_member_num: e.currentTarget.dataset.membernum,
      modalName: "admin_modal"
    })
  },
  init_activity_all_info(activity_info) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_memberlist', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_info.activity_id,
        "hobby_tag": activity_info.activity_tag,
        "user_id": app.globalData.login_userInfo["user_id"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //更新活动信息
        if (res.data["code"] == 500) {
          wx.showToast({
            title: '服务器异常',
            icon: 'error',
            duration: 4000
          })

        }
        var activity_info = that.data.activity_info;
        console.log(res.data["activity_info"])
        var new_activity_info = res.data["activity_info"]
        for (var key in new_activity_info) {
          //if (activity_info.hasOwnProperty(key)) {
          activity_info[key] = new_activity_info[key]
          //}
        }
        console.log("获取新的activity_info")
        console.log(new_activity_info)
        if (app.globalData.login_userInfo["user_id"] == activity_info["createuser"]["user_id"]) {
          that.setData({
            admin_flag: true
          });
        }
        //更新活动的时间限制信息
        that.setData({
          activity_info: activity_info,
          activity_user_info:activity_info["createuser"],
          room_list: activity_info.room.split(","),
          is_begin: new Date(activity_info["begintime"]) - new Date() <= 0,
          is_end: new Date(activity_info["endtime"]) - new Date() <= 0,
          is_end_12h: new Date(activity_info["endtime"]) - new Date() <= -(1000 * 60 * 60 * 12),
          is_addend: new Date(activity_info["addendtime"]) - new Date() <= 0,
          is_cancelend: new Date(activity_info["cancelendtime"]) - new Date() <= 0,
          new_announcement: activity_info["announcement"],
          member: activity_info["member"],
          addendtime: activity_info["addendtime"],
          activity_user_info: activity_info.createuser,
          partinfo: activity_info.partinfo,
          title_tags: activity_info.title_tags,
          share_res_limit: activity_info["part_limit"],
          is_pk_hobby: that.data.pk_hobby_list.indexOf(activity_info.activity_tag) != -1,
          loading_tip: ""
        });

        that.update_part_info(that, res);
        that.set_part_limit();
        that.get_init_msg();
        wx.hideLoading();
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: "活动异常",
          icon: "error"
        })
      }
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)


  },

  show_user_detail(e) {
    var all_group_tag_list = this.data.all_group_tag_list;
    var group_tag = e.currentTarget.dataset.tag;
    console.log(group_tag);
    all_group_tag_list.forEach(item => {
      if (item["group_tag"] == group_tag) {
        item["show_flag"] = !(item.show_flag);
      }
    })
    this.setData({
      all_group_tag_list
    })
    //console.log();

  },
  update_part_status() {
    console.log("更新update_part_status");
    console.log(this.data.addendtime);
    console.log(new Date(this.data.addendtime).getTime());
    console.log(new Date().getTime());
    this.setData({
      ispart: false,
      partbuttonmsg: "我要报名"
    });
    if (new Date(this.data.addendtime).getTime() < new Date().getTime()) {
      console.log("报名截止返回首页");
      this.setData({
        isend: true,
        partbuttonmsg: "报名截止返回首页"
      });
    }

  },
  update_share_num(that, allpartinfo) {
    var share_user_list = []
    allpartinfo.forEach(item => {
      //有多少人是通过你分享报名的？
      //分享人是你，不能是自己参与自己的分享，不能计算重复（挂人的情况）
      if (item["share_user_id"] == app.globalData.login_userInfo["user_id"] && item["share_user_id"] != item.user_id && share_user_list.indexOf(item.user_id) == -1) {
        share_user_list.push(item.user_id)
      }
    })
    console.log(share_user_list);
    that.setData({
      share_num: share_user_list.length
    })
  },
  update_part_info(that, res) {
    console.log("成员信息" + res.data);
    var result = res.data;
    console.log(result["avatarUrl_list"]);

    console.log(result["user_info_part_info_list"]);
    var user_info_list = result["user_info_list"];
    console.log(user_info_list.length);
    var num = user_info_list.length;
    //这么搞才能刷新绑定的数据，不然不会刷新，似乎跟当初渲染的方式有关
    var activity_info = that.data.activity_info;
    activity_info["member"] = num;
    var partinfo = activity_info.partinfo.concat([]);
    console.log(partinfo)
    var empty_group_tag_dict = true;
    for (var key in activity_info.group_tag_dict) {
      empty_group_tag_dict = false;
      break
    }
    that.setData({
      partinfo: partinfo,
      empty_group_tag_dict: empty_group_tag_dict
    })

    var avatarUrl_list = result["avatarUrl_list"];


    //测试用，创建20个参与人员
    var info = result["user_info_part_info_list"];
    //更新分享参与人数
    that.update_share_num(that, info);
    var all_group_tag_dict = {};
    var ungroup_partinfo_list = [];
    var member_users = {};
    var part_member_num = "";
    var part_group_tag = "";
    var login_user_part_list = [];

    console.log(info);
    //提取分组信息
    info.forEach(item => {

      if (item["group_tag"] != "" && item["group_tag"] != null) {
        console.log(item["group_tag"]);
        var tag = item["group_tag"];
        if (all_group_tag_dict[tag] != undefined) {
          all_group_tag_dict[tag].push(item);
        } else {
          all_group_tag_dict[tag] = [item];
        }
        console.log(all_group_tag_dict);
      } else {
        ungroup_partinfo_list.push(item);
      }
      if (item["user_id"] == app.globalData.login_userInfo["user_id"]) {
        console.log("是否参与")
        login_user_part_list.push(item)
      }
      //初始化成员的字典形式数据，方便wxml获取
      var member_num = item.member_num;
      member_users[member_num] = item;

      //对于重复报名的人，选择第一个member_num作为其member_num,当然首先会保证报名按照member_num或者报名时间升序排列
      //都能保证重复的报名时靠后的
      console.log("找到当前参加的编号")
      console.log(partinfo)
      console.log(part_member_num)
      if (item["user_id"] == app.globalData.login_userInfo["user_id"] && part_member_num == "") {
        console.log("已参与")
        part_member_num = item["member_num"];
        part_group_tag = item["group_tag"];
        //var partinfo = that.data.partinfo;
        //有参与编号代表已参与，已参与如果重复报名需要提供姓名，性别
        if (partinfo.indexOf("姓名") == -1) { //没找到
          partinfo.push("姓名")
        }
        if (partinfo.indexOf("性别") == -1) { //没找到
          partinfo.push("性别")
        }
        that.setData({
          part_flag: true,
          part_member_num: item["member_num"],
          partinfo: partinfo,
          part_group_tag: part_group_tag
        })
      }

    })

    //提取再分组信息
    var all_group_tag2_dict = {}
    info.forEach(item => {
      var group_tag2_list = item["group_tag2"]
      group_tag2_list.forEach(group_tag2 => {
        if (all_group_tag2_dict[group_tag2] != undefined) {
          all_group_tag2_dict[group_tag2].push(item);
        } else {
          all_group_tag2_dict[group_tag2] = [item];
        }
      })
    })
    console.log("再分组数据")
    console.log(all_group_tag2_dict)

    var all_group_tag_list = [];
    for (var group_tag in all_group_tag_dict) {
      //计算男女数量
      var boy_num = 0;
      var girl_num = 0;
      all_group_tag_dict[group_tag].forEach(item => {
        if (item.gender == "0") {
          girl_num = girl_num + 1;
        } else if (item.gender == "1") {
          boy_num = boy_num + 1;
        }
      })
      all_group_tag_list.push({
        "group_tag": group_tag,
        "group_users": all_group_tag_dict[group_tag],
        "show_flag": false,
        "boy_num": boy_num,
        "girl_num": girl_num
      });
    }
    //再分组列表
    var all_group_tag2_list = [];
    for (var group_tag in all_group_tag2_dict) {
      //计算男女数量
      var boy_num = 0;
      var girl_num = 0;
      all_group_tag2_dict[group_tag].forEach(item => {
        if (item.gender == "0") {
          girl_num = girl_num + 1;
        } else if (item.gender == "1") {
          boy_num = boy_num + 1;
        }
      })
      all_group_tag2_list.push({
        "group_tag": group_tag,
        "group_users": all_group_tag2_dict[group_tag],
        "show_flag": false,
        "boy_num": boy_num,
        "girl_num": girl_num
      });
    }
    console.log("再分组列表")
    console.log(all_group_tag2_list)
    console.log("分组信息");
    console.log(all_group_tag_dict);
    console.log(all_group_tag_list);
    var entire_part_info = [];
    //找出来预定分组但还没有人报名的分组列表
    var temp_unuse_group_tag_dict = activity_info.group_tag_dict;
    var unuse_group_tag_list = [];
    for (var group_tag in temp_unuse_group_tag_dict) {
      if (!all_group_tag_dict.hasOwnProperty(group_tag)) {
        unuse_group_tag_list.push(temp_unuse_group_tag_dict[group_tag])
      }
    }
    //for (var i = 0; i < 20; i++) {
    //entire_part_info.push(JSON.parse(JSON.stringify(info[0])));
    //}
    //console.log(entire_part_info);
    //entire_part_info.push(JSON.parse(JSON.stringify(info)));
    that.setData({
      avatarUrl_list: avatarUrl_list,
      user_info_list: user_info_list,
      ungroup_partinfo_list: ungroup_partinfo_list,
      entire_part_info: info,
      all_group_tag_list: all_group_tag_list,
      all_group_tag_dict: all_group_tag_dict,
      member_users: member_users,
      login_user_part_list: login_user_part_list,
      activity_info: activity_info,
      all_group_tag2_list: all_group_tag2_list,
      all_group_tag2_dict: all_group_tag2_dict,
      unuse_group_tag_list: unuse_group_tag_list

    });
    that.update_part_status();
  },
  random_gift() {
    var that = this;
    var entire_part_info = this.data.entire_part_info;
    var user_id_list = [];
    var member_num_list = [];
    entire_part_info.forEach(item => {
      var user_id = item.user_id;
      if (user_id_list.indexOf(user_id) == -1) {
        user_id_list.push(user_id)
        member_num_list.push(item.member_num)
      }
    })
    var random_index = Math.floor(Math.random() * user_id_list.length)
    var gift_member_num = member_num_list[random_index];
    var gift_user_info = this.data.member_users[gift_member_num];
    console.log(that.data.activity_info.activity_id)
    this.setData({
      modalName: ""
    })
    wx.showModal({
      title: '随机抽奖结果',
      content: '中奖人员是第' + gift_member_num.replace('#', '') + '号成员，昵称:' + gift_user_info['nickName'],
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          wx.showLoading({
            title: '保存中',
          })
          wx.request({
            url: app.globalData.hosturl + 'update_member_more_info', //仅为示例，并非真实的接口地址
            data: {
              "activity_id": that.data.activity_info.activity_id,
              "member_num": gift_member_num,
              "info_key": "gift",
              "info_value": "已中奖"
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              wx.hideLoading();
              if (res.data.code == 200) {
                wx.showToast({
                  title: res.data.result,
                  icon: "success",
                  duration: 1000
                })
                //that.init_activity_all_info(that.data.activity_info);
              } else {
                wx.showToast({
                  title: res.data.result,
                  icon: "error",
                  duration: 1000
                })
              }

            },
            fail(res) {
              wx.hideLoading();
            }
          });
        }
      }
    })

  },
  chat(e) {
    console.log(e.currentTarget.dataset.membernum);
    var membernum = e.currentTarget.dataset.membernum;
    if (this.data.member_users[membernum]["user_id"] == app.globalData.login_userInfo["user_id"])
      return;
    var friend_user_info = {};
    friend_user_info["user_id"] = this.data.member_users[membernum]["user_id"]
    friend_user_info["avatarUrl"] = this.data.member_users[membernum]["avatarUrl"]
    friend_user_info["gender"] = this.data.member_users[membernum]["gender"]
    friend_user_info["nickName"] = this.data.member_users[membernum]["nickName"]
    friend_user_info["signature"] = this.data.member_users[membernum]["signature"]
    wx.navigateTo({
      url: '../user/userinfo?userinfo=' + encodeURIComponent(JSON.stringify(friend_user_info)),
    });

  },
  chat_with(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var chat_user_info = this.data.user_info_list[index];
    if (chat_user_info["user_id"] != app.globalData.login_userInfo["user_id"]) {
      wx.navigateTo({
        url: '../chat/chat?friend_user_info=' + encodeURIComponent(JSON.stringify(chat_user_info)),
      });

    }

  },
  qrcode() {
    this.setData({
      modalName: ""
    })
    wx.navigateTo({
      url: 'qrcode?activity_id=' + this.data.activity_info.activity_id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  choosesex(e) {
    var value = e.currentTarget.dataset.sex;
    var info = this.data.partinfoinput;
    info["性别"] = value;
    this.setData({
      partinfo_sex: value,
      partinfoinput: info
    });
  },
  PickerChange(e) {
    console.log(e);
    var info = this.data.partinfoinput;
    info["自评等级"] = this.data.picker[e.detail.value];
    this.setData({
      picker_index: e.detail.value,
      partinfoinput: info
    });
  },
  listenCheckboxChange(e) {
    console.log('当checkbox-group中的checkbox选中或者取消是我被调用');
    //打印对象包含的详细信息
    console.log(e.detail.value); //数组
    var cancel_part_members = e.detail.value;
    this.setData({
      cancel_part_members: cancel_part_members
    })
  },
  confirm_cancel_part() {
    var that = this;
    wx.showLoading({
      title: '取消报名...',
    })
    wx.request({
      url: app.globalData.hosturl + 'delete_member', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "cancel_part_members": that.data.cancel_part_members,
        "begintime": that.data.activity_info["begintime"],
        "activity_tag": that.data.activity_info["activity_tag"]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.update_part_info(that, res);

        wx.hideLoading();
      }
    });
    this.setData({
      modalName: "",
      cancel_part_members: []
    })
  },
  cancel_part() {
    console.log("取消报名");
    if (this.data.login_user_part_list.length > 1) {
      this.setData({
        modalName: "Modal_cancel_part"
      })
      return
    } else {
      var cancel_part_members = this.data.cancel_part_members;
      cancel_part_members.push(this.data.login_user_part_list[0]["member_num"])
      this.setData({
        cancel_part_members
      });
      this.confirm_cancel_part()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log("onshow加载");
    
    //这是针对选择分组成员之后的数据更新，从partuser界面返回
    var edit_group_user = app.globalData.edit_group_user;
    var current_edit_group = this.data.current_edit_group;
    var ungroup_partinfo_list = this.data.ungroup_partinfo_list;
    var new_ungroup_partinfo_list = [];
    console.log(edit_group_user);
    console.log(current_edit_group);
    console.log(typeof (edit_group_user));
    ungroup_partinfo_list.forEach(item => {
      console.log(item);
      if (edit_group_user.includes(item["member_num"].toString())) {
        current_edit_group.push(item);
      } else {
        new_ungroup_partinfo_list.push(item);
      }
    });

    //针对再分组的数据更新，从partuser页面而来
    var re_group_users = app.globalData.re_group_users;
    console.log(re_group_users)
    if (re_group_users.hasOwnProperty("group_tag")) {
      console.log("检测到了再分组数据")
      if (this.data.all_group_tag_dict.hasOwnProperty(re_group_users.hasOwnProperty("group_tag"))) {
        console.log("再分组的tag是重复的,这种不应该处理,刷新即可")
        wx.showToast({
          title: '再分组数据请刷新',
          icon: 'none'
        })
      } else {
        //要在all_group_tag_dict/all_group_tag_list中进行更新数据
        var all_group_tag2_dict = this.data.all_group_tag2_dict;
        var all_group_tag2_list = this.data.all_group_tag2_list;
        var group_users_list = re_group_users["group_users"]
        //group_users_list里面的元素都是这种
        //temp["member_num"] = item.member_num;
        //temp["group_tag2"] = this.data.group_tag;
        var boy_num = 0;
        var girl_num = 0;
        var group_tag2 = ""
        console.log(typeof (all_group_tag2_dict))
        group_users_list.forEach(item => {
          if (item["group_tag2"] in all_group_tag2_dict) {
            all_group_tag2_dict[item["group_tag2"]].push(this.data.member_users[item["member_num"]])
          } else {
            group_tag2 = item["group_tag2"]
            all_group_tag2_dict[item["group_tag2"]] = [this.data.member_users[item["member_num"]]]
          }
          if (this.data.member_users[item["member_num"]].gender == "0") {
            girl_num = girl_num + 1;
          } else if (this.data.member_users[item["member_num"]].gender == "1") {
            boy_num = boy_num + 1;
          }
        })

        all_group_tag2_list.push({
          "group_tag": group_tag2,
          "group_users": all_group_tag2_dict[group_tag2],
          "show_flag": false,
          "boy_num": boy_num,
          "girl_num": girl_num
        });
      }
      this.setData({
        all_group_tag2_dict: all_group_tag2_dict,
        all_group_tag2_list: all_group_tag2_list
      })
      app.globalData.re_group_users = {}
    }
    console.log(app.globalData.modalName)
    console.log(app.globalData.modalName != "")
    this.setData({
      current_edit_group: current_edit_group,
      hidden_del_tag: true,
      ungroup_partinfo_list: new_ungroup_partinfo_list,

    });
    if (app.globalData.modalName == "share_tip_modal") {
      this.setData({
        modalName: "share_tip_modal"
      })
    }
    app.globalData.modalName = "";
    console.log(current_edit_group);
    app.globalData.edit_group_user = []; //app只短暂存储编辑选择的分组成员
    this.update_save_group_button_status();
    //重新加载见闻的图片记录
    if (app.globalData.reload_activity_share_moods == true) {
      app.globalData.reload_activity_share_moods = false;
      share.get_activity_moods(app.globalData.hosturl, this, this.data.activity_info.activity_id);
    }
    this.getuserinfo()
    var that = this;
    if (this.data.recommend_list.length == 0) {
      setTimeout(function () {
        that.get_recommand_list()
      }, 5000)
    }
  },
  free_part() {
    this.setData({
      modalName: "free_part_modal"
    })
    //this.generateShareImage();
  },
  getuserinfo() {
    try {
      console.log("用户登录");
      //直接获取缓存保存的
      var openid = wx.getStorageSync('openid');
      console.log(openid)
      var that = this;
      if (openid == "" || openid == undefined) {
        console.log("需要登录获取openid")
        this.user_login();
      } else {
        //发起网络请求
        wx.request({
          url: app.globalData.hosturl + 'get_userinfo',
          data: {
            "user_id": openid
          },
          success: (res) => {
            console.log("获取用户信息")
            console.log(res.data)
            app.globalData.openid = res.data.user_id;
            app.globalData.checking_flag = res.data.checking_flag;
            app.globalData.login_userInfo = res.data;
            app.globalData.hasUserInfo = true;
            that.setData({
              userinfo: res.data,
              checking_flag: res.data.checking_flag,
            });
          }
        })
      }
    } catch (e) {
      console.log("持久化登录信息获取失败");
      console.log(e);
    }
  },

  user_login() {
    util.get_open_id(app, this);
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
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    //chooseLocation.setLocation(null);
    wx.offCopyUrl();
  },
  set_part_limit() {
    var part_limit = 1; //限制参与
    var share_user_id = this.data.share_user_id;
    if (this.data.activity_info["part_limit"] == 1) { //"通过发起人和成员分享可以参与"
      this.data.user_info_list.forEach(item => {
        console.log(item);
        if (item["user_id"] == share_user_id) { //成员
          part_limit = 0; //不限制参与
          //break;
        }
      });
      if (this.data.activity_user_info["user_id"] == share_user_id) {
        part_limit = 0; //不限制参与
      }
    } else if (this.data.activity_info["part_limit"] == 2) { //"通过发起人分享可以参与"
      if (this.data.activity_user_info["user_id"] == share_user_id) {
        part_limit = 0; //不限制参与
      }

    } else if (this.data.activity_info["part_limit"] == 0) { //"所有人均可参与"
      part_limit = 0; //不限制参与
    }
    this.setData({
      part_limit: part_limit
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data.activity_info.activity_status)
    console.log(typeof (this.data.activity_info.activity_status))
    if (this.data.activity_info.activity_status < 200) {
      console.log("没进来？")
      return {
        title: this.data.activity_info.activity_status_comment,
        path: '/pages/index/newindex',
      }
    }
    var activity_info = {}
    activity_info["activity_id"] = this.data.activity_info["activity_id"]
    activity_info["activity_tag"] = this.data.activity_info["activity_tag"]
    activity_info["createuser"] = {
      "user_id": this.data.activity_info["createuser"]["user_id"]
    }
    activity_info = encodeURIComponent(JSON.stringify(activity_info));
    console.log("小程序分享onShareAppMessage");
    //var share_res_limit = this.get_share_limit();//0不限制参与，1限制参与
    var share_user_id = "";
    if (app.globalData.login_userInfo.hasOwnProperty("user_id")) {
      share_user_id = app.globalData.login_userInfo["user_id"];
    } else {
      console.log("用户未登录，无法获取用户信息");
    }
    let activity_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    console.log(this.data.modalName)
    if (this.data.modalName == "free_part_modal" && this.data.activity_info.activity_status != 201) {
      console.log("分享")
      return {
        title: "「" + this.data.activity_info["pay_type"] + "」" + this.data.activity_info["title"],
        desc: '自定义分享描述',
        path: '/pages/activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info + "&share_user_id=" + share_user_id + "&current_swiper_item_index=" + this.data.current_swiper_item_index,
        imageUrl: this.data.activity_info.bg_url,
        success: function (res) {
          if (res.errMsg == 'shareAppMessage:ok') {
            console.log("成功", res)
          }
        },
        fail: function (res) {
          console.log("失败", res)
        },

      }
    }
    return {
      title: "「" + this.data.activity_info["pay_type"] + "」" + this.data.activity_info["title"],
      //desc: '自定义分享描述',
      path: '/pages/activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info + "&share_user_id=" + share_user_id + "&current_swiper_item_index=" + this.data.current_swiper_item_index,
      //path: '/pages/activityshowinfo/activityshowinfo?' + "activity_info=" + activity_info + "&share_user_id=" + share_user_id + "&current_swiper_item_index=" + this.data.current_swiper_item_index,
      //path: '/pages/activityshowinfo/activityshowinfo',
      //imageUrl:bgurl,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log("成功", res)
        }
      },
      fail: function (res) {
        console.log("失败", res)
      },

    }
  },
  //
  partinfoInput(event) {
    var partinfokey = event.target.dataset.value
    var partinfovalue = event.detail.value;
    //var json = {partinfokey:partinfovalue};
    var info = this.data.partinfoinput;
    info[partinfokey] = partinfovalue
    this.setData({
      partinfoinput: info
    });
    console.log(info);
  },
  radioChange: function (e) {
    console.log('你选择的是：', e.detail.value);
    this.setData({
      pay_type:e.detail.value
    })
  },
  part_activity() {
    var that = this;
    //提前判断报名限制再跳转
    if (this.data.part_limit != 0 && this.data.activity_user_info["user_id"] != app.globalData.login_userInfo["user_id"]) {
      wx.showToast({
        title: '请通过分享报名',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    //如果是简单的不需要填写信息，直接报名不跳转,要填写报名信息那就跳转到报名页面
    if (this.data.partinfo.length != 0 || !this.data.empty_group_tag_dict) {
      var activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));
      var partinfo = encodeURIComponent(JSON.stringify(this.data.partinfo));
      var all_group_tag_dict = encodeURIComponent(JSON.stringify(this.data.all_group_tag_dict));
      wx.navigateTo({
        url: 'partactivity?activity_info=' + activity_info + '&&partinfo=' + partinfo + '&&all_group_tag_dict=' + all_group_tag_dict + '&&part_limit=' + this.data.part_limit + '&&share_user_id=' + this.data.share_user_id,
      })
      return;
    }
    //根据账户余额决定是否弹出余额支付选项
    if(app.globalData.login_userInfo["total_money"] >= this.data.activity_info.pay_price&&this.data.modalName!="payoptions"&&this.data.activity_info.pay_price>0){
      //足够个人账户支付
      this.setData({
        modalName:"payoptions",
        pay_type:"balancepayment"
      })
      return
    }

    //["通过发起人分享可以参与","通过发起人和成员分享可以参与","所有人均可参与"]

    if (!util.check_login(app)) {
      return;
    }

    if (this.data.part_limit != 0 && this.data.activity_user_info["user_id"] != app.globalData.login_userInfo["user_id"]) {
      wx.showToast({
        title: '请通过分享报名',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    var info = this.data.partinfoinput;
    //info["自评等级"] = this.data.picker[this.data.picker_index];
    //this.setData({
    //partinfoinput: info
    //});
    console.log(info)
    console.log(this.data.partinfo)
    if (this.data.partinfo.indexOf("自评等级") != -1) {
      if (!info.hasOwnProperty("自评等级")) {
        info["自评等级"] = this.data.picker[0]
      }
    }
    if (Object.keys(info).length != this.data.partinfo.length) {
      wx.showToast({
        title: '请填写报名信息',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    wx.showLoading({
      title: '报名中...',
    })
    wx.request({
      url: app.globalData.hosturl + 'pay_miniprog', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_info.activity_id,
        "user_id": app.globalData.login_userInfo["user_id"],
        "title": this.data.activity_info.title,
        "partinfo": JSON.stringify(info),
        "latitude": this.data.activity_info.latitude,
        "longitude": this.data.activity_info.longitude,
        "activity_tag": this.data.activity_info.activity_tag,
        "group_tag": this.data.select_group_tag,
        "pay_price": this.data.activity_info.pay_price,
        "share_user_id": this.data.share_user_id,
        "pay_type":this.data.pay_type
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //that.update_part_info(that,res);
        console.log("商户server调用支付统一下单")
        console.log(res.data.result);
        wx.hideLoading();
        if (res.data.code == 0) {
          wx.requestPayment({
            'timeStamp': res.data.result.timeStamp,
            'nonceStr': res.data.result.nonceStr,
            'package': res.data.result.package,
            'signType': res.data.result.signType,
            'paySign': res.data.result.paySign,
            'success': function (res) {
              // 进行逻辑判断
              console.log("成功支付")
              wx.showToast({
                title: '报名成功',
                icon: "success",
                duration: 2000
              })
              console.log(that.data.activity_info.discount)
              if (that.data.activity_info.discount > 0) {
                that.setData({
                  modalName: "share_tip_modal"
                })
              }

              wx.request({
                url: app.globalData.hosturl + 'get_member_user_id_pay_status', //仅为示例，并非真实的接口地址
                data: {
                  "activity_id": that.data.activity_info.activity_id,
                  "user_id": app.globalData.login_userInfo["user_id"]
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  console.log(res.data)
                },
                fail(res) {

                }
              });
              setTimeout(function () {
                that.init_activity_all_info(that.data.activity_info);
              }, 1500)
            },
            'fail': function (res) {
              console.log("取消支付")
              console.log(res)
            },
            'complete': function (res) {
              //接口调用结束的回调函数（调用成功、失败都会执行）
              console.log("支付")
            }
          })
        } else if (res.data.code == 1) {
          wx.showToast({
            title: '报名成功',
            icon: "success",
            duration: 2000
          })
          setTimeout(function () {
            that.init_activity_all_info(that.data.activity_info);
          }, 1500)

          console.log("免费报名")

        } else {
          wx.showToast({
            title: res.data.result,
            icon: "error",
            duration: 2000
          })
        }


      },
      fail(res) {
        wx.showToast({
          title: "服务器异常",
          icon: "error"
        })
      }
    });
    this.setData({
      modalName:""
    })

  },

  show_info_modal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  show_more_options_modal(e) {
    if (this.data.modalName == 'DialogModal-moreoptions') {
      this.setData({
        modalName: ""
      })
    } else {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  update_activity_announcement() {
    var that = this;
    this.setData({
      modalName: null
    })
    wx.request({
      url: app.globalData.hosturl + 'update_activity_announcement', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_info.activity_id,
        "announcement": this.data.announcement
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //that.update_part_info(that,res);
        console.log(res.data.announcement);
        that.setData({
          new_announcement: res.data.announcement
        });

      },
      fail(res) {
        wx.showToast({
          title: "网路异常",
          icon: "error"
        })
      }
    });

  },
  detailInput(e) {
    this.setData({
      announcement: e.detail.value
    })
  },
  onShareTimeline() {
    let activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));
    console.log("小程序分享onShareTimeline");
    //var share_res_limit = this.get_share_limit();//0不限制参与，1限制参与
    var share_user_id = "";
    if (app.globalData.login_userInfo.hasOwnProperty("user_id")) {
      share_user_id = app.globalData.login_userInfo["user_id"];
    } else {
      console.log("用户未登录，无法获取用户信息");
    }
    let activity_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    return {
      title: this.data.activity_info["title"],
      //desc: '自定义分享描述',
      path: '/pages/activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info + "&share_user_id=" + share_user_id,
      //imageUrl:bgurl,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log("成功", res)
        }
      },
      fail: function (res) {
        console.log("失败", res)
      }
    }
  },
  edit_group_tag(e) {
    console.log("分组标签" + e.detail.value);
    var group_tag = e.detail.value.trim();
    this.setData({
      group_tag: e.detail.value.trim()
    });
    this.update_save_group_button_status();
  },
  edit_group_room(e) {
    console.log("分组标签" + e.detail.value);
    var group_room = e.detail.value.trim();
    this.setData({
      group_room: e.detail.value.trim()
    });
    this.update_save_group_button_status();
  },
  edit_group_limit(e) {
    console.log("分组标签" + e.detail.value);
    var group_limit = e.detail.value.trim();
    this.setData({
      group_limit: e.detail.value.trim()
    });
    this.update_save_group_button_status();
  },
  update_save_group_button_status() {
    console.log("update_save_group_button_status分组标签：" + this.data.group_name);
    if (this.data.group_tag == "" || this.data.group_room == "" || this.data.group_limit == "" || this.data.current_edit_group.length == 0) {
      this.setData({
        disable_save_group: true
      })
    } else {
      this.setData({
        disable_save_group: false
      })
    }
  },
  //对成员进行重复的分组，针对小组赛--晋级赛--半决赛决赛这种场景
  //小组赛出线的成员，继续分组PK，分组完进行xx强赛直至决赛
  re_group_member() {
    let ungroup_partinfo_list = encodeURIComponent(JSON.stringify(this.data.entire_part_info));
    wx.navigateTo({
      url: 'partuser?ungroup_partinfo_list=' + ungroup_partinfo_list + '&&re_group_flag=' + true + '&&member_users=' + encodeURIComponent(JSON.stringify(this.data.member_users)) + '&&activity_info=' + encodeURIComponent(JSON.stringify(this.data.activity_info)),
    })
  },
  //添加分组成员
  add_group_member() {
    if (this.data.ungroup_partinfo_list.length == 0) {
      wx.showToast({
        title: '活动成员已全部分组',
        icon: "none"
      })
      return;
    }
    let ungroup_partinfo_list = encodeURIComponent(JSON.stringify(this.data.ungroup_partinfo_list));

    wx.navigateTo({
      url: 'partuser?ungroup_partinfo_list=' + ungroup_partinfo_list,
    })
  },
  edit_group_member() {
    this.setData({
      hidden_del_tag: false
    })
  },
  del_group_member(e) {
    console.log(e.currentTarget.dataset.num);
    var member_num = e.currentTarget.dataset.num;
    console.log(typeof (member_num)); //number
    var new_current_edit_group = [];
    var ungroup_partinfo_list = this.data.ungroup_partinfo_list;
    this.data.current_edit_group.forEach(item => {
      if (item["member_num"] != member_num) {

        new_current_edit_group.push(item);
      } else {
        console.log(item["member_num"] + "被删")
        ungroup_partinfo_list.push(item);
      }
    })
    this.setData({
      current_edit_group: new_current_edit_group,
      ungroup_partinfo_list: ungroup_partinfo_list
    })
  },
  edit_group() {
    this.setData({
      edit_group_flag: !this.data.edit_group_flag,
      current_edit_group: [],
      pre_edit_group: [],
      edit_group_tag_dict: {},
      group_tag: "",
      group_room: "",
      group_limit: "",
      disable_save_group: true,
      hidden_del_tag: true
    })
    app.globalData.edit_group_user = []
  },

  show_admin_modal() {
    var timestamp = new Date().getTime();
    console.log(timestamp)
    timestamp = Math.floor(timestamp / 1000)
    console.log(typeof (timestamp))
    var store_admin_timestamp = wx.getStorageSync("set_admin_timestamp");

    console.log(store_admin_timestamp)
    if (store_admin_timestamp == "" || store_admin_timestamp == undefined || (timestamp - Number(store_admin_timestamp) > 7776000)) {
      wx.showModal({
        title: '管理员说明',
        content: '管理员可以在对局页面,操作新增对阵和记录比分等信息；\r\n\r\n如果分组未指定管理员,则所有分组成员均可以操作新增对阵和记录比分！',
        complete: (res) => {
          if (res.cancel) {

          }

          if (res.confirm) {
            wx.setStorageSync('set_admin_timestamp', timestamp);
          }
        }
      })
    }
  },
  delete_member(e) {
    console.log("移除成员");
    var that = this;
    that.setData({
      modalName: ""
    })
    wx.showModal({
      title: '取消报名资格',
      content: '如果人员产生费用将自动退款。\r\n并且涉及的数据记录将自动删除。',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          wx.showLoading({
            title: '取消中',
          })
          var membernum = e.currentTarget.dataset.membernum;
          var cancel_part_members = [membernum]
          wx.request({
            url: app.globalData.hosturl + 'delete_member', //仅为示例，并非真实的接口地址
            data: {
              "activity_id": that.data.activity_info.activity_id,
              "cancel_part_members": cancel_part_members,
              "begintime": that.data.activity_info.begintime,
              "activity_tag": that.data.activity_info["activity_tag"]
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              that.update_part_info(that, res);
              wx.hideLoading()
            }
          });
        }
      }
    })

  },
  clear_group(e) {
    var that = this;
    console.log(e.currentTarget.dataset.tag);
    var group_tag = e.currentTarget.dataset.tag;
    var current = this.data.all_group_tag_dict[group_tag];
    var group_users = []
    current.forEach(item => {
      var temp = {}
      temp["member_num"] = item["member_num"]
      temp["group_tag"] = ""
      group_users.push(temp)
    })
    //更新成员对应的分组标签
    wx.request({
      url: app.globalData.hosturl + 'edit_part_user_group', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": this.data.activity_info.activity_id,
        "group_users": group_users,
        "activity_tag": this.data.activity_info.activity_tag
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        app.globalData.edit_group_user = [];
        app.globalData.group_sel_values = [];

        that.update_part_info(that, res);
      }
    })

    //更新活动的分组列表
    wx.request({
      url: app.globalData.hosturl + 'update_activity_group_tag_dict', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "old_group_tag": group_tag,
        "new_group_tag_dict": {}
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data != "") {
          var activity_info = that.data.activity_info;
          activity_info.group_tag_dict = res.data;
          that.setData({
            activity_info: activity_info
          })
        }

      }
    })
  },
  clear_re_group(e) {
    wx.showModal({
      title: '解散分组',
      content: '确认解散「' + e.currentTarget.dataset.tag + '」分组吗？已有对局数据将会保留！',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          var that = this;
          console.log(e.currentTarget.dataset.tag);
          var group_tag = e.currentTarget.dataset.tag;
          var current = this.data.all_group_tag2_dict[group_tag];
          var group_users = []
          current.forEach(item => {
            var temp = {}
            temp["member_num"] = item["member_num"]
            temp["group_tag2"] = group_tag
            group_users.push(temp)
          })
          //更新成员对应的分组标签
          wx.request({
            url: app.globalData.hosturl + 'clear_re_group_member', //仅为示例，并非真实的接口地址
            data: {
              "activity_id": this.data.activity_info.activity_id,
              "group_users": group_users,
              "activity_tag": this.data.activity_info.activity_tag
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              that.update_part_info(that, res);
            }
          })
        }
      }
    })


  },
  save_group() {
    console.log("保存分组");
    wx.showLoading({
      title: '',
    })
    console.log(this.data.current_edit_group);
    var that = this;
    var group_tag = this.data.group_tag;
    var group_users = this.data.current_edit_group;
    console.log(group_users[0].group_tag);
    var pre_group_users = this.data.pre_edit_group;
    var old_group_tag = "";
    if (pre_group_users.length > 0) {
      old_group_tag = pre_group_users[0].group_tag;
    }
    var new_group_tag_dict = {
      "name": group_tag,
      "room": this.data.group_room,
      "limit": this.data.group_limit
    }
    var params = [];

    pre_group_users.forEach(item => {
      console.log("先跑这里了？" + item["group_tag"]);
      item["group_tag"] = "";
    })
    console.log("查看pre_group_users处理之后的状态");
    console.log(group_users);
    group_users.forEach(item => {
      item["group_tag"] = group_tag;
    })
    group_users.forEach(item => {
      var temp = {};
      temp["member_num"] = item.member_num;
      temp["group_tag"] = item.group_tag;
      params.push(temp);
    })
    pre_group_users.forEach(item => {
      var temp = {};
      temp["member_num"] = item.member_num;
      temp["group_tag"] = item.group_tag;
      params.push(temp);
    })
    console.log(group_users);
    console.log(params);

    console.log("编辑分组")
    //更新成员对应的分组标签
    wx.request({
      url: app.globalData.hosturl + 'edit_part_user_group', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "group_users": JSON.stringify(params),
        "activity_tag": that.data.activity_info.activity_tag
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        app.globalData.edit_group_user = [];
        app.globalData.group_sel_values = [];
        that.setData({
          current_edit_group: [],
          group_tag: ""
        });
        that.update_part_info(that, res);
      }
    })
    //更新活动的分组列表
    wx.request({
      url: app.globalData.hosturl + 'update_activity_group_tag_dict',
      data: {
        "activity_id": that.data.activity_info.activity_id,
        "old_group_tag": old_group_tag,
        "new_group_tag_dict": new_group_tag_dict
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data != "") {
          var activity_info = that.data.activity_info;
          activity_info.group_tag_dict = res.data;
          that.setData({
            activity_info: activity_info
          })
        }

      }
    })
    that.setData({
      group_tag: "",
      group_room: "",
      group_limit: "",
      disable_save_group: true,
      edit_group_flag: false
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
  },
  edit_completed_group(e) {
    console.log(e.currentTarget.dataset.tag);
    var group_tag = e.currentTarget.dataset.tag;
    var current = this.data.all_group_tag_dict[group_tag];
    var edit_group_tag_dict = this.data.activity_info["group_tag_dict"][group_tag]
    console.log(current);
    this.setData({
      edit_group_flag: !this.data.edit_group_flag,
      current_edit_group: current,
      pre_edit_group: current,
      edit_group_tag_dict: edit_group_tag_dict,
      group_tag: group_tag,
      group_room: edit_group_tag_dict["room"],
      group_limit: edit_group_tag_dict["limit"],
      disable_save_group: false,
      hidden_del_tag: true
    })
    app.globalData.edit_group_user = []
    console.log(this.data.current_edit_group);
  },
  pk_page() {
    console.log(this.data.part_group_tag);
    var group_tag = this.data.part_group_tag;
    var groups = "";
    var room = "暂定"
    if (group_tag == "") {
      groups = this.data.ungroup_partinfo_list;
      room = this.data.activity_info.room == "" ? "暂定" : this.data.activity_info.room
    } else {
      groups = this.data.all_group_tag_dict[group_tag];
      room = this.data.activity_info.group_tag_dict["room"] == "" ? "暂定" : this.data.activity_info.group_tag_dict["room"]
    }
    //all_group_tag_dict
    let group_users = encodeURIComponent(JSON.stringify(groups));
    this.setData({
      modalName: ""
    })
    wx.navigateTo({
      url: 'pkpage?group_users=' + group_users + '&&group_tag=' + group_tag + '&&activity_id=' + this.data.activity_info.activity_id + '&&activity_info=' + encodeURIComponent(JSON.stringify(this.data.activity_info)) + '&&room=' + room + '&&member_users=' + encodeURIComponent(JSON.stringify(this.data.member_users))
    })
  },
  re_group_pk_page(e) {
    console.log(e.currentTarget.dataset.tag);
    var group_tag = e.currentTarget.dataset.tag;
    var groups = "";
    var room = ""

    groups = this.data.all_group_tag2_dict[group_tag];


    //all_group_tag_dict
    let group_users = encodeURIComponent(JSON.stringify(groups));
    this.setData({
      modalName: ""
    })
    wx.navigateTo({
      url: 'pkpage?group_users=' + group_users + '&&group_tag=' + group_tag + '&&activity_id=' + this.data.activity_info.activity_id + '&&activity_info=' + encodeURIComponent(JSON.stringify(this.data.activity_info)) + '&&room=' + room + '&&member_users=' + encodeURIComponent(JSON.stringify(this.data.member_users))
    })
  },
  requestpartner() {
    wx.navigateTo({
      url: 'requestpartner?member_users=' + encodeURIComponent(JSON.stringify(this.data.member_users)) + '&&part_member_num=' + this.data.part_member_num + '&&activity_info=' + encodeURIComponent(JSON.stringify(this.data.activity_info))
    })
  },
  refund_some() {
    this.setData({
      modalName: ""
    })
    wx.navigateTo({
      url: 'refund?member_users=' + encodeURIComponent(JSON.stringify(this.data.member_users)) + '&&part_member_num=' + this.data.part_member_num + '&&activity_info=' + encodeURIComponent(JSON.stringify(this.data.activity_info))
    })
  },

  all_pk_page() {
    this.setData({
      modalName: ""
    })
    var group_tag = "";
    var room = "暂定"
    //all_group_tag_dict
    let group_users = encodeURIComponent(JSON.stringify(this.data.entire_part_info));

    wx.navigateTo({
      url: 'pkpage?group_users=' + group_users + '&&group_tag=' + group_tag + '&&activity_id=' + this.data.activity_info.activity_id + '&&activity_info=' + encodeURIComponent(JSON.stringify(this.data.activity_info)) + '&&room=' + room + '&&member_users=' + encodeURIComponent(JSON.stringify(this.data.member_users))
    })
  },

  like(e) {
    var like_member_group = e.currentTarget.dataset.likemembergroup;
    var part_member_num = this.data.part_member_num;
    var that = this;
    var url = ""; //去点赞
    var like_dict = this.data.like_dict;
    if (!like_dict.hasOwnProperty(like_member_group)) {
      like_dict[like_member_group] = {
        "like_flag": false,
        "member_nums": []
      };
    }
    var member_nums = like_dict[like_member_group]["member_nums"];
    if (like_dict[like_member_group]["like_flag"] == true) {
      url = "del_activity_member_like" //取消点赞
      like_dict[like_member_group]["like_flag"] = false;
      member_nums.splice(member_nums.indexOf(part_member_num), 1) //删除
    } else {
      url = "like_activity_member"; //去点赞
      like_dict[like_member_group]["like_flag"] = true;
      member_nums.push(part_member_num) //新增
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
  ViewImagebg(e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
      current: e.currentTarget.dataset.url
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onScrollRefresh() {
    console.log("下拉刷新" + this.data.triggered)
    var that = this;
    setTimeout(function () {
      that.setData({
        triggered: false
      })
    }, 2000);
    this.init_activity_all_info(this.data.activity_info);
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.mood_img_list,
      current: e.currentTarget.dataset.url
    });
  },
  listenRadioChange(e) {
    console.log(e.detail.value);
    var sel_value = e.detail.value;
    this.setData({
      select_group_tag: sel_value
    })
  },
  chat_with_creater() {
    if (this.data.activity_user_info["user_id"] == app.globalData.login_userInfo["user_id"])
      return;
    let friend_user_info = encodeURIComponent(JSON.stringify(this.data.activity_user_info));
    wx.navigateTo({
      //url: '../chat/chat?friend_user_info=' + friend_user_info,
      url: '../user/userinfo?userinfo=' + friend_user_info,
    });
  },
  change_tab(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      current_swiper_item_index: tab
    })
  },
  show_userinfo(e) {
    var member_num = e.currentTarget.dataset.membernum;
    var userinfo = {}
    userinfo["nickName"] = this.data.member_users[member_num]["nickName"]
    userinfo["signature"] = this.data.member_users[member_num]["signature"]
    userinfo["user_id"] = this.data.member_users[member_num]["user_id"]
    userinfo["gender"] = this.data.member_users[member_num]["gender"]
    if (this.data.member_users[member_num]["user_id"] == app.globalData.login_userInfo["user_id"])
      return;
    let friend_user_info = encodeURIComponent(JSON.stringify(userinfo));
    wx.navigateTo({
      url: '../user/userinfo?userinfo=' + friend_user_info,
    });
  },
  show_point_desc() {
    var activity_tag = this.data.activity_info.activity_tag;
    //var hobby_point = this.data.member_users[this.data.part_member_num].hobby_info.hobby_point;
    wx.navigateTo({
      url: 'pointdesc',
    })
  },
  delete_activity() {
    this.setData({
      modalName: ""
    })
    manage_activity.delete_activity(this, this.data.activity_info["activity_id"], app.globalData.hosturl, app)
  },
  get_init_msg() {
    const that = this;
    var chat_msgs = [];
    wx.request({
      url: app.globalData.hosturl + 'get_init_msg', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": that.data.activity_info.activity_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data != "fail") {

          console.log("聊天消息数量" + res.data.length);
          res.data.forEach(element => {
            console.log(element);
            chat_msgs.unshift(element);
          });


          that.setData({
            chat_msgs: chat_msgs,
            scrollTop: 0
          });
        }
      }
    });
  },
  show_chat_input() {
    this.setData({
      is_display: true
    })
  },
  scroll(e) {
    console.log(e.detail)
    this.setData({
      is_focus: false,
      is_display: false
    })
  },
  onblurkey() {
    console.log("onblurkey");
    this.setData({
      is_focus: false,
      is_display: false
    })
  },
  inputMsg: function (e) {
    this.setData({
      inputMsg: e.detail.value
    });
  },
  sendMsg() {
    console.log(this.data.inputMsg);
    var send = this.data.inputMsg.trim();
    if (send == "") {
      this.setData({
        inputMsg: ""
      });
      return;
    }
    var activity_id = this.data.activity_info.activity_id;
    var chat_msgs = this.data.chat_msgs;
    chat_msgs.push({
      "activity_id": activity_id,
      "chatmsg": send,
      "id": 1,
      "msgtime": new Date().getTime() + "",
      "nickName": app.globalData.login_userInfo["nickName"],
      "user_id": app.globalData.login_userInfo["user_id"]
    });
    var top = chat_msgs.length * 100;
    this.setData({
      chat_msgs: chat_msgs,
      scrollTop: top
    });

    wx.request({
      url: app.globalData.hosturl + 'push_activity_chat_msg', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "nickName": app.globalData.login_userInfo["nickName"],
        "user_id": app.globalData.login_userInfo["user_id"],
        "new_chat_msg": send
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

      }
    });

    this.setData({
      inputMsg: ""
    });
  },
  cancel_activity(e) {
    this.setData({
      modalName: ""
    })
    var that = this;
    wx.showModal({
      title: '取消活动',
      content: '确认取消活动吗？',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          manage_activity.cancel_activity(that, that.data.activity_info["activity_id"], app.globalData.hosturl, app)
        }
      }
    })

  },
  refund_all_member(e) {
    this.setData({
      modalName: ""
    })
    var that = this;
    wx.showModal({
      title: '全员全额退款',
      content: '当前总共有' + this.data.entire_part_info.length + '人报名参与，确认所有人全额退款！',
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          manage_activity.refund_all_member(this, this.data.activity_info["activity_id"], app.globalData.hosturl, app)
          setTimeout(function () {
            that.init_activity_all_info(that.data.activity_info)
          }, 2000)
        }
      }
    })

  },
  update_activity_info(e) {
    console.log("这里编辑活动？")
    this.setData({
      modalName: ""
    })
    manage_activity.update_activity_info(this.data.activity_info)

  },
  calculate_close_activity(e) {
    this.setData({
      modalName: ""
    })
    manage_activity.calculate_close_activity(that, this.data.activity_info["activity_id"], app.globalData.login_userInfo["user_id"], this.data.activity_info["activity_tag"], app.globalData.hosturl)
  },
  pkrank() {
    let activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));
    wx.navigateTo({
      url: 'pkrank?activity_info=' + activity_info,
    })
  },
  get_recommand_list() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_recommend_list',
      data: {
        "user_id": app.globalData.login_userInfo["user_id"]
      },
      success: (res) => {
        console.log("获取用户信息")
        if (res.data.code == 200) {
          that.setData({
            recommend_list: res.data.result
          })
        }
      }
    })
  },
  navigateToactivityinfo(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var actinfo = this.data.recommend_list[index];
    var activity_info = encodeURIComponent(JSON.stringify(this.data.recommend_list[index]));
    console.log(actinfo)
    console.log(actinfo.createuser)
    let activity_user_info = encodeURIComponent(JSON.stringify(actinfo.createuser));
    wx.navigateTo({
      url: '../activityshowinfo/activityshowinfo?activity_user_info=' + activity_user_info + "&activity_info=" + activity_info
    })
  },
  navigateTogoodinfo(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var goodinfo = this.data.recommend_list[index];
    var good_info = encodeURIComponent(JSON.stringify(this.data.recommend_list[index]));
    console.log(goodinfo)
    wx.navigateTo({
      url: '../good/gooddetail?good_info=' + good_info
    })
  },
  show_admin_options(e) {
    this.setData({
      modalName: "admin_modal",
      edit_member_num: e.currentTarget.dataset.membernum
    })
  },

  go_to_activityshare() {
    var admin_flag = false;
    admin_flag = (this.data.activity_info.activity_status >= 200 && this.data.activity_info.activity_status < 800 && ((!this.data.is_addend && !this.data.is_begin) || this.data.login_user_part_list.length > 0 || this.data.admin_flag)) && this.data.loading_tip == '';
    wx.navigateTo({
      url: 'activityshare?activity_id=' + this.data.activity_info.activity_id + '&admin_flag=' + admin_flag,
    })
  },
  go_to_activitymembergroup() {
    let activity_info = encodeURIComponent(JSON.stringify(this.data.activity_info));
    let activity_user_info = encodeURIComponent(JSON.stringify(this.data.activity_info.createuser));
    wx.navigateTo({
      url: 'activitymembergroup?activity_info=' + activity_info + '&&activity_user_info=' + activity_user_info,
    })
  },
  async generateShareImage() {
    console.log("自行绘制分享图")
    try {
      const query = wx.createSelectorQuery();
      const canvasNode = await new Promise((resolve, reject) => {
        query.select('#shareCanvas')
          .fields({
            node: true,
            size: true
          })
          .exec((res) => {
            if (res[0] && res[0].node) {
              resolve(res[0].node);
            } else {
              reject(new Error('未找到 canvas 节点'));
            }
          });
        console.log("找到了吗？")
      });

      const canvas = canvasNode;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      // 处理高清屏
      const pixelRatio = wx.getSystemInfoSync().pixelRatio;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      // 绘制基础图片
      const img = await this.loadImage(canvas, this.data.activity_info.bg_url);
      // 修改：计算底图宽高比（由原来的高宽比改为宽高比）
      const imgRatio = img.width / img.height;
      // 新增：计算画布的宽高比
      const canvasRatio = width / height;

      let drawWidth, drawHeight, drawX, drawY;
      // 新增：根据图片和画布宽高比判断裁剪和缩放逻辑
      if (imgRatio > canvasRatio) {
        // 图片宽高比大于画布宽高比，高度铺满画布，裁剪左右部分
        drawHeight = height;
        drawWidth = drawHeight * imgRatio;
        drawX = (width - drawWidth) / 2;
        drawY = 0;
      } else {
        // 图片宽高比小于等于画布宽高比，宽度铺满画布，裁剪上下部分
        drawWidth = width;
        drawHeight = drawWidth / imgRatio;
        drawX = 0;
        drawY = (height - drawHeight) / 2;
      }

      // 修改：使用新计算的宽高和位置绘制底图
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // 定义文字与矩形框的边距
      const textMargin = 10;
      // 定义每行文字的高度
      const lineHeight = 20;
      // 定义文字行数
      const lineCount = 3;

      // 定义圆角矩形参数，放置在地图底部且高度自适应
      const rectX = 2;
      // 根据文字内容和边距计算矩形框起始 y 坐标
      const rectY = height - (lineCount * lineHeight + 2 * textMargin);
      const rectWidth = width - 20;
      // 根据文字内容和边距计算矩形框高度
      const rectHeight = lineCount * lineHeight + 2 * textMargin;
      const borderRadius = 10;

      // 绘制带圆角的半透明矩形背景
      ctx.beginPath();
      ctx.moveTo(rectX + borderRadius, rectY);
      ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + rectHeight, borderRadius);
      ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX, rectY + rectHeight, borderRadius);
      ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY, borderRadius);
      ctx.arcTo(rectX, rectY, rectX + rectWidth, rectY, borderRadius);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // 浅白色，70% 透明度
      ctx.fill();

      // 绘制活动地点信息
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#333333';
      ctx.fillText(`活动地点: ${this.data.activity_info.show_activityaddress}`, rectX + textMargin, rectY + textMargin + lineHeight);

      // 绘制参与人数信息
      ctx.fillText(`参与人数: ${this.data.avatarUrl_list.length} /${this.data.activity_info.max_part_number}人`, rectX + textMargin, rectY + textMargin + 2 * lineHeight);

      // 绘制活动时间信息
      ctx.fillText(`活动时间: ${this.data.activity_info.activity_live}`, rectX + textMargin, rectY + textMargin + 3 * lineHeight);

      const tempFilePath = await this.canvasToTempFilePath(canvas);
      console.log("准备保存分享图")
      console.log(tempFilePath)
      this.setData({
        shareImageUrl: tempFilePath
      });
    } catch (error) {
      console.error('生成图片失败:', error);
    }
  },
  loadImage(canvas, src) {
    return new Promise((resolve, reject) => {
      const img = canvas.createImage();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  },
  canvasToTempFilePath(canvas) {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvas,
        success: res => {
          resolve(res.tempFilePath);
        },
        fail: err => {
          reject(err);
        }
      });
    });
  },
  route_chat(){
    wx.navigateTo({
      url: '/pages/routePlanning/routechat?activity_info='+encodeURIComponent(JSON.stringify(this.data.activity_info)),
    })
  }
})