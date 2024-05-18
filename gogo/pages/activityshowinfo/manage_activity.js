function delete_activity(that,activity_id,hosturl) {
  //var that = this;
  //var index = parseInt(e.currentTarget.dataset.index);
  //console.log(typeof index);
  //console.log(this.data.activity_create_list.length);
  //var activity_info = this.data.activity_create_list[index];
  //var activity_id = activity_info["activity_id"];
  wx.request({
    url:hosturl + 'delete_activity', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": activity_id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data);
      wx.showToast({
        title: res.data,
        icon: "none",
        duration: 2000
      })
      if (res.data == "成功删除活动") {
        that.navigateToActivitycreate();
      }

    }
  });

}
function cancel_activity(that,activity_id,hosturl) {
  //var that = this;
  //var index = parseInt(e.currentTarget.dataset.index);
  //console.log(typeof index);
  //console.log(this.data.activity_create_list.length);
  //var activity_info = this.data.activity_create_list[index];
  //var activity_id = activity_info["activity_id"];
  wx.request({
    url: hosturl + 'update_activity_status', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": activity_id,
      "activity_status": 801//取消活动
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data.result);
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.result,
          icon: "none",
          duration: 2000
        })
        that.navigateToActivitycreate();
      }else{
        wx.showToast({
          title: res.data.result,
          icon: "none",
          duration: 2000
        })
      }

    }
  });
}
function delete_all_member(that,activity_id,hosturl) {
  //var that = this;
  //var index = parseInt(e.currentTarget.dataset.index);
  //console.log(typeof index);
  //console.log(this.data.activity_create_list.length);
  //var activity_info = this.data.activity_create_list[index];
  //var activity_id = activity_info["activity_id"];
  wx.request({
    url: hosturl + 'delete_all_member', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": activity_id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data.result);
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.result,
          icon: "none",
          duration: 2000
        })
        
      }else{
        wx.showToast({
          title: res.data.result,
          icon: "none",
          duration: 2000
        })
      }

    }
  });
}
function update_activity_info(activity_info) {
  //var that = this;
  //var index = parseInt(e.currentTarget.dataset.index);
  //console.log(typeof index);
  //console.log(this.data.activity_create_list.length);
  //var activity_info = this.data.activity_create_list[index];
  //跳转到更新activity的界面
  activity_info = encodeURIComponent(JSON.stringify(activity_info));
  wx.navigateTo({
    url: '../activity/editactivity?activity_info=' + activity_info
  })
}
function calculate_close_activity(that,activity_id,user_id,activity_tag,hosturl) {
  //var that = this;
  //var index = parseInt(e.currentTarget.dataset.index);
  //console.log(typeof index);
  //console.log(this.data.activity_create_list.length);
  //var activity_info = this.data.activity_create_list[index];
  //var activity_id = activity_info["activity_id"];
  
  wx.request({
    url: hosturl + 'calculate_close_activity', //仅为示例，并非真实的接口地址
    data: {
      "activity_id": activity_id,
      "user_id":user_id,
      "hobby_tag":activity_tag
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data.result);
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.result,
          icon: "none",
          duration: 2000
        })
        that.navigateToActivitycreate();
      }else{
        wx.showToast({
          title: res.data.result,
          icon: "error",
          duration: 2000
        })
      }

    }
  });
}
exports.delete_activity = delete_activity
exports.cancel_activity = cancel_activity
exports.delete_all_member = delete_all_member
exports.update_activity_info = update_activity_info
exports.calculate_close_activity = calculate_close_activity
