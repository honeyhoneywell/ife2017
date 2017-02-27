//验证手机号码
function isPhoneNumber() {
	var numstring = document.querySelector('#pNum').value,
		regexp = /^1[35874]\d{9}$/;

	if(regexp.test(numstring)) {
		alert("正确的手机号码！");
	} else {
		alert("非法的手机号码！");
	}
}

//验证相邻重复单词
function isSameWord() {
	var string = document.querySelector('#pStr').value,
		regexp = /\b(\w+)\b\s+\1/;

	if(regexp.test(string)) {
		alert("有相邻重复单词！");
	} else {
		alert("没有相邻重复单词！");
	}
}

//获取按钮
var numBtn = document.querySelector("#numBtn");
var strBtn = document.querySelector("#strBtn");
//绑定事件
numBtn.addEventListener('click', isPhoneNumber);
strBtn.addEventListener('click', isSameWord);