var myMenu = function() {
	var that = this;
	this.menuitem = ["条目1","条目2","条目3"];		//菜单条目
	
	this.menubox = document.createElement("div");		//创建右键菜单并添加内容
	this.menubox.className = "cus-menu";
	this.menuitem.forEach(function(elem) {		//添加菜单子条目
		var newitem = document.createElement("div");
		newitem.className = "cus-item";
		newitem.innerHTML = elem;
		newitem.onclick = function() {
			alert(this.innerHTML);
		};
		that.menubox.appendChild(newitem);
	});

	this.append = function() {		//添加到文档中
		var contain = document.querySelector('body');
		contain.append(this.menubox);
	};
};
//设置位置信息
var setMenu = function(event) {
	var cmenu = document.querySelector(".cus-menu"),
		oWidth = window.innerWidth,
		oHeight = window.innerHeight,
		menuWidth = 150,
		menuHeight = cmenu.offsetHeight;

	//设置位置
	var setPosition = function(x, y) {
		x = (x+menuWidth)>=oWidth? x-=menuWidth : x;
		y = (y+menuHeight)>=oHeight? y-=menuHeight : y;
		cmenu.style.left = x+'px';
		cmenu.style.top = y+'px';
		mposi.x = x;
		mposi.y = y;
	};

	setPosition(event.clientX, event.clientY);
	showMenu();
};
//隐藏窗口
var hideMenu = function() {
	var cmenu = document.querySelector(".cus-menu");
	cmenu.style.visibility = "hidden";
	showFlag = false;
}
//显示窗口
var showMenu = function() {
	var cmenu = document.querySelector(".cus-menu");
	cmenu.style.visibility = "visible";
	showFlag = true;
}

var newMenu = new myMenu(),
	mposi = {x:0,y:0},
	showFlag = false;

window.addEventListener("contextmenu", function(event){
	event.returnValue = false;

	//如果文档中还不存在菜单，添加
	if(!document.querySelector('.cus-menu')) {
		newMenu.append();
	}

	setMenu(event);
});

window.addEventListener('click', function(event){
	var ex = event.clientX,
		ey = event.clientY,
		my = document.querySelector(".cus-menu").offsetHeight;


	if(showFlag) {
		if(ex<mposi.x || ex>mposi.x+150 || ey<mposi.y || ey>mposi.y+my) {
			hideMenu();
		}
	}
})