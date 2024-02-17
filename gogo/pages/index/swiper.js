
function upDateDisplayList(that,swiper_current_index, data_current_index,data_list,recyler_list) {

  //let recyler_list = [];
  //新的数据索引和对应swiper索引位置
  var pre_swiper_current_index = swiper_current_index - 1 == -1 ? 2 : swiper_current_index - 1;

  var pre_data_current_index = data_current_index - 1 == -1 ? data_list.length - 1 : data_current_index - 1;

  var next_swiper_current_index = swiper_current_index + 1 == 3 ? 0 : swiper_current_index + 1;

  var next_data_current_index = data_current_index + 1 == data_list.length ? 0 : data_current_index + 1;

  //重新赋值
  recyler_list[swiper_current_index] = data_list[data_current_index];
  recyler_list[pre_swiper_current_index] = data_list[pre_data_current_index];
  recyler_list[next_swiper_current_index] = data_list[next_data_current_index];
  
  //setdata重新渲染数据
  that.setData({
    recyler_list,
  })

}
function update_swiper(that,current,swiper_current_index,data_current_index,data_list,recyler_list){
  var new_data_current_index = 0;
  var new_swiper_current_index = 0;

  //根据上滑下滑动作，决定如何渲染swiper索引和data索引
  if (swiper_current_index - current == 2 || swiper_current_index - current == -1) {
    //下滑
    new_data_current_index = data_current_index + 1 == data_list.length ? 0 : data_current_index + 1;
    new_swiper_current_index = swiper_current_index + 1 == 3 ? 0 : swiper_current_index + 1;
  } else if (swiper_current_index - current == -2 ||swiper_current_index - current == 1) {
    //上滑
    new_data_current_index = data_current_index - 1 == -1 ? data_list.length - 1 : data_current_index - 1;
    new_swiper_current_index = swiper_current_index - 1 == -1 ? 2 :swiper_current_index - 1;
  }
  //更新当前滑动之后的swiper索引，和对应的data索引
  that.setData({
    data_current_index:new_data_current_index,
    swiper_current_index:new_swiper_current_index
  });
  //重新渲染其他索引的数据
  upDateDisplayList(that,new_swiper_current_index,new_data_current_index,data_list,recyler_list);
}
exports.update_swiper = update_swiper
exports.upDateDisplayList = upDateDisplayList