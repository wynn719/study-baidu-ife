/**
 * add : 规范注释
 * change : 优化和改进代码
 */

var coreVersion = '0.2'; // 版本号

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

  // typeof 检测虽然支持多窗口检测，但是不能识别 Regex
  // 检测 Regexp 时也会弹出 function
  // return typeof fn === 'function';

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
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 *
 * 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 * 
 * @return {Boolean}
 */
function isPlain(obj){
  var hasOwnProperty = Object.prototype.hasOwnProperty,
    key;

  // 排除IE下的COM对象返回Object的问题
  // 所有字面量对象都有 isPrototypeOf 这个属性
  if (!obj 
    || Object.prototype.toString.call(obj) !== '[object Object]' 
    || !obj.nodeType
    || !('isPrototypeOf' in obj)
    ) {
    return false;
  }

  // 判断new fun()自定义对象的情况
  // constructor不是继承自原型链的
  // 并且原型中有isPrototypeOf方法才是Object
  if (obj.constructor && !hasOwnProperty.call(obj, 'constructor') && !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
    return false;
  }

  //判断有继承的情况
  //如果有一项是继承过来的，那么一定不是字面量Object
  //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
  for(key in obj){}

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

  // 1.对于Object和Array的遍历，可以使用for in，
  // 这样可以保证在在Array对象上扩展的属性也可以正确复制。
  // 2.对于Date,String,Boolean等引用类型的数据，
  // 需要考虑调用构造函数重新构造，直接赋值依然会有引用问题（不是真正的clone引用变量）。

  var result = src, // 给每个深遍历赋值
    i = 0,
    len = 0,
    resultLen = 0; 

  if (!src 
    || src instanceof Number 
    || src instanceof String 
    || src instanceof Boolean) {
    return result;
  } else if(isArray(src)){
    result = [];
    resultLen = 0;

    for (i = 0, len = src.length; i < len; i++) {
      result[resultLen++] = cloneObject(src[i]);
    }
  } else if (isPlain(src)) {
    // 在这里判断src是否为字面量对象，如果不是不做深度拷贝

    result = {};

    for(i in src){

      // hasOwnProperty 过滤原型属性，留下实例属性
      // 会忽略掉那些从原型链上继承到的属性。
      if (src.hasOwnProperty(i)) {
        result[i] = cloneObject(src[i]);
      }
    }
  }

  return result;

  // 是否不为函数和正则
  // 缺少对 Array 和 Object 的区分，对 Object 的判断
  // 对 date 类型的判断不足
  // if (!(isFunction(src) && isRegExp(src))) {
  //   var o;

  //   if (isArray(src)) {
  //     o = [];
  //   } else {
  //     o = {};
  //   };

  //   for (var i in src) {

  //     // 判断是否有实例属性
  //     if (src.hasOwnProperty(i)) {

  //       // 深度递归
  //       if (typeof src[i] === 'object') {
  //         o[i] = cloneObject(src[i]);
  //       } else {
  //         o[i] = src[i];
  //       }

  //     }
  //   }

  //   return o;
  // }
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

  while(--len > 0){
    datum = result[len];
    i = len;
    while(i--){
      if (datum === result[i]) {
        result.splice(len, 1);
      }
    }
  }

  return result;

  // 跟上面的没多大区别
  // if (isArray(arr)) {

  //   // 注意，使用for in遍历数组，会遍历到数组对象扩展出来的属性，故放弃
  //   for (var i = 0; i < arr.length; i++) {
  //     for (var j = i + 1; j < arr.length; j++) {
  //       if (arr[i] === arr[j]) {
  //         arr.splice(j, 1);
  //         j--;
  //       }
  //     }
  //   }
  //   return arr;

  // }
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
function uniqArray3(arr){
  var obj = {},
    i = 0;
  for(i = 0, len = arr.length; i < len; i++){
    obj[arr[i]] = true;
  }

  // Object.keys 返回一个包含可以枚举项的数组 
  // bug：返回后，所有数组的项都变成了字符串
  return Object.keys(obj);
}

// function simpleTrim(str) {
//   if (String.prototype.trim) {
//     return str.trim();
//   } else {
//     var begin = 0,
//       end = 0;
//     for (var i = 0; i < str.length; i++) {
//       if (str.charAt(i) !== ' ') {
//         begin = i;
//         break;
//       }
//     }
//     for (var i = str.length - 1; i >= 0; i--) {
//       if (str.charAt(i) !== ' ') {
//         end = i + 1;
//         break;
//       }
//     }

//     return str.slice(begin, end);
//   }
// }

/**
 * [trim 去除字符串两边的空格] 
 * @param  {String} str 源字符串
 * @return {[type]} 
 */
function trim(str) {

  // \xa0 不换行的空格
  // 此处 \\s 等是为了去除带转义字符的字符串，如 '  \s 19   '
  var re = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g');
  return String.prototype.trim ? str.trim() : str.replace(re, '');
  
  // MDN 的做法
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
  // return String.prototype.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
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

  // 只是单纯的检验是否为实例属性并不够
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

/**
 * [isEmail]
 * 邮箱的种类太多，所以并不是很完善
 * 
 * @param  {String}  emailStr
 * @return {Boolean}  
 */
function isEmail(emailStr) {
  // 不能识别 li.meng@s.baidu.com
  // var re = /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i;

  // 识别 lj.meng@s.baidu.com
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
function hasClass(element, classname){

  var cn = element.className;

  if (!cn) {
    return false;
  }

  // classList ECMAScript5
  // 调用原生js的判断classname方法
  if (element.classList && element.classList.contains) {
    return element.classList.contains(cn);
  } else {

    // jquery中的做法
    return (' ' + cn + ' ').indexOf(' ' + classname + ' ') !== -1;
  }
}

/**
 * [addClass description]
 * @param {HTMLElement} element   元素
 * @param {string} newClassName
 */
function addClass(element, newClassName) {

  // 判断newClassName是否单一
  if (/\s/.test(newClassName)) {
    throw new TypeError('only accept a single class name');
  }

  if (!newClassName) {
    return false;
  }

  if (element.classList) {
    element.classList.add(newClassName);
  } else if (!hasClass(element, newClassName)) {
    element.className += ' ' + newClassName;
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

  // 都不是元素的时候
  if (!element || !siblingNode) {
    return false;
  }

  // 同一个元素的情况下
  if (element === siblingNode) {
    return true;
  }

  // 只判断父元素不够准确
  // if (element.nodeType === 1 && siblingNode.nodeType === 1) {
  //   return element.parentNode === siblingNode.parentNode;
  // }

  for(var node = element.parentNode.firstChild; node; node = node.nextSibling){
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

  // 对于表格和内嵌框架布局的页面，由于不同浏览器实现方式不一样，
  // 得到的值不够精确
  var current = element;
  var pos = {
    x: 0,
    y: 0
  };

  // 回溯到最高级
  while (current) {
    pos.x += current.offsetLeft;
    pos.y += current.offsetTop;
    current = current.offsetParent;
  }

  return pos;
}

// 实现一个简单的Query，好难啊,尚未实现！！！！！！！！
// function $(selector, eleScope) {
//   var root = window.document;
//   var SELECTOR_ERROR = 'only accept a valid string',
//     cn = '', // 临时变量
//     elArr = [], // 元素集合
//     els = null,
//     i = 0,
//     len = 0,
//     selArr = [];

//   if (typeof selector === 'string') {

//     // 处理空字符串
//     if (selector === '') {
//       return null;
//     }

//     // 处理两边空，左边空，右边空
//     if (/^ +.* +$/.test(selector) || /^ +.*$/.test(selector) || /^.* +$/.test(selector)) {
//       return null;
//     }

//     // 判断是否为组合
//     if (selector.split(' ').length === 1) {

//       /*
//        * 非组合
//        */

//       // 处理id
//       if (/^#\S+$/.test(selector)) {
//         console.log('handle id');

//         return root.getElementById(selector.substr(1));
//       }

//       // 处理tag
//       if (/^[a-z]+$/.test(selector.toLowerCase())) {
//         console.log('handle tag');

//         elArr = root.getElementsByTagName(selector);
//         return elArr.length === 0 ? null : elArr;
//       }

//       // 处理class
//       if (/^\.\S+$/.test(selector)) {
//         console.log('handle class');

//         selector = selector.substr(1);

//         // 检测浏览器支不支持getElementsByClassName
//         if (root.getElementsByClassName) {
//           return root.getElementsByClassName(selector);
//         } else {

//           // 旧版本的浏览器选择class
//           els = root.getElementsByTagName('*');

//           for (i = 0, len = els[i].length; i < len; i++) {

//             // 元素
//             if (els[i].nodeType && els[i].nodeType === 1) {

//               cn = ' ' + els[i].className + ' ';

//               // 是否为指定class
//               if (cn.indexOf(' ' + selector + ' ') !== -1) {

//                 elArr.push(els[i]);
//               }
//             }
//           }

//           return elArr.length === 0 ? null : elArr;
//         }

//         return null;
//       }

//       // 处理 attribute
//       if (selector.charAt(0) === '[' && selector.charAt(selector.length - 1) === ']') {
//         selector = selector.substring(1, selector.length - 1);

//         // 是否带值
//         if (selector.split('=').length !== 2) {

//           // 不带值
//           els = root.getElementsByTagName('*');

//           for (i = 0, len = els.length; i < len; i++) {
            
//             // 判断元素属性是否存在
//             if (els[i].getAttribute(selector)) {
//               elArr.push(els[i]);
//             }
//           }

//           return elArr.length === 0 ? null : elArr;
//         }else{

//           // 带值
//           selArr = selector.split('=');

//           els = root.getElementsByTagName('*');

//           for (i = 0, len = els.length; i < len; i++) {
            
//             // 判断元素属性是否相等
//             if (els[i].getAttribute(selArr[0]) === selArr[1]) {
//               elArr.push(els[i]);
//             }
//           }

//           return elArr.length === 0 ? null : elArr;
//         }
//       }

//     }else{

//       /*
//        * 组合
//        */

//       console.log('handle complex');

//       selArr = selector.split(' ');
      
//       // 处理父子关系
//       if (selArr[1].parentNode !== selArr[0].parentNode) {
//         return null;
//       }else{

//         // 层级关系

//       }
//     }

//   }else{
//     throw new TypeError(SELECTOR_ERROR);
//   }
// }

/**
 * mini $
 *
 * @param {string} selector 选择器
 * @return {Array.<HTMLElement>} 返回匹配的元素列表
 */
function $(selector) {
  var idReg = /^#([\w_\-]+)/; // 不考虑不符合命名规范的 id 命名
  var classReg = /^\.([\w_\-]+)/; // 不考虑不符合命名规范的 class 命名
  var tagReg = /^\w+$/i; 

  // 可能有的 attr 形式
  // [data-log]
  // [data-log="test"]
  // [data-log=test]
  // [data-log='test']
  var attrReg = /(\w+)?\[([^=\]]+)(?:=(["'])?([^\]"']+)\3?)?\]/;

  // 不考虑'>' 、`~`等嵌套关系
  // 父子选择器之间用空格相隔
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
          result = context.getElementsByClassName(className)
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

    var ret = direct(part, actions);

    // to array
    ret = [].slice.call(ret);

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

/**
 * [on 绑定事件]
 * @param  {HTMLElement} element  要绑定的元素
 * @param  {string} event    事件名称
 * @param  {function} listener 
 * @return {HTMLElement}          
 */
$.on = function (element, event, listener) {
  var realListener = function (e){
    if (isFunction(listener)) {
      listener.call(element, e);
    }
  }

  if (element.nodeType && event) {
    if (element.addEventListener) {
      element.addEventListener(event, realListener, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, realListener);
    } 
   　// 几乎不存在不支持标准的浏览器了
   　// else {
   　//   element['on' + event] = listener;
   　// }
  }

  return element; // 有助于链式调用
}

/**
 * [un 解除绑定事件]
 * @param  {HTMLElement} element  要绑定的元素
 * @param  {string} event    事件名称
 * @param  {function} listener 
 * @return {HTMLElement}          
 */
$.un = function (element, event, listener) {
  if (element.nodeType && event) {
    if (element.removeEventListener) {
      element.removeEventListener(event, listener, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + event, listener);
    } 
    // else {
    //   element['on' + event] = null;
    // }
  }

  return element; // 有助于链式调用
}

/**
 * [click 点击事件]
 * @param  {HTMLElement} element  要绑定的元素
 * @param  {function} listener 
 * @return {HTMLElement} 
 */
$.click = function (element, listener) {
  return $.on(element, 'click', listener);
}

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
  }

  return $.on(element, 'keydown', listener);
}

/**
 * [delegate description]
 * @param  {HTMLElement} element  要绑定的元素
 * @param  {string} tag       要代理的元素
 * @param  {string} eventName 代理事件
 * @param  {function} listener 
 * @return {HTMLElement}  
 */
$.delegate = function (element, tag, eventName, listener) {

  if (element.nodeType && eventName) {

    if (element.addEventListener) {
      element.addEventListener(eventName, function(e) {

        var event = arguments[0] || window.event,
          target = event.srcElement ? event.srcElement : event.target;

        if (target.nodeName.toLowerCase() === tag) {
          listener.call(target, event);
        }

      }, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, function(e) {
        var event = arguments[0] || window.event,
          target = event.srcElement ? event.srcElement : event.target;

        if (target.nodeName.toLowerCase() === tag) {
          listener.call(target, event);
        }
      });
    } 
    // else {
    //   element['on' + eventName] = function() {
    //     var e = arguments[0] || window.event,
    //       target = e.srcElement ? e.srcElement : e.target;

    //     if (target.nodeName.toLowerCase() === tag) {
    //       listener.call(target);
    //     };
    //   }
    // }

  }

  return element;
}

// 任务5 ------------------------------------------------------

// 这是传统的userAgent + documentMode方式的ie版本判断。
// 这在大多数对老IE问题进行hack的场景下有效果。
function isIE() {

  // 在IE8+，可以选择不同版本的浏览区渲染模式，因此在这种情况下，
  // navigator的信息就不准确了。 所以需要使用documentMode来判断实际的渲染模式。
  var ua = navigator.userAgent,
    ver = null;

  // 检测用户代理字符串
  if (/MSIE ([^;]+)/.test(ua)) {

    // 没有判断 documentMode
    // ver = RegExp['$1'];

    // RegExp['$1'] === RegExp['\x241']
    return document.documentMode || + RegExp['\x241'];
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
function isValidCookieName(cookieName){
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
  if (expiredays != null) {
    exdate = new Date();

    // 只设置日期
    // exdate.setDate(exdate.getDate() + expiredays);

    // 精确到时间
    exdate.setTime(exdate.getTime() + expiredays * 24 * 60 * 60 * 1000);
  }

  // W3C标准中建议使用toUTCString代替toGMTString。
  cookieText += ((expiredays == null) ? '' : ',expires=' + exdate.toGMTString());

  document.cookie = cookieText;
}

function getCookie(cookieName) {
  if (!isValidCookieName(cookieName)) {
    return null;
  }

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
var getXHR() = (function(){
  if (window.XMLHttpRequest) {
    return function(){
      return new XMLHttpRequest();
    }
  }else if (window.ActiveXObject){
    return function (){
      try{
        return new ActiveXObject('MSXML2.XMLHTTP');
      } catch (e) {
        try {
          return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
          throw new Error('your broswer no support XHR Object');
        }
      }
    }
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
  var options = options || {},
    xhr = null,
    data = params(options.data || {}),
    type = (options.type || 'GET').toUpperCase(),
    eventHandlers = {
      onsuccess : options.onsuccess,
      onfail : options.onfail
    }; // 将业务逻辑和事件处理分割开
 
  url = url + '?rand=' + Math.random();

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
    xhr.open(type, url, false);

    // 要指定编码格式
    // 设置头信息是模拟form表单提交
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.send(data);
  } else {

    // 处理GET请求
    xhr.open(type, url, false);
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