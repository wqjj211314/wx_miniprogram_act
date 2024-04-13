// pages/activityshowinfo/fixpartner.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_users:[],
    member_users:{},
    member_num_partner_list:[],//里面只有member_num
    member_num_nonpartner_list:[],
    sel_values:[],
    pk_groups:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var group_users = JSON.parse(decodeURIComponent(options.group_users));
    //按照顺序，两两搭档进行初始分配
    var member_num_list = []
    group_users.forEach((item,index)=>{
      member_num_list.push(item.member_num)
    })
    
    this.setData({
      group_users:JSON.parse(decodeURIComponent(options.group_users)),
      member_users:JSON.parse(decodeURIComponent(options.member_users)),
      member_num_partner_list:this.divide_arr(member_num_list)
    })

  },

  divide_arr(arr,random_flag=false) {
    const list = [];
    if(random_flag){
      arr = arr.sort(() => Math.random() > 0.5 ? -1 : 1)
    }
    arr.forEach((item, index) => {
      index % 2 == 0 ? list.push([item]) : list[list.length - 1].push(item)
    })
    return list;
  },
  del_group_member(e) {
    console.log(e.currentTarget.dataset.num);
    console.log(this.data.member_num_partner_list)
    var member_num = e.currentTarget.dataset.num;
    var partnerlist_index = e.currentTarget.dataset.index;
    console.log(partnerlist_index)
    var member_num_partner_list = this.data.member_num_partner_list;
    var member_num_nonpartner_list = this.data.member_num_nonpartner_list;
    console.log(member_num_partner_list)
    member_num_partner_list[partnerlist_index].splice(member_num_partner_list[partnerlist_index].indexOf(member_num), 1)//删除
    member_num_nonpartner_list.push(member_num)
    console.log(member_num_nonpartner_list)
    this.setData({
      member_num_partner_list: member_num_partner_list,
      member_num_nonpartner_list: member_num_nonpartner_list,
      pk_groups:[]
    })
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
  save_partner(e){
      var sel_values = this.data.sel_values;
      if(sel_values.length < 1){
        wx.showToast({
          title: '未选择搭档成员',
          icon:"none",
          duration:3000
        })
        return
      }
      var member_num_partner_list = this.data.member_num_partner_list;
      var member_num_nonpartner_list = this.data.member_num_nonpartner_list
      var partner_list_index = e.currentTarget.dataset.index;
      for(var i in sel_values){
        member_num_partner_list[partner_list_index].push(sel_values[i])
        member_num_nonpartner_list.splice(member_num_nonpartner_list.indexOf(sel_values[i]),1)
      }
      this.setData({
        member_num_partner_list:member_num_partner_list,
        member_num_nonpartner_list:member_num_nonpartner_list,
        pk_groups:[],
        sel_values:[]
      })
      
  },
  random_partner(){
    var group_users = this.data.group_users;
    //按照顺序，两两搭档进行初始分配
    var member_num_list = []
    group_users.forEach((item,index)=>{
      member_num_list.push(item.member_num)
    })
    this.setData({
      member_num_partner_list:this.divide_arr(member_num_list,true),
      member_num_nonpartner_list:[],
      pk_groups:[]
    })
  },
  get1v1() {
    var sample2 = [[[0], [1]], [[0], [1]], [[0], [1]]];
    var sample3 = [[[0], [1]], [[0], [2]], [[1], [2]]];
    var sample4 = [[[0], [1]], [[2], [3]], [[1], [3]], [[0], [2]], [[1], [2]], [[0], [3]]];
    
    var sample = sample4;
    var member_num_partner_list = this.data.member_num_partner_list;
    //如果搭档列表为空就要清理掉
    var new_member_num_partner_list = [];
    member_num_partner_list.forEach(item=>{
      if(item.length != 0){
        new_member_num_partner_list.push(item)
      }
    })
    if(new_member_num_partner_list.length < 2){
      wx.showToast({
        title: '搭档组合不能少于2组',
        duration:2000,
        icon:"none"
      })
      return;
    }else if(new_member_num_partner_list.length > 4){
      wx.showToast({
        title: '搭档组合不能多余4组',
        duration:2000,
        icon:"none"
      })
      return;
    }
    if(new_member_num_partner_list.length == 2){
      sample = sample2;
    }
    else if (new_member_num_partner_list.length == 3) {
      sample = sample3;
    } else if (new_member_num_partner_list.length == 4) {
      sample = sample4;
    } 
    var pk_groups = this.getvs(sample,new_member_num_partner_list);
    var new_pk_groups = this.data.pk_groups.concat(pk_groups);
    if(new_pk_groups.length < 10){
      new_pk_groups = new_pk_groups.concat(new_pk_groups)
    }
    return new_pk_groups;
    
  },
  getvs(sample,member_num_partner_list){
    //[[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]]
    //[[[0], [2]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]]
    //var score = new Array(len).fill(0);
    console.log(sample)
    console.log(member_num_partner_list)
    var pk_groups = [];
    var that = this;
    sample.forEach((item) => {
      var pk_num = item.length;//几方对阵？对阵方数量
      var pk_group = [];
      item.forEach((each_group_sample) => {
        var group_user_num = each_group_sample.length;//一方出战多少人，每个对阵方几个人
        var each_group = [];
        console.log(each_group_sample);
        each_group_sample.forEach((num_index)=>{
          console.log(num_index);
          each_group = each_group.concat(member_num_partner_list[num_index])
        })
        pk_group.push(each_group);
      })
      var score = new Array(pk_num).fill(0);
      var score_tags = [];
      //score[score.length-1] = "";//比分标签
      pk_group.push(score);
      pk_group.push(score_tags);
      pk_groups.push(pk_group);
    });
    return pk_groups;
  },
  preview_pk(){
    this.setData({
      pk_groups: this.get1v1()
    })
  },
  back_pkpage(){
    var pk_groups = this.get1v1();
    app.globalData.fix_partner_pk_groups = pk_groups;
    wx.navigateBack({
      delta: 1
    })
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