require.config({
    paths : {
        "jquery" : ["//cdn.bootcss.com/jquery/3.1.1/jquery.min"],
        "bootstrap" : ["//cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min"] 
    }
});
require(["jquery", "events"], function($, events){
	//audio对象
	var audio = $("#audio");

	//开始加载歌曲
	audio.on('canplay', function(){
		events.startPlay();
	});
	//一首歌结束
	audio.on('ended', function(){
		events.setPause();
		events.next();
	});
	//播放、暂停键
	$("#playBtn").click(events.play);
	//下一首
	$("#nextBtn").click(events.next);
	//上一首
	$("#prevBtn").click(events.prev);
	//进度条点击
	$(".clickbar").click(events.move);
	//音量条点击
	$(".volbarclick").click(events.volume);
	//音量键
	$(".volcontrol").click(function(e){
		e.stopPropagation();
	});
	$(window).click(function(e){
		if(e.target === $("#voluBtn")[0]) {
			events.volClick();
		} else if($(".volcontrol").hasClass("show")) {
			events.volClick();
		}
	});
	//循环
	$("#loopBtn").click(events.loopClick);
});