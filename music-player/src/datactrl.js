require.config({
    paths : {
        "jquery" : ["//cdn.bootcss.com/jquery/3.1.1/jquery.min"]
    }
});
define(["jquery","musicdata"], function($, musicdata){
	var datas = musicdata.data,
		count = datas.length,
		index = 0,
		audio = document.querySelector("#audio"),
		durationTime = 0,
		timestr = '',
		loopflag = false;

	//获取歌曲信息
	var init = function(n){
		var num = n ? n : 0,
			infos = datas[num];
		audio.src = infos.link;
		updateHTML(infos);
	};
	//更新页面信息
	var updateHTML = function(data) {
		$(".song-tit .name").text(data.name);
		$(".song-tit .singer").text(data.singer);
		$(".song-pic img").attr('src', data.pic);
		$(".song-fun .time").text('00:00 / --:--');
	};
	//设置播放进度条
	var setProgress = function() {
		durationTime = audio.duration;
		timestr = timeFormat(durationTime);
		$(".song-fun .time").text('00:00 / '+timestr);
	};
	//格式化时间
	var timeFormat = function(sec) {
		var minute = Math.floor(sec/60)+'',
			second = Math.floor(sec%60)+'';

		minute = minute.length === 1 ? '0'+minute : minute;
		second = second.length === 1 ? '0'+second : second;

		return minute+':'+second;
	};
	//进度条动画
	var progress = function(){
		var now = audio.currentTime,
			percent = (1-now/durationTime)*100,
			nowstr = timeFormat(now);

		$(".song-fun .time").text(nowstr+' / '+timestr);
		$(".progressin").css('left','-'+percent+'%');
		if (percent > 0 && !audio.paused) {
	        requestAnimationFrame(progress);
	    }
	};
	var beginProgress = function() {
		requestAnimationFrame(progress);
	};
	
	//下一首
	var next = function() {
		if(index === count-1) {
			if(!loopflag) return false;
			index = -1;
		}
		index++;
		
		audio.pause();
		init(index);
		return true;
	};
	//上一首
	var prev = function() {
		if(index === 0) {
			if(!loopflag) return false;
			index = count;
		}
		index--;

		audio.pause();
		init(index);
		return true;
	};

	//点击设置进度条（快进）
	var setUpTime = function(percent) {
		var newtime = durationTime * percent;
		audio.currentTime = newtime;
	};
	//设置循环
	var setLoop = function() {
		loopflag = !loopflag;
		console.log(loopflag);
	};

	return {
		init: init,
		setProgress: setProgress,
		beginProgress: beginProgress,
		progress: progress,
		next: next,
		prev: prev,
		setUpTime: setUpTime,
		setLoop: setLoop
	}
});