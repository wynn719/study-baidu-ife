/**
 * TODO:代码需要优化
 */

window.onload = function(){

  // 获取元素
  var wrapper = document.getElementById('wrapper'),
    box1 = document.getElementById('box1'),
    box2 = document.getElementById('box2');

  var lastDragEle = null;

  // 获取定位元素的宽和高，用于限制拖放范围
  var wrapperW = wrapper.clientWidth, 
    wrapperH = wrapper.clientHeight;

  var DragDrop = function (){

    var dragging = null,
      diffX = 0,
      diffY = 0,
      targetW = 0,
      targetH = 0;

    /**
     * DragDrop 统一事件处理
     * @param  {event} event 
     */
    function handleEvent(event){

      var target = this;

      if (event.preventDefault) {
        event.preventDefault();
      }else{
        event.returnValue = false;
      }

      switch(event.type){
        case 'mousedown':

          // 选中元素
          if (target !== box1 && target !== box2 && hasClass(target, 'drag')) {
            dragging = target;
            targetW = dragging.offsetWidth;
            targetH = dragging.offsetHeight;
            diffX = event.clientX - target.offsetLeft;
            diffY = event.clientY - target.offsetTop;
          }

          break;

        case 'mousemove':
          if (dragging !== null) {

            // 限制上下拖放范围
            if (event.clientY <= diffY) {
              dragging.style.top = 0;
            } else if (event.clientY >= wrapperH - targetH + diffY) {
              dragging.style.top = (wrapperH - targetH) + 'px';
            } else{
              dragging.style.top = (event.clientY - diffY) + "px";
            }
            
            // 限制左右拖放范围
            if (event.clientX <= diffX) {
              dragging.style.left = 0;
            } else if (event.clientX >= wrapperW - targetW + diffX) {
              dragging.style.left = (wrapperW - targetW) + 'px';
            }else{
              dragging.style.left = (event.clientX - diffX) + "px";
            }

          }
          break;

        case 'mouseup':

          // 判断释放的元素是否在box中
          if (dragging !== null) {
            if (isInBox(dragging, box1)) {
              dragging.className = 'item';
            } else if (isInBox(dragging, box2)) {
              dragging.className = 'item';
            } else{
              dragging.className = 'item';
            }
          }

          dragging = null;
          break;
      }

      /**
       * 判断是否在指定盒子里
       * @param {HTMLElement} dragging 拖动的元素
       * @param  {Object}  box 盒子元素
       * @return {Boolean}      是否在盒子里
       */
      function isInBox(dragging, box){
        var boxRange = getBoxRange(box),
          items = box.getElementsByTagName('div'),
          len = items.length;

        var dt = dragging.offsetTop,
          dl = dragging.offsetLeft,
          dw = dragging.offsetWidth,
          dh = dragging.offsetHeight;

        if ((dt + dh) > boxRange.top
          && dt < boxRange.bottom
          && (dl + dw) > boxRange.left
          && dl < boxRange.right) {
          insertItem();
          return true;
        }

        /**
         * 插入指定的位置
         * @return {[type]} [description]
         */
        function insertItem(){
          var index = 0;

          if (len === 0 || dt > items[len - 1].offsetTop) {
            box.appendChild(dragging);
          }else if (dt < items[0].offsetTop) {
            box.insertBefore(dragging, items[0]);
          }else{
            index = parseInt((dt - boxRange.top) / dh) + 1;
            box.insertBefore(dragging, items[index]);
          }
        }

        return false;
      }
    }

    /**
     * 获取盒子四条边在容器中的位置
     * @param  {HTMLElement} ele 盒子元素
     * @return {Object}          盒子四条边的位置     
     */
    function getBoxRange(ele){
      return {
        left : ele.offsetLeft,
        top : ele.offsetTop,
        right : ele.offsetLeft + ele.clientWidth,
        bottom : ele.offsetTop + ele.clientHeight
      };
    }

    // 暴露接口
    return {
      enable : function(){
        $.on(document, 'mousedown', handleEvent);
        $.on(document, 'mousemove', handleEvent);
        $.on(document, 'mouseup', handleEvent);
      },

      disable : function(){
        $.un(document, 'mousedown', handleEvent);
        $.un(document, 'mousemove', handleEvent);
        $.un(document, 'mouseup', handleEvent);
      }
    };
  }();

  /**
   * item选择监听
   * @param  {event} event 
   */
  var selectHandle = function(event){

    var target = this;

    // 阻止默认事件
    if (event.preventDefault) {
      event.preventDefault();
    }else {
      event.returnValue = false;
    }

    var diffX = event.clientX - target.offsetLeft;
    var diffY = event.clientY - target.offsetTop;
    
    if (lastDragEle && lastDragEle !== target) {
      removeClass(lastDragEle, 'drag');
    }

    // 添加可拖动标识
    addClass(target, 'drag');

    // 修正当前位置
    target.style.left = (event.clientX - diffX) + "px";
    target.style.top = (event.clientY - diffY) + "px";

    lastDragEle = target;

    return false;
  };

  $.delegate(box1, 'div', 'mousedown', selectHandle);
  $.delegate(box2, 'div', 'mousedown', selectHandle);

  DragDrop.enable();
}