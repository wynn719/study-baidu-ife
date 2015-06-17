/**
 * [extend 整合默认config] 如果新的config中缺少默认config的项，新的config中填充
 * @param  {Object} oldSrc 默认配置
 * @param  {Object} src    自定义配置
 * @return {Object}        完整的自定义配置
 */
function extend (defaultOptions, options){
  var key = null;

  for(key in defaultOptions){
    if (!options.hasOwnProperty(key)) {
      options[key] = defaultOptions[key];
    }
  }

  return options;
}

// 获取元素计算后的样式
// 某些元素的获取，在不同的浏览器上不同
function getStyle(ele, attr) {
  return getComputedStyle ? getComputedStyle(ele)[attr] : ele.currentStyle[attr];
}

var Slider = function(element){
  this.oCarousel = $('.carousel')[0];
  this.oCaInner = $('.carousel-inner')[0];
  this.oItem = $('.carousel-inner .item');
  this.len = this.oItem.length,
  this.itemWidth = 1000,
  this.timer = null,
  this.index = 1;

  var self = this;
};

Slider.prototype = {
  // 默认配置
  options : {
    speed : 2000,
    circul : true,
    direct : true
  },

  // 初始化
  init : function(options){
    var _ = this;

    _.options = window.extend(_.options, options);

    _.render();

    _.slide();
  },

  // 渲染
  render : function(){
    var _ = this;

    _.oCaInner.style.width = _.itemWidth * 4 + 'px';

    var lis = '';

    var ol = document.createElement('ol');
    addClass(ol, 'carousel-indicators');

    for (var i = 1; i <= _.len; i++) {
      lis += '<li>'+i+'</li>'
    };
    ol.innerHTML = lis;

    ol.style.marginLeft = -_.len * 10 + 'px';
    $.delegate(ol, 'li', 'click', function(event){
      _.nav( parseInt(this.innerHTML) );
    });

    _.oCarousel.appendChild(ol);
  },

  // 移动
  slide : function(){
    var _ = this,
      oItem = _.oItem,
      itemWidth = _.itemWidth,
      len = _.len,
      oCaInner = _.oCaInner;

    function run (){
      console.log(_.index);

      if (_.index === len) {
        oItem[0].style.position = 'relative';
        oItem[0].style.left = itemWidth * len + 'px';
        _.move(oCaInner, 'left', -_.index * itemWidth, 100, function() {
          oItem[0].style.position = 'static';
          oItem[0].style.left = 0;
          oCaInner.style.left = 0;
        });
      } else {
        _.move(oCaInner, 'left', -_.index * itemWidth, 100);
      }

      if (_.index === len) {
        _.index = 1; //此时应该从第二个块起步
      } else {
        _.index++;
      }

      _.timer = setTimeout(arguments.callee, _.options.speed);
    }

    setTimeout(function(){
      run();
    }, _.options.speed);
  },

  stop : function(){
    var _ = this;
    clearTimeout(_.timer);
  },

  // 导航
  nav : function(index){
    var _ = this,
      oItem = _.oItem,
      itemWidth = _.itemWidth,
      len = _.len,
      oCaInner = _.oCaInner,
      target = (index - 1) * itemWidth;

    _.index = index;

    _.stop();

    _.move(oCaInner, 'left', -target, 100, function(){
      setTimeout(function(){
        _.slide.call(_);
      }, _.options.speed);
    });
  },

  /**
   * [move 动画函数，使attr属性从当前值递增到target值]
   * @param  {HTMLElement} obj  元素 
   * @param  {string} attr   元素的属性
   * @param  {number} target 属性变化目标值
   * @param  {number} dir    变化幅度
   * @param  {function} endFn  回调函数
   * @return {[type]}        
   */
  move : function(obj, attr, target, dir, endFn){
    dir = parseInt(getStyle(obj, attr), 10) < target ? dir : -dir;

    var cValue = 0;

    clearTimeout(obj.doMoveTimer);

    function go(){
      cValue = parseInt(getStyle(obj, attr), 10) + dir;

      if (cValue > target && dir > 0 || cValue < target && dir < 0) {
        cValue = target;
      }

      obj.style[attr] = cValue + 'px';

      if (cValue === target) {
        clearTimeout(obj.doMoveTimer);

        // 执行回调函数
        endFn && endFn();
      }else{
        obj.doMoveTimer = setTimeout(arguments.callee, 25);
      }
    }

    go();
  }
};

window.onload = function(){
  var slider = new Slider();
  slider.init({
    speed : 3000,
    circul : false
  });
}