// pages/recyler/recyler.js
//https://blog.csdn.net/whoami138/article/details/116246146
const server = require("../../pages/index/server.js");
const app = getApp();
// 这是当前swiper-item在swiper中的索引

let index = 0;

// 这是当前swiper-item在swiper中的索引

let currentIndex = 0;

Page({


  /**
  * 页面的初始数据
  */
  data: {
    displayList: new Array(3), //展示数据

    duration: 300, //动画时常

    activity_list: [],
    hosturl: "https://www.2week.club:5000/"


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get_activity_list();
  },
  get_activity_list(activity_id = "") {
    var that = this;
    console.log("获取活动列表");
    var id = "";
    if (activity_id == "" && that.data.activity_id != undefined) id = that.data.activity_id;

    wx.showLoading({
      title: '',
    });
    var _that = that;
    wx.request({
      url: app.globalData.hosturl + 'get_activity_list', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        var list = [];
        console.log("获取list");
        console.log(res.data);
        res.data.forEach(element => {

          list.push(element);
        });
        _that.setData({
          activity_list: list
        })

        _that.upDateDisplayList();

        wx.hideLoading({
          success: (res) => { },
        });
      }
    });

  },
  //划动切换
  slide(e) {
    console.log("切换" + e.detail.currentItemId);
    console.log("upSwiper slide切换至" + e.detail.current);
    
    // 先判断是向前滑动还是向后滑动

    // current 为滑动后swiper-item的索引

    let current = e.detail.current

    // currentIndex是滑动前swiper-item的索引

    // 如果两者的差为2或者-1则是向后滑动

    if (currentIndex - current == 2 || currentIndex - current == -1) {

      index = index + 1 == this.data.activity_list.length ? 0 : index + 1;

      currentIndex = currentIndex + 1 == 3 ? 0 : currentIndex + 1;

      this.upDateDisplayList();

    }

    // 如果两者的差为-2或者1则是向前滑动

    else if (currentIndex - current == -2 || currentIndex - current == 1) {

      index = index - 1 == -1 ? this.data.activity_list.length - 1 : index - 1;

      currentIndex = currentIndex - 1 == -1 ? 2 : currentIndex - 1;

      this.upDateDisplayList();

    }
  },

  // 更新当前displayList

  upDateDisplayList() {
    console.log(this.data.activity_list)
    console.log("upSwiper currentIndex" + currentIndex);
    console.log("upSwiper index" + index);
    let displayList = this.data.displayList;
    var c1 = currentIndex - 1 == -1 ? 2 : currentIndex - 1;
    var c2 = currentIndex + 1 == 3 ? 0 : currentIndex + 1;
    var i1 = (index - 1 == -1 ? this.data.activity_list.length - 1 : index - 1);
    var i2 = (index + 1 == this.data.activity_list.length ? 0 : index + 1);
    
    displayList[currentIndex] = this.data.activity_list[index];
  
    
    displayList[c1] = this.data.activity_list[i1];
    displayList[c2] = this.data.activity_list[i2];

    this.setData({
      displayList:displayList
    },function(){
      console.log("监听setdata");
    });
    console.log(this.data.displayList[0].title)
    console.log(this.data.displayList[1].title)
    console.log(this.data.displayList[2].title)


  },

})