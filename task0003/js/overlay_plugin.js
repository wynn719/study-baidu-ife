var getSingleton = function(fn) {
	var result;
	return function() {
		return result || (result = fn.apply(this, arguments));
	};
};

var createOverlay = function() {
	var ele = document.createElement('div'),
		eleMsg = document.createElement('div')
		arr = [];

	ele.className = 'overlay';
	eleMsg.className = 'overlay-mes';

	arr.push('<i class="close">&times;</i>');
	arr.push('<p>创建新任务</p>');
	arr.push('<input type="text">');
	arr.push('<button class="ok">确定</button>');
	arr.push('<button class="cancel">取消</button>');

	eleMsg.innerHTML = arr.join('');

	document.body.appendChild(ele);
	document.body.appendChild(eleMsg);

	ele.setMsg = function (msg) {
		eleMsg.getElementsByName('p').innerHTML = msg;
	};
	
	ele.show = function() {
		this.style.display = 'block';
		eleMsg.style.display = 'block';
	};
	ele.hide = function() {
		this.style.display = 'none';
		eleMsg.style.display = 'none';
	};

	return ele;
};

/**
 * 测试用例
 */
// var overlay = createSingletonOverlay();
// var createSingletonOverlay = getSingleton( createOverlay );

// overlay.show();
// setTimeout(function(){
// 	overlay.hide();
// }, 3000);

