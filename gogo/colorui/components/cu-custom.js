const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: true
    },
    bgImage: {
      type: String,
      default: ''
    },
    activityid:{
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      let pages = getCurrentPages();
      console.log("返回栈")
      console.log(pages.length)
      console.log(pages)
     if(pages.length <= 1){
      wx.switchTab({
        url: '/pages/index/newindex',
      })
     }
      //let prevPage = pages[pages.length - 2]; 
      wx.navigateBack({
        delta: 1
      });
    },
    toHome(){
      console.log("导航栏跳转首页");
      console.log(this.properties)
      app.globalData.current_activity_id = this.properties.activityid;
      wx.switchTab({
        url: '/pages/index/newindex',
      })
    }
  }
})