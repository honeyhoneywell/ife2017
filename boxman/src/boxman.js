var source = {
	wall: 'images/Wall_Brown.png',
	ground: 'images/GroundGravel_Dirt.png',
	target: 'images/EndPoint_Beige.png',
	man: 'images/Character4.png',
	box: 'images/Crate_Beige.png',
	tbox: 'images/CrateDark_Beige.png'
};
//载入图片
var loadImages = function(source, callback) {
	var count = 0,
		slen = 0;
		
	for(var key in source) { slen++; }
		
	for(var key in source) {
		var imga = new Image();
		imga.src = source[key];
		imga.onload = function() {
			if(++count >= slen) {
				callback();
			}
			
		}
		source[key] = imga;
	}
};

//加载完图片后执行程序
loadImages(source, function(){
	var start = new manMove(gameData);
});

var drawMap = function() {
	//默认值
	this.default = {
		cwidth: 800,
		cheight: 600
	};
	//每关地图信息
	this.mapSet = {
		name: '',
		beginX: 0,
		beginY: 0,
		swidth: 20,
		cwidth: 0,
		cheight: 0,
		col: 40,
		row: 30
	};
	//地图键值对应
	this.keys = {
		 5: "wall",
		10: "ground",
		20: "target",
		60: "man",
		70: "man",
		80: "box",
		90: "tbox"
	};

	this.contextBG = this.getCanvas("#bgcanvas");
	this.contextMAP = this.getCanvas("#mapcanvas");
	this.contextTop = this.getCanvas("#topcanvas");
};
drawMap.prototype = {
	getCanvas: function(name) {
		var canvas = document.querySelector(name);
		canvas.width = this.default.cwidth;
		canvas.height = this.default.cheight;
		return canvas.getContext("2d");
	},
	initMap: function(data) {	//初始化地图
		var map = this.mapSet;
		//清除上一次的地图
		this.contextMAP.clearRect(map.beginX, map.beginY, map.cwidth, map.cheight);

		map.name = data.name;
		//为使地图居中，计算开始的x,y值
		map.beginX = Math.ceil((map.col-data.size.width)/2)*map.swidth;
		map.beginY = Math.ceil((map.row-data.size.height)/2)*map.swidth;
		map.cwidth = data.size.width*map.swidth;
		map.cheight = data.size.width*map.swidth;
		//关卡名称，重试按钮，选择等
		this.drawBG();
		//画地图
		this.drawMap(data.map);
	},
	drawBG: function() {	//画背景
		var ctx = this.contextBG;
		ctx.clearRect(0,0,this.default.cwidth,60);
		ctx.fillStyle= '#333';
		ctx.fillRect(0,0,this.default.cwidth,this.default.cheight);

		//关卡名称
		this.setText(ctx, this.mapSet.name, 50, 50, "#fff", "30px Microsoft Yahei bold");
		//选择关卡
		this.setText(ctx, "选择关卡：", 620, 36, "#fff", "18px Microsoft Yahei");
		//重试按钮
		this.roundRect(ctx, 440, 20, 120, 40, 5, "#fff");
		this.setText(ctx, "重试", 480, 46, "#fff", "20px Microsoft Yahei bold");
	},
	drawMap: function(data) {
		//在中层画布画地图
		var ctx = this.contextMAP, map = this.mapSet, self = this;
		//只清除这张地图大小的范围
		ctx.clearRect(map.beginX,map.beginY,map.cwidth,map.cheight);
		//画出初始地图
		data.forEach(function(row, i){
			row.forEach(function(item, j){
				if(item) {
					self.drawImageCube(item, i, j);
				}
			});
		});
	},
	drawStep: function(data) {	//画每次改动的方块
		var self = this;
		data.forEach(function(item){
			self.drawImageCube(item.val, item.x, item.y);
		});
	},
	drawImageCube: function(value, x, y) {	//画地图上的小方块
		var map = this.mapSet,
			key = this.keys[value];
		this.contextMAP.drawImage(source[key], map.beginX+y*map.swidth, map.beginY+x*map.swidth, map.swidth, map.swidth);
	},
	setText: function(ctx, text, x, y, color, style) {
		ctx.font = style;
		ctx.fillStyle = color;
		ctx.fillText(text, x, y);
	},
	roundRect: function(ctx, x, y, w, h, r, color) {	//画圆角矩形
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
	}
};

var manMove = function(data) {
	var self = this;
	this.data = data;
	this.dataLen = data.length;
	this.copy = [];
	this.steps = [];
	this.point = {
		p1: {x: 0, y: 0},
		p2: {x: 0, y: 0},
		p3: {x: 0, y: 0}
	};
	this.type = {
		wall: 5,
		ground: 10,
		bground: 80,
		target: 20,
		btarget: 90,
		man: 50,
		box: 70
	};
	this.level = 0,
	this.win = false;

	this.drawmap = new drawMap();
	this.addSelector();
	this.search(0);

	document.addEventListener('keyup', function(e){
		if(self.win) return false;
		self.keyControl(e);
	});
	document.querySelector("#topcanvas").addEventListener('click', function(e){
		self.retry(e);
	});
};
manMove.prototype = {
	addSelector: function() {
		var self = this,
			container = document.querySelector(".container"),
			select = document.createElement('select');
		select.className = "selector";
		for(var i=0; i<this.dataLen; i++) {
			var opt = document.createElement('option');
			opt.value = i;
			opt.innerHTML = '第'+(i+1)+'关';
			select.appendChild(opt);
		}
		select.onchange = function(e) {
			e.preventDefault();
			self.search(this.selectedIndex);
		};
		//使select键盘操作失效(火狐无效)
		select.onkeydown = function(ev) {
			if(!document.all) this.blur(); // firefox
			return false;
		};
		container.appendChild(select);
	},
	setSelector: function(n) {
		var options = document.querySelectorAll('.selector option');
		options.forEach(function(op, i){
			if(i === n) {
				op.setAttribute('selected','selected');
			} else {
				op.removeAttribute('selected');
			}
		});
	},
	search: function(num) {
		if(num > this.dataLen || num < 0) {
			alert('此关不存在!');
			return false;
		}
		//保存此关信息
		this.level = num;
		this.copy = JSON.parse(JSON.stringify(this.data[num].map));
		this.point.p1.x = this.data[num].mpoint.x;
		this.point.p1.y = this.data[num].mpoint.y;
		this.drawmap.initMap(this.data[num]);
		this.steps.length = 0;

		this.win = false;
		//设置select的值
		this.setSelector(this.level);
	},
	setPonintVal: function(a, b, c, d) {	//设置可能移动端点点坐标
		this.point.p2.x = this.point.p1.x + a;
		this.point.p2.y = this.point.p1.y + b;
		this.point.p3.x = this.point.p1.x + c;
		this.point.p3.y = this.point.p1.y + d;
	},
	keyControl: function(event) {
		switch(event.keyCode) {
			case 37: 
				this.setPonintVal(0, -1, 0, -2);
				break;
			case 38:
				this.setPonintVal(-1, 0, -2, 0);
				break;
			case 39: 
				this.setPonintVal(0, 1, 0, 2);
				break;
			case 40:
				this.setPonintVal(1, 0, 2, 0);
				break;
		}
		this.move();
	},
	//保存点信息
	savePoint: function(x,y,num) {
		var point = {
			x: x,
			y: y,
			val: num
		}
		return point;
	},
	move: function() {
		var p1 = this.point.p1,
			p2 = this.point.p2,
			p3 = this.point.p3,
			step = [];
		//每次移动最多3个点，保存每次移动端点为一步

		//前方一格如果是墙
		if(this.copy[p2.x][p2.y] === this.type.wall) return;
		//前方一格如果没有阻碍(地面或目标点)
		if(this.copy[p2.x][p2.y] === this.type.ground || this.copy[p2.x][p2.y] === this.type.target) {
			this.copy[p2.x][p2.y] += this.type.man;
			this.copy[p1.x][p1.y] -= this.type.man;
			step.push(this.savePoint(p1.x, p1.y, this.copy[p1.x][p1.y]));
			step.push(this.savePoint(p2.x, p2.y, this.copy[p2.x][p2.y]));
			p1.x = p2.x;
			p1.y = p2.y;
		}
		//前方一格如果是箱子
		if(this.copy[p2.x][p2.y] === this.type.bground || this.copy[p2.x][p2.y] === this.type.btarget) {
			//前方第二格如果是箱子或墙则不动
			if(this.copy[p3.x][p3.y] === this.type.wall || this.copy[p3.x][p3.y] === this.type.bground || this.copy[p3.x][p3.y] === this.type.btarget) return;
			this.copy[p3.x][p3.y] += this.type.box;
			this.copy[p2.x][p2.y] -= (this.type.box - this.type.man);
			this.copy[p1.x][p1.y] -= this.type.man;
			step.push(this.savePoint(p1.x, p1.y, this.copy[p1.x][p1.y]));
			step.push(this.savePoint(p2.x, p2.y, this.copy[p2.x][p2.y]));
			step.push(this.savePoint(p3.x, p3.y, this.copy[p3.x][p3.y]));
			p1.x = p2.x;
			p1.y = p2.y;
		}
		this.steps.push(step);
		//重绘更新的格子
		this.drawmap.drawStep(step);
		//判断是否胜利
		this.isWin();
	},
	isWin: function() {
		var count = 0, self = this;
		this.copy.forEach(function(a){
			if(count) return;
			a.forEach(function(b){
				if(count) return;
				if(b === 80) {
					count++;
				}
			});
		});
		if(count) return false;
		//延时等重绘完弹出提示
		setTimeout(function(){
			if(self.level+1 === self.dataLen) {
				alert("您已完成全部关卡!");
				self.search(0);
			} else {
				alert("过关!");
				self.search(++self.level);
			}
		}, 200);
	},
	//重试
	retry: function(event) {
		var x = event.offsetX,
			y = event.offsetY;

		if(x>440 && x<560 && y>20 && y<60) {
			this.search(this.level);
		}
	}
};