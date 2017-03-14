//loadimg.js
define(function (){
	var source = {
		wall: 'images/Wall_Brown.png',
		ground: 'images/GroundGravel_Dirt.png',
		target: 'images/EndPoint_Beige.png',
		man: 'images/Character4.png',
		box: 'images/Crate_Beige.png',
		tbox: 'images/CrateDark_Beige.png'
	}, 
	loaded = false;
	//载入图片
	for(var key in source) {
		var imga = new Image();
		imga.src = source[key];
		source[key] = imga;
	}

	return {
		source: source
	}
});

	