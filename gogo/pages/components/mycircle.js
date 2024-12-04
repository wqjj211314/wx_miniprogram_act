// pages/components/mycircle.js
Component({

  options: {
	  multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	properties: { //定义属性，对外可以被调用和设置的属性
	  draw: {//画板元素名称id
		type: String,
		value: 'draw',
		observer:function(newVal,oldVal,change){
		  console.log(newVal, oldVal, change);
		  this.onreset(); //数值变化是所有重绘
		}
	  },
	  per:{ //百分比 通过此值转换成step
		type: String,
		value: '0',
		observer:function(newVal,oldVal,change){
		  console.log(newVal, oldVal, change);
		  this.onreset();//数值变化是所有重绘
		}
	  },
	  r:{//半径
		type: String,
		value: '50',
		observer:function(newVal,oldVal,change){
		  console.log(newVal, oldVal, change);
		  this.onreset();//数值变化是所有重绘
		}
	  }
  
	},

  /**
   * 组件的初始数据
   */
  data: {
    step: 1, //用来算圆的弧度0-2
    size:0, //画板大小
    screenWidth:750, //实际设备的宽度
    txt:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onreset: function () {
			const _this = this;
			//获取屏幕宽度
			wx.getSystemInfo({
				success: function (res) {
					_this.setData({
						screenWidth: res.windowWidth
					});
				},
			});

			//初始化
			const el = _this.data.draw; //画板元素
			const per = _this.data.per; //圆形进度
			const r = Number(_this.data.r); //圆形半径

			_this.setData({
				step: (2 * Number(_this.data.per)) / 100, //这里将 0-100 转换为 0-2
				txt: _this.data.per
			});


			//获取屏幕宽度(并把真正的半径px转成rpx)
			let rpx = (_this.data.screenWidth / 750) * r; //真正的半径
			//计算出画板大小
			this.setData({
				size: rpx * 2  //实际窗口的大小
			});
			const w = 30;//圆形的宽度

			//组件入口,调用下面即可绘制 背景圆环和彩色圆环。
			_this.drawCircleBg(el + 'bg', rpx, w);//绘制 背景圆环
			_this.drawCircle(el, rpx, w, _this.data.step);//绘制 彩色圆环

    },
    drawCircleBg: function (el, r, w) {
			const query = wx.createSelectorQuery().in(this);
			//wx.createSelectorQuery()
				query.select('#' + el) // 在 WXML 中填入的 id
				.fields({ node: true, size: true })
				.exec((res) => {

					const canvas = res[0].node;
					const ctx = canvas.getContext('2d');

					// Canvas 画布的实际绘制宽高
					const width = res[0].width
					const height = res[0].height
		
					// 初始化画布大小
					const dpr = wx.getWindowInfo().pixelRatio
					canvas.width = width * dpr
					canvas.height = height * dpr
					ctx.scale(dpr, dpr)

					//绘制前清空画布，原点 + 长和宽，这里画圆，因此清零 2r 的方块
					ctx.clearRect(0, 0, 2 * r, 2 * r);
					ctx.lineWidth = w;                  // 设置圆环的宽度
					ctx.strokeStyle = '#E5E5E5';        // 设置圆环的颜色
					ctx.lineCap = 'round';            // 设置圆环端点的形状
					ctx.beginPath();                     //开始一个新的路径

					// r,r为原点，r-w 为半径，从 0 弧度到 2pi 弧度，顺时针（false）画弧度。
					ctx.arc(r, r, r - w, 0, 2 * Math.PI, false); //设定路径

					ctx.stroke();//对当前路径进行描边，真正的画

				}); // */
		},
    drawCircle: function (el, r, w, step) {
			const query = wx.createSelectorQuery().in(this);
			//wx.createSelectorQuery()
			query.select('#' + el) // 在 WXML 中填入的 id
				.fields({ node: true, size: true })
				.exec((res) => {

					const canvas = res[0].node;
					const context = canvas.getContext('2d');

					// Canvas 画布的实际绘制宽高
					const width = res[0].width
					const height = res[0].height
		
					// 初始化画布大小
					const dpr = wx.getWindowInfo().pixelRatio
					canvas.width = width * dpr
					canvas.height = height * dpr
					context.scale(dpr, dpr)
                  
					context.clearRect(0, 0, 2 * r, 2 * r);
					// 设置渐变
					var gradient = context.createLinearGradient(2 * r,2 * r, 0,0);
					gradient.addColorStop("0", "#2661DD");
					gradient.addColorStop("0.5", "#40ED94");
					gradient.addColorStop("1.0", "#5956CC");
				
					context.lineWidth = w;         // 设置现线的宽度
					context.strokeStyle = gradient; //设置颜色为渐变
					context.lineCap = 'round';         //设置端点形状
					context.beginPath();//开始一个新的路径
					// step 从0到2为一周，注意 canvas 的坐标方向，从-90°划到正的 270°
					context.arc(r, r, r - w, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
					//context.stroke();           //对当前路径进行描边
					step ? context.stroke() : ''; //当step为空的时候不画（0%）
				})//  */
		},


  }
})