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

var drawMap = function(selector) {
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

	this.canvas = document.querySelector(selector);
	this.canvas.width = this.default.cwidth;
	this.canvas.height = this.default.cheight;
	this.context = this.canvas.getContext("2d");
};
drawMap.prototype = {
	init: function() {
		var ctx = this.context;
		//清空
		ctx.clearRect(0,0,this.default.cwidth,this.default.cheight);
		//背景
		ctx.fillStyle= '#333';
		ctx.fillRect(0,0,this.default.cwidth,this.default.cheight);
	},
	initMap: function(data) {	//初始化地图
		this.mapSet.name = data.name;
		this.mapSet.beginX = Math.ceil((this.mapSet.col-data.size.width)/2)*this.mapSet.swidth;
		this.mapSet.beginY = Math.ceil((this.mapSet.row-data.size.height)/2)*this.mapSet.swidth;
		//console.log(this.mapSet);
		this.draw(data.map);
	},
	draw: function(data) {
		this.init();
		var ctx = this.context, map = this.mapSet, self = this, count = 0;
		//关卡名称
		ctx.font = "30px Microsoft Yahei bold";
		ctx.fillStyle = "white";
		ctx.fillText(map.name, 50, 50);
		//选择关卡
		ctx.font = "18px Microsoft Yahei";
		ctx.fillText("选择关卡：", 620, 36);
		//重试按钮
		this.roundRect(ctx, 340, 20, 120, 40, 5);
		ctx.strokeStyle = "#fff";
    	ctx.stroke(); 
    	ctx.font = "20px Microsoft Yahei bold";
    	ctx.fillStyle = "#fff";
		ctx.fillText("重试", 380, 46);

		data.forEach(function(row, i){
			row.forEach(function(item, j){
				if(item) {
					//统计未到达目标点的箱子的个数
					if(item === 80) {
						count++;
					}
					var key = self.keys[item];
					ctx.drawImage(source[key], map.beginX+j*map.swidth, map.beginY+i*map.swidth, map.swidth, map.swidth);
				}
			});
		});

		return count;
	},
	roundRect: function(ctx, x, y, w, h, r) {
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
	}
};

var manMove = function(data) {
	var self = this;
	this.data = data;
	this.dataLen = data.length;
	this.copy = [];
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

	this.drawmap = new drawMap("#boxCanvas");
	this.addSelector();
	this.search(0);

	document.addEventListener('keyup', function(e){
		self.keyControl(e, self);
	});
	document.querySelector("#boxCanvas").addEventListener('click', function(e){
		self.retry(e, self);
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
		//使select键盘操作失效
		select.onkeydown = function(e) { return false;};
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

		this.win = false;
		//设置select的值
		this.setSelector(this.level);
	},
	keyControl: function(event, self) {
		if(self.win) return;

		var p1 = self.point.p1,
			p2 = self.point.p2,
			p3 = self.point.p3;
		
		switch(event.keyCode) {
			case 37: 
				p2.x = p1.x;
				p2.y = p1.y-1;
				p3.x = p1.x;
				p3.y = p1.y-2;
				break;
			case 38:
				p2.x = p1.x-1;
				p2.y = p1.y;
				p3.x = p1.x-2;
				p3.y = p1.y;
				break;
			case 39: 
				p2.x = p1.x;
				p2.y = p1.y+1;
				p3.x = p1.x;
				p3.y = p1.y+2;
				break;
			case 40:
				p2.x = p1.x+1;
				p2.y = p1.y;
				p3.x = p1.x+2;
				p3.y = p1.y;
				break;
		}
		this.move();
	},
	move: function() {
		var p1 = this.point.p1,
			p2 = this.point.p2,
			p3 = this.point.p3;
			self = this;
		//前方一格如果是墙
		if(this.copy[p2.x][p2.y] === this.type.wall) return;
		//前方一格如果没有阻碍(地面或目标点)
		if(this.copy[p2.x][p2.y] === this.type.ground || this.copy[p2.x][p2.y] === this.type.target) {
			this.copy[p2.x][p2.y] += this.type.man;
			this.copy[p1.x][p1.y] -= this.type.man;
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
			p1.x = p2.x;
			p1.y = p2.y;
		}
		if(this.drawmap.draw(this.copy) === 0) {
			this.win = true;
			setTimeout(function(){
				if(self.level+1 === self.dataLen) {
					alert("您已完成全部关卡!");
					self.search(0);
				} else {
					alert("过关!");
					self.search(++self.level);
				}
			}, 300);
		}
	},
	retry: function(event, self) {
		var x = event.offsetX,
			y = event.offsetY;

		if(x>340 && x<460 && y>20 && y<60) {
			self.search(self.level);
		}
	}
};