//const swiper = require("swiper.js");
function get_like_list(hosturl, that, activity_id) {
  wx.request({
    url: hosturl + 'get_activity_member_like_list', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": activity_id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      var like_dict = res.data;
      like_dict = is_like(that.data.part_member_num, like_dict);
      that.setData({
        like_dict: like_dict
      })
    },
    fail(res) {
     
    }
  });
}
function is_like(part_member_num, like_dict) {
  for (var like_member_group in like_dict) {
    var member_nums = like_dict[like_member_group]["member_nums"];
    console.log(member_nums)
    if (member_nums.indexOf(part_member_num) != -1) {
      like_dict[like_member_group]["like_flag"] = true;
    }
  }
  return like_dict;
}
function get_pk_groups(hosturl, that, activity_id, group_tag, activity_tag) {
  var pkinfo = null;
  wx.request({
    url: hosturl + 'get_activity_member_pk_list_for_group_tag', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": activity_id,
      "group_tag": group_tag,
      "hobby_tag": activity_tag
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      pkinfo = res.data;
      console.log("获取当前分组的对阵情况");
      console.log(pkinfo);
      if (pkinfo == "") {
        return
      }
      //初始化分数胜负场，胜率，得分等
      var users_score = get_score(pkinfo.pk_groups);
      score_diff(users_score);
      win_rate(users_score);
      users_score = sort_dict2(users_score);
      var sort_users_score_empty_flag = true;
      for (var key in users_score) {
        sort_users_score_empty_flag = false;
        break;
      }
      that.setData({
        all_pk_info: pkinfo,
        pk_groups: pkinfo.pk_groups,
        sort_users_score: users_score,
        sort_users_score_empty_flag: sort_users_score_empty_flag,
        submit_flag: false
      })

    },
    fail(res) {
      wx.showToast({
        title: "服务器异常",
        icon: "error"
      })
    }
  });
  return pkinfo;
}
function get_pk_groups_list(hosturl, that, activity_id, activity_tag) {
  wx.request({
    url: hosturl + 'get_activity_member_pk_list', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": activity_id,
      "hobby_tag": activity_tag
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      var activity_member_pk_list = res.data["activity_member_pk_list"];
      var pk_result = res.data["pk_result"];
      console.log("获取到所有的对阵情况");
      console.log(activity_member_pk_list);
      console.log(pk_result)
      //var sort_users_score = sort_dict(pk_result);//merge_all_pkgroups_score(activity_member_pk_list);
      var sort_users_score_empty_flag = true;
      for (var key in pk_result) {
        sort_users_score_empty_flag = false;
        break;
      }
      var sort_users_score = {};
      if (!sort_users_score_empty_flag) {
        sort_users_score = sort_dict(pk_result);
      }
      that.setData({
        sort_users_score: sort_users_score,
        sort_users_score_empty_flag: sort_users_score_empty_flag
      })

    },
    fail(res) {
      wx.showToast({
        title: "服务器异常",
        icon: "error"
      })
    }
  });
}
function merge_all_pkgroups_score(activity_member_pk_list) {
  var users_score = {}
  activity_member_pk_list.forEach(item => {
    var pk_groups = item.pk_groups;
    //users_score[user] = { "score": group_score, "win": 1,"fail":0,"peace":0 };
    var new_users_score = get_score(pk_groups);
    for (var member_num in new_users_score) {
      if (users_score.hasOwnProperty(member_num)) {
        users_score[member_num].score = users_score[member_num].score + new_users_score[member_num].score;
        users_score[member_num].win = users_score[member_num].win + new_users_score[member_num].win;
        users_score[member_num].fail = users_score[member_num].fail + new_users_score[member_num].fail;
        users_score[member_num].peace = users_score[member_num].peace + new_users_score[member_num].peace;
      } else {
        users_score[member_num] = new_users_score[member_num];
      }
    }

  })
  win_rate(users_score);
  users_score = sort_dict(users_score);
  return users_score;
}
//users_score[user] = { "score": group_score, "win": 1,"fail":0,"peace":0 };
function get_score(pk_groups) {
  //var pk_groups = this.data.pk_groups;
  var users_score = {};
  var groups_score = {};
  pk_groups.forEach((item) => {
    var score = item[item.length - 2];
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
    if (peace && max == 0) {
      //没开打
      battle = false;
    }
    item.forEach((group, index) => {
      if (index + 1 != item.length && index + 2 != item.length) {
        var group_score = score[index];
        var score_lost = - group_score;
        for(var index in score){
          score_lost = score_lost + score[index]
        }
        
        var group_key = group.sort();
        group.forEach(user => {
          if (users_score.hasOwnProperty(user)) {
            users_score[user]["score"] = users_score[user]["score"] + group_score;
            users_score[user]["score_lost"] = users_score[user]["score_lost"] + score_lost;
            if (!peace && group_score == max) {
              //赢了
              users_score[user]["win"] = users_score[user]["win"] + 1;
            } else if (battle && !peace) {
              //输了
              users_score[user]["fail"] = users_score[user]["fail"] + 1;
            } else if (battle && peace) {
              //平了
              users_score[user]["peace"] = users_score[user]["peace"] + 1;
            }
          } else {
            if (!peace && group_score == max) {
              //赢了
              users_score[user] = { "score": group_score, "win": 1, "fail": 0, "peace": 0, "score_lost": score_lost };
            } else if (battle && !peace) {
              //输了
              users_score[user] = { "score": group_score, "win": 0, "fail": 1, "peace": 0, "score_lost": score_lost };
            } else if (battle && peace) {
              //平局
              users_score[user] = { "score": group_score, "win": 0, "fail": 0, "peace": 1, "score_lost": score_lost };
            } else {
              //没打
              users_score[user] = { "score": group_score, "win": 0, "fail": 0, "peace": 0, "score_lost": score_lost };
            }
          }
        })
        //搭档的统计，暂时用不到
        if (groups_score.hasOwnProperty(group_key)) {
          groups_score[group_key]["score"] = groups_score[group_key]["score"] + group_score;
          //users_score[user]["score"] = users_score[user]["score"] + group_score;
          if (!peace && group_score == max) {
            groups_score[group_key]["win"] = groups_score[group_key]["win"] + 1;
          } else if (battle && !peace) {
            groups_score[group_key]["fail"] = groups_score[group_key]["fail"] + 1;
          } else if (battle && peace) {
            groups_score[group_key]["peace"] = groups_score[group_key]["peace"] + 1;
          }
        } else {
          if (!peace && group_score == max) {
            groups_score[group_key] = { "score": group_score, "win": 1, "fail": 0, "peace": 0 };
          } else if (battle && !peace) {
            groups_score[group_key] = { "score": group_score, "win": 0, "fail": 1, "peace": 0 };
          } else if (battle && peace) {
            groups_score[group_key] = { "score": group_score, "win": 0, "fail": 0, "peace": 1 };
          } else {
            groups_score[group_key] = { "score": group_score, "win": 0, "fail": 0, "peace": 0 };
          }
        }
      }
    })
  })
  //win_rate(users_score);
  //users_score = sort_dict(users_score);
  //groups_score = sort_dict(groups_score);
  console.log(users_score);
  console.log(groups_score);
  return users_score;
  //this.setData({
  //sort_users_score: users_score,
  //sort_groups_score: groups_score
  //});
}
function score_diff(users_score) {
  for (var key in users_score) {
    var item = users_score[key];
    if(item["score"]+item["score_lost"] == 0){
      //这属于零和对局，类似棋牌，麻将之类的活动，即赢家得分是输家的输分
      //此时的净胜分也就是总得分
      item["score_diff"] = item["score"];
    }else{
      var score_diff = item["score"] - item["score_lost"];
      item["score_diff"] = score_diff;
    }
    
  }

}
function win_rate(users_score) {
  for (var key in users_score) {
    var item = users_score[key];
    var total = item["peace"] + item["fail"] + item["win"];
    var rate = 0;
    if (item["win"] > 0) {
      rate = (Math.round(item["win"] / total * 100));
    }
    //var rate = (Math.round(item["win"] / total * 100) / 100 + "%");
    item["win_rate"] = rate;
  }

}
//给字典排序，按照字典中的key-value,value降序排列
function sort_dict(data) {
  var keys = Object.keys(data).sort((a, b) => {
    if (data[a]["all_win"] == data[b]["all_win"]) {
      if (data[a]["all_win_rate"] == data[b]["all_win_rate"]) {
        return -(data[a]["total_scores_diff"] - data[b]["total_scores_diff"])
      }
      return -(data[a]["all_win_rate"] - data[b]["al_win_rate"])
    }
    return -(data[a]["all_win"] - data[b]["all_win"]);//降序
  });
  console.log(keys);
  var new_data = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    new_data[key] = data[key];
  }
  return new_data;
}
function sort_dict2(data) {
  var keys = Object.keys(data).sort((a, b) => {
    if (data[a]["win"] == data[b]["win"]) {
      if (data[a]["win_rate"] == data[b]["win_rate"]) {
        return -(data[a]["score_diff"] - data[b]["score_diff"])
      }
      return -(data[a]["win_rate"] - data[b]["win_rate"])
    }
    return -(data[a]["win"] - data[b]["win"]);//降序
  });
  console.log(keys);
  var new_data = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    new_data[key] = data[key];
  }
  return new_data;
}
exports.get_score = get_score
exports.get_pk_groups = get_pk_groups
exports.get_pk_groups_list = get_pk_groups_list
exports.merge_all_pkgroups_score = merge_all_pkgroups_score
exports.is_like = is_like
exports.get_like_list = get_like_list
