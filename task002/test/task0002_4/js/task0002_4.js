/**
 * TODO : 优化代码和组件化
 */

window.onload = function(){

  // 共有变量
  var index = -1,
    lastIndex = 0;

  /**
   * 初始化
   */
  var init = function(){
    index = -1,
    lastIndex = 0;
  };

  var oInput = $('#search input')[0],
    oUl = $('.match-text')[0];

  var showErr = function() {
    alert('fail!!!');
  };

  /**
   * 自动提示ui渲染
   * @param  {string} data 后台返回数据
   */
  var renderList = function(data) {
    if (data === 'empty') {
      data = '';
      oUl.style.display = 'none';
      return;
    }

    var arr = data.split(',');

    var html = '';

    for(var i = 0, len = arr.length; i < len; i++){
      html += '<li>' + arr[i] + '</li>';
    }

    oUl.innerHTML = html;
    oUl.style.display = 'block';
  };

  var clearList = function() {
    oUl.style.display = 'none';
  };

  /**
   * 数据匹配
   * @param  {object} event 
   */
  var getMatch = function(event) {
    var keyNum = event.keyCode || event.which;

    var query = trim(oInput.value);

    if (keyNum !== 38 && keyNum !== 40 && keyNum !== 13) {
      if (query === '') {
        clearList();
      }else{
        ajax('data.php', {
          type : 'POST',
          data : {
            "q" : query
          },
          onsuccess : renderList,
          onfail : showErr
        });
      }

      // 初始化
      init();
    }else{
      move(keyNum);
    }
  };

  /**
   * 选中handler
   * @param  {object} event 
   */
  var choose = function(event) {
    oInput.value = this.innerHTML;
    clearList();
    init();
  };

  /**
   * [move 键盘handler]
   * @param  {number} keyNum 键码
   */
  var move = function(keyNum) {
    var 
      lis = $('.match-text li'),
      len = lis.length,
      className = 'hover';

    switch(keyNum){
      case 38: // up
        lastIndex = index === -1 ? 0 : index;
        if (0 < index) {
          index--;
        }else{
          index = len - 1;
        }
        removeClass(lis[lastIndex], className);
        addClass(lis[index], className);
        break;

      case 40: // down
        lastIndex = index === -1 ? 0 : index;
        if (index < len - 1) {
          index++;
        }else{
          index = 0;
        }
        removeClass(lis[lastIndex], className);
        addClass(lis[index], className);
        break;

      case 13: // enter
        index = index === -1 ? 0 : index;
        choose.call(lis[index]);
        break;
    }
  };

  // 绑定输入事件监听 -------------------
  $.on(oInput, 'keyup', getMatch);

  // IE下的监听
  if (isIE()) {
    $.on(oInput, 'propertychnage', getMatch);    
  }

  // webkit
  $.on(oInput, 'input', getMatch);

  // 剪切和黏贴
  $.on(oInput, 'cut', getMatch);

  $.on(oInput, 'paste', getMatch);

  // 绑定选中监听 -----------------------
  $.delegate(oUl, 'li', 'click', choose);
}