//drawMap.js
define(['loadimg'], function (loadimg){
	var cwidth = 800,	//画布宽度
		cheight = 600,  //画布高度
		mapSet = {		//每关地图信息
			name: '',
			beginX: 0,
			beginY: 0,
			swidth: 20,
			cwidth: 0,
			cheight: 0,
			col: 40,
			row: 30
		},
		keys = {
			 5: "wall",
			10: "ground",
			20: "target",
			60: "man",
			70: "man",
			80: "box",
			90: "tbox"
		};

	//获取context
	var getCanvas = function (name) {
		var canvas = document.querySelector(name);
		canvas.width = cwidth;
		canvas.height = cheight;
		return canvas.getContext("2d");
	};
	var contextBG = getCanvas("#bgcanvas"),
		contextMAP = getCanvas("#mapcanvas"),
		contextTop = getCanvas("#topcanvas");


	//画文字
	var setText = function (ctx, text, x, y, color, style) {
		ctx.font = style;
		ctx.fillStyle = color;
		ctx.fillText(text, x, y);
	};
	//画圆角矩形
	var roundRect = function (ctx, x, y, w, h, r, color) {
		var min_size = Math.min(w, h);
	    if (r > min_size / 2) r = min_size / 2;
	    // 开始绘制
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
		ctx.closePath();

		ctx.strokeStyle = color;
		ctx.stroke();
	};
	//画地图上的单个小方块
	var drawImageCube = function (value, x, y) {	
		var key = keys[value];
		contextMAP.drawImage(loadimg.source[key], mapSet.beginX+y*mapSet.swidth, mapSet.beginY+x*mapSet.swidth, mapSet.swidth, mapSet.swidth);
	};

	//初始化地图
	var initMap = function (data) {
		//清除上一次的地图
		contextMAP.clearRect(mapSet.beginX, mapSet.beginY, mapSet.cwidth, mapSet.cheight);

		mapSet.name = data.name;
		//为使地图居中，计算开始的x,y值
		mapSet.beginX = Math.ceil((mapSet.col-data.size.width)/2)*mapSet.swidth;
		mapSet.beginY = Math.ceil((mapSet.row-data.size.height)/2)*mapSet.swidth;
		mapSet.cwidth = data.size.width*mapSet.swidth;
		mapSet.cheight = data.size.width*mapSet.swidth;
		//关卡名称，重试按钮，选择等
		drawBG();
		//画地图
		drawMap(data.map);
	};
	//画背景
	var drawBG = function () {
		var ctx = contextBG;
		ctx.clearRect(0,0,cwidth,60);
		ctx.fillStyle= '#333';
		ctx.fillRect(0,0,cwidth,cheight);

		//关卡名称
		setText(ctx, mapSet.name, 50, 50, "#fff", "30px Microsoft Yahei bold");
		//选择关卡
		setText(ctx, "选择关卡：", 620, 36, "#fff", "18px Microsoft Yahei");
		//撤消按钮
		roundRect(ctx, 240, 20, 120, 40, 5, "#fff");
		setText(ctx, "撤消", 280, 46, "#fff", "20px Microsoft Yahei bold");
		//重试按钮
		roundRect(ctx, 440, 20, 120, 40, 5, "#fff");
		setText(ctx, "重试", 480, 46, "#fff", "20px Microsoft Yahei bold");
	};
	//画整张地图
	var drawMap = function (data) {
		//清除上一关地图
		contextMAP.clearRect(mapSet.beginX,mapSet.beginY,mapSet.cwidth,mapSet.cheight);
		//画出初始地图
		data.forEach(function(row, i){
			row.forEach(function(item, j){
				if(item) {
					drawImageCube(item, i, j);
				}
			});
		});
	};
	//画每一步的地图
	var drawStep = function (data) {	//画每次改动的方块及步数
		data.forEach(function(item){
			drawImageCube(item.val, item.x, item.y);
		});
	};

	return {
		initMap: initMap,
		drawStep: drawStep
	}
});

	