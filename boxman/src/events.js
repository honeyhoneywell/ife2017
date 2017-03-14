//events.js
define(['mapData'], function (mapData){
	var keyControl = function(event) {
		if(mapData.winflag) return false;
		switch(event.keyCode) {
			case 37:    //左
				mapData.setPointVal(0, -1, 0, -2);
				break;
			case 38:    //上
				mapData.setPointVal(-1, 0, -2, 0);
				break;
			case 39:    //右
				mapData.setPointVal(0, 1, 0, 2);
				break;
			case 40:    //下
				mapData.setPointVal(1, 0, 2, 0);
				break;
			default:
				return false;
		}
		mapData.move();
	};
	//点击事件
	var canvasClick = function(event) {
		var x = event.offsetX,
			y = event.offsetY;

		//重试
		if(x>440 && x<560 && y>20 && y<60) {
			mapData.retry();
		}
		//撤消
		if(x>240 && x<360 && y>20 && y<60) {
			mapData.cancelMove();
		}
	}

	return {
		keyControl: keyControl,
		canvasClick: canvasClick
	}
});

	