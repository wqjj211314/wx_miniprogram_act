// pages/activityshowinfo/pkpage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id:"",
    group_tag:"",
    modalName: "",
    sample_group: [[[0, 1], [2, 3]], [[0, 1], [4, 5]], [[2, 3], [4, 5]], [[0, 2], [1, 3]], [[0, 4], [1, 5]], [[2, 4], [3, 5]], [[0, 3], [1, 2]], [[0, 5], [1, 4]], [[2, 5], [3, 4]]],
    group_users: [{ avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#1", nickName: "王强" },
    { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#2", nickName: "王强" },
    { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#3", nickName: "王强" },
    { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#4", nickName: "王强" },
    { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#5", nickName: "王强" },
    { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#6", nickName: "王强" }],//这是当前分组的成员，数组形式
    member_users: {
      "#1": { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#1", nickName: "王强" },
      "#2": { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#2", nickName: "王强" },
      "#3": { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#3", nickName: "王强" },
      "#4": { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#4", nickName: "王强" },
      "#5": { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#5", nickName: "王强" },
      "#6": { avatarUrl: "https://www.2week.club:5000/static/avatar/o2QXs5XL_7sbn0-XYrEhdV0DR3UA1698559698.jpg", member_num: "#6", nickName: "王强" }
    },
    pk_groups: [],
    custom_pk_group: [],
    edit_pk_group_index: 0,
    score_pk_group: [[0, 1], [2, 3]],
    pk_group_score: [],
    sort_users_score: {},
    sort_users_score_list:[],
    sort_groups_score: {},
    hidden_pk_group:false,
    hidden_score_list:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("onLoad加载");
    let group_users = JSON.parse(decodeURIComponent(options.group_users));
    let group_tag = options.group_tag;
    this.setData({
      group_users:group_users,
      group_tag:group_tag
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("onshow加载");
    var edit_group_user = app.globalData.edit_group_user;
    var edit_index = app.globalData.edit_index;
    var custom_pk_group = this.data.custom_pk_group;
    custom_pk_group[edit_index] = edit_group_user;
    app.globalData.edit_group_user = [];
    
    this.setData({
      custom_pk_group
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  show_modal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  getvs(sample){
    //[[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]]
    //[[[0], [2]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]]
    //var score = new Array(len).fill(0);
    var pk_groups = [];
    var that = this;
    sample.forEach((item) => {
      var pk_num = item.length;//几方对阵？对阵方数量
      var pk_group = [];
      item.forEach((each_group_sample) => {
        var group_user_num = each_group_sample.length;//一方出战多少人，每个对阵方几个人
        var each_group = [];
        each_group_sample.forEach((num_index)=>{
          each_group.push(that.data.group_users[num_index].member_num)
        })
        pk_group.push(each_group);
      })
      pk_group.push(new Array(pk_num).fill(0));
      pk_groups.push(pk_group);
    });
    return pk_groups;
  },
  get2v2() {
    var sample4 = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]];
    var sample5 = [[[0, 1], [2, 3]], [[0, 1], [2, 4]], [[1, 4], [2, 3]], [[0, 1], [3, 4]], [[1, 3], [2, 4]], [[0, 2], [1, 3]], [[1, 2], [3, 4]], [[0, 2], [1, 4]], [[0, 4], [2, 3]]];
    var sample6 = [[[0, 1], [2, 3]], [[0, 1], [4, 5]], [[2, 3], [4, 5]], [[0, 2], [1, 3]], [[0, 4], [1, 5]], [[2, 4], [3, 5]], [[0, 3], [1, 2]], [[0, 5], [1, 4]], [[2, 5], [3, 4]]];
    var sample7 = [[[0, 1], [2, 3]], [[0, 4], [5, 6]], [[1, 2], [3, 4]], [[0, 1], [5, 6]], [[0, 2], [3, 4]], [[1, 2], [5, 6]], [[0, 1], [3, 4]], [[0, 2], [5, 6]], [[1, 3], [2, 4]]];
    var sample8 = [[[0, 1], [2, 3]], [[4, 5], [6, 7]], [[0, 2], [1, 3]], [[4, 6], [5, 7]], [[0, 3], [1, 2]], [[4, 7], [5, 6]], [[3, 7], [5, 6]], [[0, 1], [2, 4]], [[3, 5], [6, 7]]];
    var sample = sample6;
    if (this.data.group_users.length == 4) {
      sample = sample4;
    } else if (this.data.group_users.length == 5) {
      sample = sample5;
    } else if (this.data.group_users.length == 7) {
      sample = sample7;
    } else if (this.data.group_users.length == 8) {
      sample = sample8;
    }
    var pk_groups = this.getvs(sample);
    var new_pk_groups = this.data.pk_groups.concat(pk_groups);
    this.setData({
      pk_groups: new_pk_groups,
      modalName: ""
    })
  },
  get1v1() {
    var sample3 = [[[0], [1]], [[0], [2]], [[1], [2]]];
    var sample4 = [[[0], [1]], [[2], [3]], [[1], [3]], [[0], [2]], [[1], [2]], [[0], [3]]];
    var sample5 = [[[0], [1]], [[2], [3]], [[3], [4]], [[2], [4]], [[1], [4]], [[0], [2]], [[1], [3]], [[1], [2]], [[0], [3]]];
    var sample = sample4;
    if (this.data.group_users.length == 3) {
      sample = sample3;
    } else if (this.data.group_users.length == 4) {
      sample = sample4;
    } else if (this.data.group_users.length == 5) {
      sample = sample5;
    }
    var pk_groups = this.getvs(sample);
    var new_pk_groups = this.data.pk_groups.concat(pk_groups);
    this.setData({
      pk_groups: new_pk_groups,
      modalName: ""
    })
  },
  del_pk_group(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var new_pk_groups = this.data.pk_groups;
    new_pk_groups.splice(index, 1);
    this.setData({ pk_groups: new_pk_groups });

  },
  new_pk_group(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var new_pk_groups = this.data.pk_groups;
    new_pk_groups.push(new_pk_groups[index]);
    this.setData({ pk_groups: new_pk_groups });
  },
  score_pk_group(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var score_pk_group = this.data.pk_groups[index];
    console.log(score_pk_group);//[[1,2],[3,4]]//不是[[[1,2],[3,4]]]
    var pk_group_score = [];
    var score = score_pk_group[score_pk_group.length - 1];
    score.forEach(item => {
      if (item != 0) {
        pk_group_score = score;
        return;
      }
    });
    this.setData({
      edit_pk_group_index: index,
      score_pk_group: score_pk_group,
      pk_group_score: pk_group_score,
      modalName: "scoreModal"
    });

  },
  get_score() {
    var pk_groups = this.data.pk_groups;
    var users_score = {};
    var groups_score = {};
    pk_groups.forEach((item) => {
      var score = item[item.length - 1];
      var max = Math.max.apply(null, score);
      var min = Math.min.apply(null, score);
      console.log("max" + max);
      console.log("min" + min);
      var peace = false;
      var battle = true;
      if (max == min) {
        //平局
        peace = true;
      }
      if(peace && max == 0){
        //没开打
        battle = false;
      }
      item.forEach((group, index) => {
        if (item.length != index + 1) {
          var group_score = score[index];
          var group_key = group.sort();
          group.forEach(user => {
            if (users_score.hasOwnProperty(user)) {
              users_score[user]["score"] = users_score[user]["score"] + group_score;
              if (!peace && group_score == max) {
                //赢了
                users_score[user]["win"] = users_score[user]["win"] + 1;
              }else if(battle && !peace){
                //输了
                users_score[user]["fail"] = users_score[user]["fail"] + 1;
              }else if(battle && peace){
                //平了
                users_score[user]["peace"] = users_score[user]["peace"] + 1;
              }
            } else {
              if (!peace && group_score == max) {
                //赢了
                users_score[user] = { "score": group_score, "win": 1,"fail":0,"peace":0 };
              } else if(battle && !peace) {
                //输了
                users_score[user] = { "score": group_score, "win": 0,"fail":1,"peace":0 };
              }else if(battle && peace){
                //平局
                users_score[user] = { "score": group_score, "win": 0,"fail":0 ,"peace":1};
              }else{
                //没打
                users_score[user] = { "score": group_score, "win": 0,"fail":0 ,"peace":0};
              }

            }

          })
          if (groups_score.hasOwnProperty(group_key)) {
            groups_score[group_key]["score"] = groups_score[group_key]["score"] + group_score;
            //users_score[user]["score"] = users_score[user]["score"] + group_score;
            if (!peace && group_score == max) {
              groups_score[group_key]["win"] = groups_score[group_key]["win"] + 1;
            }else if(battle && !peace){
              groups_score[group_key]["fail"] = groups_score[group_key]["fail"] + 1;
            }else if(battle && peace){
              groups_score[group_key]["peace"] = groups_score[group_key]["peace"] + 1;
            }
          } else {

            if (!peace && group_score == max) {
              groups_score[group_key] = { "score": group_score, "win": 1,"fail":0 ,"peace":0};
            } else if(battle && !peace){
              groups_score[group_key] = { "score": group_score, "win": 0,"fail":1 ,"peace":0};
            }else if(battle && peace){
              groups_score[group_key] = { "score": group_score, "win": 0,"fail":0 ,"peace":1};
            }else{
              groups_score[group_key] = { "score": group_score, "win": 0,"fail":0 ,"peace":0};
            }
          }
        }
      })
    })
    this.win_rate(users_score);
    users_score = this.sort_dict(users_score);
    groups_score = this.sort_dict(groups_score);
    console.log(users_score);
    console.log(groups_score);
   
    this.setData({
      sort_users_score: users_score,
      sort_groups_score: groups_score
    });
  },
  win_rate(users_score){
    for(var key in users_score){
      var item = users_score[key];
      var total = item["peace"] +item["fail"] + item["win"];
      var rate = 0;
      if(item["win"] > 0){
        rate = (Math.round(item["win"] / total * 100) + "%");
      }
      //var rate = (Math.round(item["win"] / total * 100) / 100 + "%");
      item["win_rate"] = rate;
    }
    
  },
  input_score(e) {
    var score = e.detail.value;
    var score_index = e.currentTarget.dataset.index;
    score = parseInt(score.replace(/\D/g, ''));
    console.log("比分" + score);
    console.log("index=" + score_index);
    var pk_group_score = this.data.pk_group_score;
    pk_group_score[score_index] = score;
    this.setData({
      pk_group_score: pk_group_score
    })
  },
  update_score(e) {
    var pk_group_score = this.data.pk_group_score;
    var score_pk_group = this.data.score_pk_group;
    var pk_groups = this.data.pk_groups;
    score_pk_group[score_pk_group.length - 1] = pk_group_score;
    pk_groups[this.data.edit_pk_group_index] = score_pk_group;
    console.log(score_pk_group);
    this.setData({
      pk_groups: pk_groups,
      modalName: "",
      pk_group_score: []//清空比分记录
    });
    this.get_score();
  },
  //给字典排序，按照字典中的key-value,value降序排列
  sort_dict(data) {
    var keys = Object.keys(data).sort((a, b) => {
      return -(data[a]["score"] - data[b]["score"]);//降序
    });
    console.log(keys);
    var new_data = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      new_data[key] = data[key];
    }

    return new_data;
  },
  update_pk_group(){
    //新增，更新
    var pk_groups = this.data.pk_groups;
    var activity_id = this.data.activity_id;
    var group_tag = this.data.group_tag;
    wx.request({
      url: app.globalData.hosturl + 'new_update_activity_member_pk', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "group_tag": group_tag,
        "pk_group":pk_groups
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
      }
    });
  },
  clear_pk_group(){
    //新增，更新
    var activity_id = this.data.activity_id;
    var group_tag = this.data.group_tag;
    wx.request({
      url: app.globalData.hosturl + 'del_activity_member_pk', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "group_tag": group_tag
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
      }
    });
  },
  //添加分组成员
  add_group_member(e) {
    let group_users = encodeURIComponent(JSON.stringify(this.data.group_users));
    var index = e.currentTarget.dataset.index;
    console.log(typeof(index));
    console.log(index);
    app.globalData.edit_index = parseInt(index);
    wx.navigateTo({
      url: 'partuser?ungroup_partinfo_list=' + group_users,
    })
  },
  save_custom_pk_group(){
    var pk_groups = this.data.pk_groups;
    var custom_pk_group = this.data.custom_pk_group;
    var len = custom_pk_group.length;
    var score = new Array(len).fill(0);
    custom_pk_group.push(score);
    pk_groups.push(this.data.custom_pk_group);
    app.globalData.edit_group_user = [];
    app.globalData.edit_index = 0;
    console.log(pk_groups);
    this.setData({
      pk_groups:pk_groups,
      modalName:null,
      custom_pk_group:[]
    })
  },
  expand_pk_group(){
    
    var hidden_pk_group = !this.data.hidden_pk_group;
    console.log("展示隐藏对阵情况"+hidden_pk_group);
    this.setData({
      hidden_pk_group
    })
  },
  expand_score_list(){
    var hidden_score_list = !this.data.hidden_score_list;
    this.setData({
      hidden_score_list
    })
  }


})