// 任务2 --------------------------------------------------------
function isArray(arr) {

  // 如果直接使用 intanceof ，在多窗体（frame）中无法存在,
  // 因为有几个不同的 javascript 全局环境，导致构造函数的实例不同

  // Object.prototype.toString.call(arr)不存在多个全局环境的问题
  // 适用于内置对象，而不适用于外置对象，如 JSON
  return Array.prototype.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) === '[object Array]';
}

function isFunction(fn) {

  // typeof 检测虽然支持多窗口检测，但是不能识别 Regex
  // 检测 Regex 时也会弹出 function
  // return typeof fn === 'function';

  return Object.prototype.toString.call(fn) === '[object Function]';
}

function isRegExp(re) {
  return Object.prototype.toString.call(re) === '[object RegExp]';
}

/*
 * 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
 * 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
 */
function cloneObject(src) {

  // 是否不为函数和正则
  if (!(isFunction(src) && isRegExp(src))) {
    var o;

    if (isArray(src)) {
      o = [];
    } else {
      o = {};
    };

    for (var i in src) {

      // 判断是否有实例属性
      if (src.hasOwnProperty(i)) {

        // 深度递归
        if (typeof src[i] === 'object') {
          o[i] = cloneObject(src[i]);
        } else {
          o[i] = src[i];
        }

      }
    }

    return o;
  }
}

/*
 * 简单数组去重
 */
function uniqArray(arr) {

  if (isArray(arr)) {

    for (var i = 0; i < arr.length; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i] === arr[j]) {
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;

  }
}

/*function simpleTrim(str) {
  if (String.prototype.trim) {
    return str.trim();
  } else {
    var begin = 0,
      end = 0;
    for (var i = 0; i < str.length; i++) {
      if (str.charAt(i) !== ' ') {
        begin = i;
        break;
      }
    }
    for (var i = str.length - 1; i >= 0; i--) {
      if (str.charAt(i) !== ' ') {
        end = i + 1;
        break;
      }
    }

    return str.slice(begin, end);
  }
}*/

function trim(str) {
  if (typeof str === 'string') {
    return String.prototype.trim ? str.trim() : str.replace(/^\s+|\s+$/g, 'string');
  }
}

/*
 * 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
 */
function each(arr, fn) {
  if (isArray(arr) && isFunction(fn)) {
    if (!fn) {
      return;
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      fn(arr[i], i);
    }
  }
}

/*
 * 获取一个对象里面第一层元素的数量，返回一个整数
 */
function getObjectLength(obj) {
  var count = 0;
  for (var i in obj) {

    // 如果是个内置对象，跳过内置属性
    // hasOwnProperty 会忽略掉那些从原型链上继承到的属性。

    // 在获取元素时，元素有内置属性，
    // @bug 但是 length 是属于实例属性，返回值会+1
    if (!Object.prototype.hasOwnProperty.call(obj, i)){
      continue;
    }
    count++;
  }
  return count;
}

function isEmail(emailStr) {
  if (typeof emailStr ==='string') {
    var re = /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i;
    return re.test(emailStr);
  }
}

function isMobilePhone(phone) {
  if (typeof phone === 'string') {
    var re = /^1(3|4|5|7|8){1}\d{9}$/g;
    return re.test(phone);
  }
}

// 任务3 --------------------------------------------------------
function hasClass(element, classname){
  var cn = element.className;

  // 判断 classname 是否无值，或者是空格
  if (cn !== '' && !(/\s/.test(cn))) {

    // classList ECMAScript5
    // 调用原生js的判断classname方法
    if (element.classList && element.classList.contains) {
      return element.classList.contains(cn);
    } else {

      // jquery中的做法
      return (' ' + cn + ' ').indexOf(' ' + classname + ' ') !== -1;
    }
  }
}

function addClass(element, newClassName) {

  // 判断newClassName是否单一
  if (/\s/.test(newClassName)) {
    throw new TypeError('only accept a single class name');
  }

  if (newClassName) {

    if (element.classList) {
      element.classList.add(newClassName);
    } else if (!hasClass(element, newClassName)) {
      element.className += ' ' + newClassName;
    }

  }
}

function removeClass(element, oldClassName) {

  if (/\s/.test(oldClassName)) {
    throw new TypeError('only accept a single className');
  }

  if (oldClassName) {

    if (element.classList) {
      element.classList.remove(oldClassName);
    } else if (hasClass(element, oldClassName)) {
      var aCns = element.className.split(' ');

      // 去除指定class
      for (var i = 0; i < aCns.length; i++) {
        aCns[i] === oldClassName && aCns.splice(i, 1);
      }
      element.className = aCns.join(' ');
    }

  }
}

function isSiblingNode(element, siblingNode) {

  // 都不是元素的时候
  if (!element || !siblingNode) {
    return false;
  }

  // 同一个元素的情况下
  if (element === siblingNode) {
    return true;
  }

  if (element.nodeType === 1 && siblingNode.nodeType === 1) {
    return element.parentNode === siblingNode.parentNode ? true : false;
  }
}

function getPosition(element) {

  // 对于表格和内嵌框架布局的页面，由于不同浏览器实现方式不一样，
  // 得到的值不够精确
  var pos = {
    x: 0,
    y: 0
  };

  while (element) {
    pos.x += element.offsetLeft;
    pos.y += element.offsetTop;
    element = element.offsetParent;
  }

  return pos;
}

// 实现一个简单的Query，好难啊,尚未实现！！！！！！！！
function $(selector, eleScope) {
  var root = window.document;
  var SELECTOR_ERROR = 'only accept a valid string',
    cn = '', // 临时变量
    elArr = []; // 元素集合

  if (typeof selector === 'string') {

    // 处理空字符串
    if (selector === '') {
      return null;
    }

    // 处理两边空，左边空，右边空
    if (/^ +.* +$/.test(selector) || /^ +.*$/.test(selector) || /^.* +$/.test(selector)) {
      return null;
    }

    // 判断是否为组合
    if (selector.split(' ').length === 1) {

      /*
       * 非组合
       */

      // 处理id
      if (/^#\S+$/.test(selector)) {
        console.log('handle id');

        return root.getElementById(selector.substr(1));
      }

      // 处理tag
      if (/^[a-z]+$/.test(selector.toLowerCase())) {
        console.log('handle tag');

        elArr = root.getElementsByTagName(selector);
        return elArr.length === 0 ? null : elArr;
      }

      // 处理class
      if (/^\.\S+$/) {
        console.log('handle class');

        selector = selector.substr(1);

        // 检测浏览器支不支持getElementsByClassName
        if (root.getElementsByClassName) {
          return root.getElementsByClassName(selector);
        } else {

          // 旧版本的浏览器选择class
          var els = root.getElementsByTagName('*');

          for (var i = 0, len = els[i].length; i < len; i++) {

            // 元素
            if (els[i].nodeType && els[i].nodeType === 1) {

              cn = ' ' + els[i].className + ' ';

              // 是否为指定class
              if (cn.indexOf(' ' + selector + ' ') !== -1) {

                elArr.push(els[i]);
              }
            }
          }

          return elArr.length === 0 ? null : elArr;
        }

        return null;
      }

      // 处理attribute
      

      // 处理attribute=value

    }else{

      /*
       * 组合
       */

      console.log('handle complex');

      var selArr = selector.split(' ');
      
      // 处理父子关系
      if (selArr[1].parentNode !== selArr[0]) {
        return null;
      }else{

        // 层级关系
        
      }
    }

  }else{
    throw new TypeError(SELECTOR_ERROR);
  }
}

// 任务4
/*function addEvent(element, event, listener) {
  if (element.nodeType && event) {
    if (element.addEventListener) {
      element.addEventListener(event, listener, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, function() {
        listener.call(element);
      });
    } else {
      element['on' + event] = listener;
    }
  }
}

function removeEvent(element, event, listener) {
  if (element.nodeType && event) {
    if (element.removeEventListener) {
      element.removeEventListener(event, listener, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + event, listener);
    } else {
      element['on' + event] = null;
    }
  };
}

function addClickEvent(element, listener) {
  addEvent(element, 'click', listener);
}

function addEnterEvent(element, listener) {
  addEvent(element, 'mouseenter', listener);
}

// 实现事件代理函数
function delegateEvent(element, tag, eventName, listener) {

  if (element.nodeType && eventName) {

    if (element.addEventListener) {
      element.addEventListener(eventName, function() {

        var e = arguments[0] || window.event,
          target = e.srcElement ? e.srcElement : e.target;

        if (target.nodeName.toLowerCase() === tag) {
          listener.call(target);
        };

      }, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, function() {
        var e = arguments[0] || window.event,
          target = e.srcElement ? e.srcElement : e.target;

        if (target.nodeName.toLowerCase() === tag) {
          listener.call(target);
        };
      });
    } else {
      element['on' + eventName] = function() {
        var e = arguments[0] || window.event,
          target = e.srcElement ? e.srcElement : e.target;

        if (target.nodeName.toLowerCase() === tag) {
          listener.call(target);
        };
      }
    }

  }
}*/

$.on = function (element, event, listener) {
  if (element.nodeType && event) {
    if (element.addEventListener) {
      element.addEventListener(event, listener, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, function() {
        listener.call(element);
      });
    } else {
      element['on' + event] = listener;
    }
  }
}

$.un = function (element, event, listener) {
  if (element.nodeType && event) {
    if (element.removeEventListener) {
      element.removeEventListener(event, listener, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + event, listener);
    } else {
      element['on' + event] = null;
    }
  };
}

$.click = function (element, listener) {
  $.on(element, 'click', listener);
}

$.enter = function(element, listener) {
  $.on(element, 'keydown', function(event) {
    var e = event || window.event;
    var keyC = e.keyCode || e.which;

    if (keyC === 13) {
      listener.call(element);
    };
  })
}

// 实现事件代理函数
$.delegate = function (element, tag, eventName, listener) {

  if (element.nodeType && eventName) {

    if (element.addEventListener) {
      element.addEventListener(eventName, function() {

        var e = arguments[0] || window.event,
          target = e.srcElement ? e.srcElement : e.target;

        if (target.nodeName.toLowerCase() === tag) {
          listener.call(target);
        };

      }, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, function() {
        var e = arguments[0] || window.event,
          target = e.srcElement ? e.srcElement : e.target;

        if (target.nodeName.toLowerCase() === tag) {
          listener.call(target);
        };
      });
    } else {
      element['on' + eventName] = function() {
        var e = arguments[0] || window.event,
          target = e.srcElement ? e.srcElement : e.target;

        if (target.nodeName.toLowerCase() === tag) {
          listener.call(target);
        };
      }
    }

  }
}

// 任务5 ------------------------------------------------------
function isIE() {
  var ua = navigator.userAgent,
    ver = null;

  // 检测用户代理字符串
  if (/MSIE ([^;]+)/.test(ua)) {
    ver = RegExp['$1'];
    return ver;
  } else {
    return -1;
  }
}

function setCookie(cookieName, cookieValue, expiredays) {
  var cookieText = encodeURIComponent(cookieName) + '=' + encodeURIComponent(cookieValue);

  // 设置cookie的有效时间
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);

  cookieText += ((expiredays == null) ? '' : ',expires=' + exdate.toGMTString());

  document.cookie = cookieText;
}

function getCookie(cookieName) {
  var cookieName = encodeURIComponent(cookieName) + '=',
    cStart = document.cookie.indexOf(cookieName),
    cValue = null;

  if (cStart != -1) {
    var cEnd = document.cookie.indexOf(';', cStart);

    if (cEnd == -1) {
      cEnd = document.cookie.length;
    };

    cValue = decodeURIComponent(document.cookie.substring(cStart + cookieName.length, cEnd));
  }
  return cValue;
}

// 任务6 ---------------------------------------------------------
function params(data) {
  var arr = [];
  for (var i in data) {
    arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
  }
  return arr.join('&');
}

function ajax(url, options) {
  var xhr = null;

  if (!options.type) {
    options.type = 'get';
  };

  try {
    xhr = new XMLHttpRequest();
  } catch (e) {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }

  url = url + '?rand=' + Math.random();

  options.data = params(options.data);

  if (options.type === 'get') {
    url = url.indexOf('?') == -1 ? url + '?' + options.data : url + '&' + options.data;
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        options.onsuccess && options.onsuccess(xhr.responseText, xhr);
      } else {
        options.onerror && options.onerror(xhr);
      }
    };
  };

  if (options.type === 'post') {
    xhr.open(options.type, url, false);
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    xhr.send(options.data);
  } else {
    xhr.open(options.type, url, false);
    xhr.send(null);
  }
}

// BOM ---------------------------------------------------
// window对象
function getPageSize(){
  var pageWidth = window.innerWidth,
    pageHeight = window.innerHeight;

  if (typeof pageWidth != 'number') {
    if(document.compatMode == 'CSS1Compat'){
      // 标准模式下
      pageWidth = document.documentElement.clientWidth;
      pageHeight = document.documentElement.clientHeight;
    }else{
      // 混杂模式下
      pageWidth = document.body.clientWidth;
      pageHeight = document.body.clientHeight;
    }
  };

  return {
    'pageWidth' : pageWidth,
    'pageHeight' : pageHeight
  }
}

// location对象
function getQueryStringArgs() {
  // 取得查询的字符串并去掉?
  var qs = (location.search.length > 0 ? location.search.substring(1) : ''),
    args = {},
    items = qs.length ? qs.split('&') : [],
    item = null,
    name = null,
    value = null,

    i = 0,
    len = items.length;

  // 每一项添加到args中
  for (var i = 0; i < len; i++) {
    item = items[i].split('=');
    name = decodeURIComponent(item[0]);
    value = decodeURIComponent(item[1]);

    if (name.length) {
      args[name] = value;
    };
  };

  return args;
}

// javascript中的对象------------------------------------------
// 判断对象的属性是存在于原型中
function hasPrototypeProperty(object, name){
  return !object.hasOwnProperty(name) && (name in object);
}

// 获得可视区的大小
function getViewport(){
  if (document.compatMode === 'BackCompat') {
    return {
      width : document.body.clientWidth,
      height : document.body.clientHeight
    };
  }else{
    return {
      width : document.documentElement.clientWidth,
      height : document.documentElement.clientHeight
    };
  }
}