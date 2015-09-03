var getSingleton = function(fn) {
	var result;
	return function() {
		return result || (result = fn.apply(this, arguments));
	};
};

var createOverlay = function() {
	var ele = document.createElement('div'),
		eleMsg = document.createElement('div');

	ele.className = 'overlay';
	eleMsg.className = 'overlay-mes';

	var html = '<i class="close">&times;</i>'
		+ '<p>创建新任务</p>'
		+ '<input type="text">'
		+ '<button class="ok">确定</button>'
		+ '<button class="cancel">取消</button>';

	eleMsg.innerHTML = html;

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
var createSingletonOverlay = getSingleton( createOverlay );
var overlay = createSingletonOverlay();

overlay.show();
setTimeout(function(){
	overlay.hide();
}, 3000);

