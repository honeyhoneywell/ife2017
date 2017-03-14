require(['loadimg', 'mapData', 'events'], function(loadimg, mapData, events){
	//keyup事件
	document.addEventListener('keyup', events.keyControl);
	//canvas点击事件
	document.querySelector("#topcanvas").addEventListener('click', events.canvasClick);
});