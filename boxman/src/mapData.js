//mapData.js
define(['gameData', 'drawMap'], function (gameData, drawMap){
	var data = gameData.data,
		levelsum = data.length,
		copy = [],
		steps = [],
		level = 0,
		winflag = false,
		points = {
			p1: {x:0, y:0},
			p2: {x:0, y:0},
			p3: {x:0, y:0}
		},
		keys = {
			wall: 5,
			ground: 10,
			bground: 80,
			target: 20,
			btarget: 90,
			man: 50,
			box: 70
		};

	//添加关卡选择器
	var addSelector = function() {
		var container = document.querySelector(".container"),
			select = document.createElement('select');
		select.className = "selector";
		for(var i=0; i<levelsum; i++) {
			var opt = document.createElement('option');
			opt.value = i;
			opt.innerHTML = '第'+(i+1)+'关';
			select.appendChild(opt);
		}
		select.onchange = function(e) {
			e.preventDefault();
			search(this.selectedIndex);
		};
		//使select键盘操作失效(火狐无效)
		select.onkeydown = function(ev) {
			if(!document.all) this.blur(); // firefox
			return false;
		};
		container.appendChild(select);
	};
	//select设值
	var setSelector = function(n) {
		var options = document.querySelectorAll('.selector option');
		options.forEach(function(op, i){
			if(i === n) {
				op.setAttribute('selected','selected');
			} else {
				op.removeAttribute('selected');
			}
		});
	};

	//查找关卡，并在画布上画出
	var search = function(num) {
		if(num > levelsum || num < 0) {
			alert('此关不存在!');
			return false;
		}
		//保存此关信息
		level = num;
		copy = JSON.parse(JSON.stringify(data[num].map));
		points.p1.x = data[num].mpoint.x;
		points.p1.y = data[num].mpoint.y;
		drawMap.initMap(data[num]);
		steps.length = 0;

		winflag = false;
		//设置select的值
		setSelector(level);
	};

	//判断是否胜利
	var isWin = function() {
		var count = 0;
		copy.forEach(function(a){
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
			if(level+1 === levelsum) {
				alert("您已完成全部关卡!");
				search(0);
			} else {
				alert("过关!");
				search(++level);
			}
		}, 200);
	};
	//设置每次移动时可能会动的三个点的坐标
	var setPointVal = function(a, b, c, d) {	//设置可能移动端点点坐标
		points.p2.x = points.p1.x + a;
		points.p2.y = points.p1.y + b;
		points.p3.x = points.p1.x + c;
		points.p3.y = points.p1.y + d;
	};
	//保存移动前或移动后的点和值得状态
	var savePointState = function(len) {
		var arr = [];
		for(var i=1; i<=len; i++) {
			var nobj = new Object();
			nobj.x = points['p'+i].x;
			nobj.y = points['p'+i].y;
			nobj.val = copy[nobj.x][nobj.y];
			arr.push(nobj);
		}
		return arr;
	};
	var move = function() {
		var p1 = points.p1,
			p2 = points.p2,
			p3 = points.p3,
			step = {		//每次移动最多3个点，保存每次移动前和移动后端状态
				before: '',
				after: ''
			};
		
		//前方一格如果是墙
		if(copy[p2.x][p2.y] === keys.wall) return;
		//前方一格如果没有阻碍(地面或目标点)
		if(copy[p2.x][p2.y] === keys.ground || copy[p2.x][p2.y] === keys.target) {
			step.before = savePointState(2);
			copy[p2.x][p2.y] += keys.man;
			copy[p1.x][p1.y] -= keys.man;
			step.after = savePointState(2);
			p1.x = p2.x;
			p1.y = p2.y;
		}
		//前方一格如果是箱子
		if(copy[p2.x][p2.y] === keys.bground || copy[p2.x][p2.y] === keys.btarget) {
			//前方第二格如果是箱子或墙则不动
			if(copy[p3.x][p3.y] === keys.wall || copy[p3.x][p3.y] === keys.bground || copy[p3.x][p3.y] === keys.btarget) return;
			step.before = savePointState(3);
			copy[p3.x][p3.y] += keys.box;
			copy[p2.x][p2.y] -= (keys.box - keys.man);
			copy[p1.x][p1.y] -= keys.man;
			step.after = savePointState(3);
			p1.x = p2.x;
			p1.y = p2.y;
		}
		steps.push(step);
		drawMap.drawStep(step.after);
		isWin();
	};

	//重试
	var retry = function() {
		search(level);
	};
	//撤消
	var cancelMove = function() {
		var slen = steps.length;

		if(slen === 0) {
			alert("您已经无法再撤消了！");
			return;
		}
		var step = steps.pop();
		//还原画布
		drawMap.drawStep(step.before);
		//还原this.copy数组
		step.before.forEach(function(item){
			copy[item.x][item.y] = item.val;
		});
		points.p1.x = step.before[0].x;
		points.p1.y = step.before[0].y;
	}
	
	//初始化
	addSelector();
	search(0);

	return {
		winflag: winflag,
		move: move,
		setPointVal: setPointVal,
		retry: retry,
		cancelMove: cancelMove
	}
});

	