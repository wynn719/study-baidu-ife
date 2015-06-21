/**
 * fix : addClass的逻辑错误
 * fix : 优化执行速度
 */
var coreVersion = '1.0'; // 版本号

// 任务2 --------------------------------------------------------

/**
 * [isArray description]
 * @param  {Array}
 * @return {Boolean} 
 */
function isArray(arr) {
  return Array.prototype.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) === '[object Array]';
}

/**
 * [isFunction description]
 * @param  {Function}
 * @return {Boolean}
 */
function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
}

/**
 * [isRegExp description]
 * @param  {RegExp}
 * @return {Boolean}
 */
function isRegExp(re) {
  return Object.prototype.toString.call(re) === '[object RegExp]';
}

/**
 * @return {Boolean}
 */
function isPlain(obj) {
  var hasOwnProperty = Object.prototype.hasOwnProperty,
    key;

  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]' || !obj.nodeType || !('isPrototypeOf' in obj)) {
    return false;
  }

  if (obj.constructor && !hasOwnProperty.call(obj, 'constructor') && !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
    return false;
  }

  for (key in obj) {}

  return key === undefined || hasOwnProperty.call(obj, key);
}

/**
 * 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
 * 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。
 * 不会包含函数、正则对象等
 * 
 * @param  {Object} src 需要进行拷贝的对象
 * @return {Object} 拷贝后的新对象
 */
function cloneObject(src) {
  var result = src, // 给每个深遍历赋值
    i = 0,
    len = 0,
    resultLen = 0;

  if (!src || src instanceof Number || src instanceof String || src instanceof Boolean) {
    return result;
  } else if (isArray(src)) {
    result = [];
    resultLen = 0;

    for (i = 0, len = src.length; i < len; i++) {
      result[resultLen++] = cloneObject(src[i]);
    }
  } else if (isPlain(src)) {
    result = {};

    for (i in src) {
      if (src.hasOwnProperty(i)) {
        result[i] = cloneObject(src[i]);
      }
    }
  }

  return result;
}

/**
 * [uniqArray1 普通数组去重]
 * @param  {Array} arr 原数组
 * @return {Array} 返回去重后的数组
 */
function uniqArray1(arr) {

  var len = arr.length,
    result = arr.slice(0),
    i = 0,
    datum;

  while (--len > 0) {
    datum = result[len];
    i = len;
    while (i--) {
      if (datum === result[i]) {
        result.splice(len, 1);
      }
    }
  }

  return result;
}

/**
 * [uniqArray2 hash去重] 模仿hashmap来去重
 * 原理：hashmap不允许同名的键
 * 
 * @param  {Array} arr 原数组
 * @return {Array} 去重后的数组
 */
function uniqArray2(arr) {
  var obj = {},
    result = [],
    key,
    i = 0;

  for (i = 0, len = arr.length; i < len; i++) {
    key = arr[i];

    if (!obj[key]) {
      result.push(key);
      obj[key] = true;
    }
  }

  return result;
}

/**
 * [uniqArray3 hash + ES5 去重]
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 * 
 * @param  {Array} arr 原数组
 * @return {Array} 去重后的数组
 */
function uniqArray3(arr) {
  var obj = {},
    i = 0;
  for (i = 0, len = arr.length; i < len; i++) {
    obj[arr[i]] = true;
  }

  return Object.keys(obj);
}

/**
 * [trim 去除字符串两边的空格] 
 * @param  {String} str 源字符串
 * @return {[type]} 
 */
function trim(str) {

  var re = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g');
  return String.prototype.trim ? str.trim() : str.replace(re, '');
}

/**
 * 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，
 * 并将数组索引和元素作为参数传递
 * @param  {Array}   arr 
 * @param  {Function} fn 
 * @return {} 无返回值
 */
function each(arr, fn) {
  if (isFunction(fn)) {
    for (var i = 0, len = arr.length; i < len; i++) {
      fn(arr[i], i);
    }
  }
}

/**
 * [getObjectLength 获取一个对象里面第一层元素的数量，返回一个整数]
 * @param  {Object} obj 
 * @return {number}     obj的长度
 */
function getObjectLength(obj) {
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  // 只是单纯的检验是否为实例属性并不够
  var count = 0;
  for (var i in obj) {
    if (!hasOwnProperty.call(obj, i)) {
      continue;
    }
    count++;
  }
  return count;
}

/**
 * [isEmail]
 * 邮箱的种类太多，所以并不是很完善
 * 
 * @param  {String}  emailStr
 * @return {Boolean}  
 */
function isEmail(emailStr) {
  var re = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
  return re.test(emailStr);
}

/**
 * [isMobilePhone] 参考提供所有手机号的网站
 * @param  {[type]}  phone [description]
 * @return {Boolean}       [description]
 */
function isMobilePhone(phone) {
  if (typeof phone === 'string') {
    var re = /^1(3|4|5|7|8){1}\d{9}$/g;
    return re.test(phone);
  }
}

// 任务3 --------------------------------------------------------

/**
 * [hasClass description]
 * @param  {HTMLElement}  element   元素
 * @param  {string}  classname 
 * @return {Boolean}           
 */
function hasClass(element, classname) {

  var cn = element.className;

  if (!cn) {
    return false;
  }
  if (element.classList && element.classList.contains) {
    return element.classList.contains(classname);
  } else {
    return (' ' + cn + ' ').indexOf(' ' + classname + ' ') !== -1;
  }
}

/**
 * [addClass description]
 * @param {HTMLElement} element   元素
 * @param {string} newClassName
 */
function addClass(element, newClassName) {

  if (/\s/.test(newClassName)) {
    throw new TypeError('only accept a single class name');
  }

  if (!newClassName) {
    return false;
  }

  if (element.classList) {
    element.classList.add(newClassName);
  } else if (!hasClass(element, newClassName)) {
    if (element.className === '') {
      element.className = newClassName;
    } else {
      element.className += ' ' + newClassName;
    }
  }
}

/**
 * [removeClass description]
 * @param  {HTMLElement} element      元素
 * @param  {string} oldClassName
 * @return {[type]} 
 */
function removeClass(element, oldClassName) {

  if (/\s/.test(oldClassName)) {
    throw new TypeError('only accept a single className');
  }

  if (!oldClassName) {
    return false;
  }

  if (element.classList) {
    element.classList.remove(oldClassName);
  } else if (hasClass(element, oldClassName)) {
    var aCns = element.className.split(/\s+/);

    // 去除指定class
    for (var i = 0, len = aCns.length; i < len; i++) {
      aCns[i] === oldClassName && aCns.splice(i, 1);
      break;
    }
    element.className = aCns.join(' ');
  }
}

/**
 * [isSiblingNode description]
 * @param  {HTMLElement} element      元素
 * @param  {HTMLElement} siblingNode      判断元素
 * @return {Boolean} 
 */
function isSiblingNode(element, siblingNode) {

  if (!element || !siblingNode) {
    return false;
  }

  if (element === siblingNode) {
    return true;
  }

  for (var node = element.parentNode.firstChild; node; node = node.nextSibling) {
    if (node === siblingNode) {
      return true;
    }
    return false;
  }
}

/**
 * [getPosition 获取元素的窗口位置]
 * @param  {HTMLElement} element 元素
 * @return {Object}    元素的距离窗口的横坐标和纵坐标
 */
function getPosition(element) {
  var current = element;
  var pos = {
    x: 0,
    y: 0
  };

  while (current) {
    pos.x += current.offsetLeft;
    pos.y += current.offsetTop;
    current = current.offsetParent;
  }

  return pos;
}

/**
 * mini $
 *
 * bug ： IE9下报错了
 *
 * @param {string} selector 选择器
 * @return {Array.<HTMLElement>} 返回匹配的元素列表
 */
function $(selector) {
  var idReg = /^#([\w_\-]+)/; // 不考虑不符合命名规范的 id 命名
  var classReg = /^\.([\w_\-]+)/; // 不考虑不符合命名规范的 class 命名
  var tagReg = /^\w+$/i;

  var attrReg = /(\w+)?\[([^=\]]+)(?:=(["'])?([^\]"']+)\3?)?\]/;

  var context = document;

  function blank() {}

  function direct(part, actions) {
    actions = actions || {
      id: blank,
      className: blank,
      tag: blank,
      attribute: blank
    };

    var fn;
    var params = [].slice.call(arguments, 2);

    // id
    if (result = part.match(idReg)) {
      fn = 'id';
      params.push(result[1]);
    }

    // class
    else if (result = part.match(classReg)) {
      fn = 'className';
      params.push(result[1]);
    }

    // tag
    else if (result = part.match(tagReg)) {
      fn = 'tag';
      params.push(result[0]);
    }

    // attribute
    else if (result = part.match(attrReg)) {
      fn = 'attribute';
      var tag = result[1];
      var key = result[2];
      var value = result[4];
      params.push(tag, key, value);
    }
    return actions[fn].apply(null, params);
  }

  function find(parts, context) {
    var part = parts.pop();

    var actions = {
      id: function(id) {
        return [
          document.getElementById(id)
        ];
      },
      className: function(className) {
        var result = [];
        if (context.getElementsByClassName) {
          result = context.getElementsByClassName(className);
        } else {
          var temp = context.getElementsByTagName('*');
          for (var i = 0, len = temp.length; i < len; i++) {
            var node = temp[i];
            if (hasClass(node, className)) {
              result.push(node);
            }
          }
        }
        return result;
      },
      tag: function(tag) {
        return context.getElementsByTagName(tag);
      },
      attribute: function(tag, key, value) {
        var result = [];
        var temp = context.getElementsByTagName(tag || '*');

        for (var i = 0, len = temp.length; i < len; i++) {
          var node = temp[i];
          if (value) {
            var v = node.getAttribute(key);
            (v === value) && result.push(node);
          } else if (node.hasAttribute(key)) {
            result.push(node);
          }
        }
        return result;
      }
    };

    console.log(ret);
    var ret = direct(part, actions);

    // to array
    ret = [].slice.call(ret); // IE 9 下存在问题

    return parts[0] && ret[0] ? filterParents(parts, ret) : ret;
  }

  function filterParents(parts, ret) {
    var parentPart = parts.pop();
    var result = [];

    for (var i = 0, len = ret.length; i < len; i++) {
      var node = ret[i];
      var p = node;

      while (p = p.parentNode) {
        var actions = {
          id: function(el, id) {
            return (el.id === id);
          },
          className: function(el, className) {
            return hasClass(el, className);
          },
          tag: function(el, tag) {
            return (el.tagName.toLowerCase() === tag);
          },
          attribute: function(el, tag, key, value) {
            var valid = true;
            if (tag) {
              valid = actions.tag(el, tag);
            }
            valid = valid && el.hasAttribute(key);
            if (value) {
              valid = valid && (value === el.getAttribute(key))
            }
            return valid;
          }
        };
        var matches = direct(parentPart, actions, p);

        if (matches) {
          break;
        }
      }

      if (matches) {
        result.push(node);
      }
    }

    return parts[0] && result[0] ? filterParents(parts, result) : result;
  }

  var result = find(selector.split(/\s+/), context);

  return result;
}
// 任务4
/**
 * [on 绑定事件]
 * @param  {HTMLElement} element  要绑定的元素
 * @param  {string} event    事件名称
 * @param  {function} listener 
 * @return {HTMLElement}          
 */
$.on = function(element, event, listener) {
  var realFn = function(event) {
    var e = event || window.event,
      target = event.srcElement ? event.srcElement : event.target;

    listener.call(target, e);
  };

  if (element.nodeType && event) {
    if (element.addEventListener) {
      element.addEventListener(event, realFn, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, realFn);
    }　
  }
};

/**
 * [un 解除绑定事件]
 * @param  {HTMLElement} element  要绑定的元素
 * @param  {string} event    事件名称
 * @param  {function} listener 
 * @return {HTMLElement}          
 */
$.un = function(element, event, listener) {
  var realFn = function(event) {
    var e = event || window.event,
      target = event.srcElement ? event.srcElement : event.target;

    listener.call(target, e);
  };

  if (element.nodeType && event) {
    if (element.removeEventListener) {
      element.removeEventListener(event, realFn, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + event, realFn);
    }
  }
};

/**
 * [click 点击事件]
 * @param  {HTMLElement} element  要绑定的元素
 * @param  {function} listener 
 * @return {HTMLElement} 
 */
$.click = function(element, listener) {
  $.on(element, 'click', listener);
};

/**
 * [enter 回车事件]
 * @param  {HTMLElement} element  要绑定的元素
 * @param  {function} listener 
 * @return {HTMLElement} 
 */
$.enter = function(element, listener) {
  listener = function(event) {

    var e = event || window.event;
    var keyC = e.keyCode || e.which;

    if (keyC === 13) {
      listener.call(element, event);
    }
  };
};

/**
 * [delegate description]
 * @param  {HTMLElement} element  要绑定的元素
 * @param  {string} tag       要代理的元素
 * @param  {string} eventName 代理事件
 * @param  {function} listener 
 * @return {HTMLElement}  
 */
$.delegate = function(element, tag, eventName, listener) {
  var realFn = function(event) {
    var e = event || window.event,
      target = event.target || event.srcElement;

    if (target.nodeName.toLowerCase() === tag) {
      listener.call(target, event);
    }
  };

  if (element.nodeType && eventName) {

    if (element.addEventListener) {
      element.addEventListener(eventName, realFn, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, realFn);
    }
  }
};

// 任务5 ------------------------------------------------------
function isIE() {

  var ua = navigator.userAgent,
    ver = null;

  // 检测用户代理字符串
  if (/MSIE ([^;]+)/.test(ua)) {
    return document.documentMode || +RegExp['\x241'];
  } else {
    return -1;
  }
}

/**
 * [isValidCookieName 判断是否是有效的cookieName]
 * cookieName 是否有效由 
 * 
 * @param  {String}  cookieName 
 * @return {Boolean} 
 */
function isValidCookieName(cookieName) {
  return (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24'))
    .test(cookieName);
}

function setCookie(cookieName, cookieValue, expiredays) {

  // rfc 2109
  // http://www.w3.org/Protocols/rfc2109/rfc2109
  if (!isValidCookieName(cookieName)) {
    return;
  }

  var cookieText = encodeURIComponent(cookieName) + '=' + encodeURIComponent(cookieValue);

  // 设置cookie的有效时间
  var exdate = null;
  if (expiredays !== null) {
    exdate = new Date();

    // 精确到时间
    exdate.setTime(exdate.getTime() + expiredays * 24 * 60 * 60 * 1000);
  }

  // W3C标准中建议使用toUTCString代替toGMTString。
  cookieText += ((expiredays === null) ? '' : ',expires=' + exdate.toGMTString());

  document.cookie = cookieText;
}

function getCookie(cookieName) {
  var doc = document;

  if (!isValidCookieName(cookieName)) {
    return null;
  }

  cookieName = encodeURIComponent(cookieName) + '=';
  var cStart = doc.cookie.indexOf(cookieName),
    cValue = null;

  if (cStart != -1) {
    var cEnd = doc.cookie.indexOf(';', cStart);

    if (cEnd == -1) {
      cEnd = doc.cookie.length;
    }

    cValue = decodeURIComponent(doc.cookie.substring(cStart + cookieName.length, cEnd));
  }
  return cValue;
}

// 任务6 ---------------------------------------------------------
/**
 * [params 格式化请求数据]
 * @param  {Object} data 
 * @return {Array} 编码后的数据 
 */
function params(data) {
  var arr = [];

  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
    }
  }
  return arr.join('&');
}

// 使用惰性函数封装兼容获取 xhr 对象
var getXHR = (function() {
  if (window.XMLHttpRequest) {
    return function() {
      return new XMLHttpRequest();
    };
  } else if (window.ActiveXObject) {
    return function() {
      try {
        return new ActiveXObject('MSXML2.XMLHTTP');
      } catch (e) {
        try {
          return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (ex) {
          throw new Error('your broswer no support XHR Object');
        }
      }
    };
  }
})();

/**
 * [ajax description]
 * @param  {string} url     发送请求的url
 * @config {Object} options 发送请求的选项参数
 * @config {string} [options.type] 请求发送的类型，默认为GET
 * @config {Object} [options.data] 发送的数据
 * @config {function} [options.onsuccess] 成功时调用的函数
 * @config {function} [options.onfail] 失败时调用的函数
 */
function ajax(url, options) {
  options = options || {};
  var xhr = null,
    data = params(options.data || {}),
    type = (options.type || 'GET').toUpperCase(),
    eventHandlers = {
      onsuccess: options.onsuccess,
      onfail: options.onfail
    }; // 将业务逻辑和事件处理分割开

  xhr = getXHR();

  // GET 请求 url 后带数据
  if (type === 'GET' && data) {
    url = url.indexOf('?') == -1 ? url + '?' + data : url + '&' + data;
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        if (eventHandlers.onsuccess) {
          eventHandlers.onsuccess(xhr.responseText, xhr);
        }
      } else {
        if (eventHandlers.onfail) {
          eventHandlers.onfail(xhr.responseText, xhr);
        }
      }
    }
  };

  if (type === 'POST') {
    xhr.open(type, url, true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.send(data);
  } else {
    xhr.open(type, url, true);
    xhr.send(null);
  }
}

// BOM ---------------------------------------------------

// window对象
function getPageSize() {
  var pageWidth = window.innerWidth,
    pageHeight = window.innerHeight;

  var doc = document;

  if (typeof pageWidth != 'number') {
    if (doc.compatMode == 'CSS1Compat') {
      // 标准模式下
      pageWidth = doc.documentElement.clientWidth;
      pageHeight = doc.documentElement.clientHeight;
    } else {
      // 混杂模式下
      pageWidth = doc.body.clientWidth;
      pageHeight = doc.body.clientHeight;
    }
  }

  return {
    'pageWidth': pageWidth,
    'pageHeight': pageHeight
  };
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
  for (i = 0; i < len; i++) {
    item = items[i].split('=');
    name = decodeURIComponent(item[0]);
    value = decodeURIComponent(item[1]);

    if (name.length) {
      args[name] = value;
    }
  }

  return args;
}

// javascript中的对象------------------------------------------

// 获得可视区的大小
function getViewport() {
  var doc = document;

  if (doc.compatMode === 'BackCompat') {
    return {
      width: doc.body.clientWidth,
      height: doc.body.clientHeight
    };
  } else {
    return {
      width: doc.documentElement.clientWidth,
      height: doc.documentElement.clientHeight
    };
  }
}