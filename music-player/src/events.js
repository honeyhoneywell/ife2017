require.config({
    paths : {
        "jquery" : ["//cdn.bootcss.com/jquery/3.1.1/jquery.min"]
    }
});
define(["jquery","datactrl"], function($, datactrl){
	var audio = document.querySelector("#audio");
	
	//初始化
	datactrl.init();

	var startPlay = function() {
		datactrl.setProgress();
		setPlay();
	};

	//播放、暂停
	var setPlay = function() {
		$("#playBtn").html('<i class="icons icon-pause"></i>');
		audio.play();
		datactrl.beginProgress();
	};
	var setPause = function() {
		$("#playBtn").html('<i class="icons icon-play"></i>');
		audio.pause();
	};
	var play = function() {
		if(audio.paused) {
			setPlay();
		} else {
			setPause();
		}
	};
	//上一首
	var prevSong = function() {
		if(datactrl.prev() === false) {
			showMsg("没有上一首了！");
		}
	};
	//下一首
	var nextSong = function() {
		if(datactrl.next() === false) {
			showMsg("没有下一首了！");
		}
	};
	//进度条点击
	var move = function(e) {
		var x = e.offsetX,
			width = this.offsetWidth,
			percent = x/width;

		datactrl.setUpTime(percent);
	};
	//音量条点击
	var volume = function(e) {
		var y = e.offsetY,
			height = this.offsetHeight,
			val = y/height,
			percent = (1-val)*100;
		audio.volume = val;
		percent = percent<4 ? 0 : percent;
		$(".volbarin").css('top','-'+percent+'%');
	};

	//信息框
	var showMsg = function(msg) {
		if($('.msgbox').length == 0) {
			var msgbox = document.createElement('div');
			msgbox.className = 'msgbox';
			$('.controls').append(msgbox);
		}
		$('.msgbox').text(msg);
		$('.msgbox').addClass('show');
		setTimeout(function(){
			$('.msgbox').removeClass('show');
		}, 2000);
	};
	//音量键
	var volClick = function() {
		if($("#voluBtn").hasClass("active")) {
			$("#voluBtn").removeClass("active");
			$(".volcontrol").removeClass("show");
			return;
		}
		$("#voluBtn").addClass("active");
		$(".volcontrol").addClass("show");
	};
	//循环
	var loopClick = function() {
		if($("#loopBtn").hasClass("active")) {
			$("#loopBtn").removeClass("active");
		} else {
			$("#loopBtn").addClass("active");
		}
		datactrl.setLoop();
	};


	return {
		startPlay: startPlay,
		play: play,
		setPause: setPause,
		next: nextSong,
		prev: prevSong,
		move: move,
		volume: volume,
		volClick: volClick,
		loopClick: loopClick
	}
});