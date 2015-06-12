window.onload = function() {
  var oCarousel = $('#carousel'),
    oCaInner = $('#carousel-inner'),
    oItem = oCaInner.getElementsByClassName('item');
  // console.log(oItem);

  // 公用变量
  var len = oItem.length;
  var itemWidth = parseInt(getStyle(oItem[0], 'width'), 10);
  var timer = null;
  var num = 0;

  // 初始化样式
  function init() {
    oCaInner.style.width = itemWidth * 4 + 'px';
    addDots();
    clearTimeout(timer);
    move();

    // stay();
  }
  init();

  // 滑动
  function move() {
    timer = setTimeout(function() {

      if (num === len) {
        num = 1; //此时应该从第二个块起步
      } else {
        num++;
      }

      if (num === len) {
        oItem[0].style.position = 'relative';
        oItem[0].style.left = itemWidth * len + 'px';
        doMove(oCaInner, 'left', -num * itemWidth, 50, function() {
          oItem[0].style.position = 'static';
          oItem[0].style.left = 0;
          oCaInner.style.left = 0;
        });
      } else {
        doMove(oCaInner, 'left', -num * itemWidth, 50);
      }

      move();
    }, 3000);
  }

  // 鼠标停止功能
  function stay(){
    // 添加鼠标悬停事件
    $.delegate(oCaInner, 'div', 'mouseover', function(){
      pause();
    });

    $.delegate(oCaInner, 'div', 'mouseout', function(){
      move();
    });
  }
  
  // 暂停动画
  function pause() {
    clearTimeout(timer);
  }

  // 停止
  function stopMove() {
    
  }

  // 添加小圆点
  function addDots(){
    var lis = '';

    var ol = document.createElement('ol');
    addClass(ol, 'carousel-indicators');

    for (var i = 1; i <= len; i++) {
      lis += '<li>'+i+'</li>'
    };
    ol.innerHTML = lis;

    ol.style.marginLeft = -len * 10 + 'px';
    $.delegate(ol, 'li', 'click', function(event){
      var e = arguments[0] || window.event,
        target = e.srcElement ? e.srcElement : e.target;

      dotNav(target);
    });

    oCarousel.appendChild(ol);
  }

  // 小圆点导航功能
  function dotNav(target){
    pause();
    num = parseInt(target.innerHTML) - 1;
    doMove(oCaInner, 'left', -num * itemWidth, 100);
    move();
  }
}

// 运动框架
function doMove(obj, attr, target, dir, endFn) {
  dir = parseInt(getStyle(obj, attr), 10) < target ? dir : -dir;

  clearInterval(obj.doMoveTimer);

  obj.doMoveTimer = setInterval(function() {
    var cValue = parseInt(getStyle(obj, attr), 10) + dir;

    if (cValue > target && dir > 0 || cValue < target && dir < 0) {
      cValue = target;
    }

    obj.style[attr] = cValue + 'px';

    if (cValue == target) {
      clearInterval(obj.doMoveTimer);
      // 执行回调函数
      endFn && endFn();
    }
  }, 15);
}

// 获取元素计算后的样式
// 某些元素的获取，在不同的浏览器上不同
function getStyle(ele, attr) {
  return getComputedStyle ? getComputedStyle(ele)[attr] : ele.currentStyle[attr];
}