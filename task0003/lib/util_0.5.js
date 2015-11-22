/**
 * TODO : 事件=>观察者模式
 *        Animation类=>观察者模式
 *        ajax=>虚拟代理模式
 */
(function(window, core) {

    // 变量
    var coreVer = '0.5',
        root = window,
        doc = root.document,
        docElem = doc.documentElement,

        classType = {},
        arrayType = [],

        _concat = coreVer.concat,
        _push = arrayType.push,
        _slice = arrayType.slice,
        _indexOf = arrayType.indexOf,
        _trim = coreVer.trim,
        _toString = classType.toString,
        _hasOwn = classType.hasOwnProperty;

    var _isPlain = function(obj) {
        var key;

        if (!obj || _toString.call(obj) !== '[object Object]' || !obj.nodeType || !('isPrototypeOf' in obj)) {
            return false;
        }

        if (obj.constructor && !_hasOwn.call(obj, 'constructor') && !_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
            return false;
        }

        for (key in obj) {}

        return key === undefined || _hasOwn.call(obj, key);
    };

    core.type = core.type || {};

    // 封装 type函数 ，使用 $.type.isNumber();
    core.type = (function() {
        self = {};
        for (var i = 0, type; type = ['Number', 'String', 'Function', 'Array', 'RegExp'][i++];) {
            (function(type, self) {
                self['is' + type] = function(obj) {
                    return _toString.call(obj) === '[object ' + type + ']';
                }
            })(type, self);
        }

        return self;
    })();

    core.cloneObject = function(src) {
        var result = src, // 给每个深遍历赋值
            i = 0,
            len = 0,
            resultLen = 0;

        if (!src || src instanceof Number || src instanceof String || src instanceof Boolean) {
            return result;
        } else if (this.type.isArray(src)) {
            result = [];
            resultLen = 0;

            for (i = 0, len = src.length; i < len; i++) {
                result[resultLen++] = this.cloneObject(src[i]);
            }
        } else if (_isPlain(src)) {
            result = {};

            for (i in src) {
                if (_hasOwn(i)) {
                    result[i] = this.cloneObject(src[i]);
                }
            }
        }

        return result;
    };

    core.uniqArray = function(arr) {
        var obj = {},
            result = [],
            key;

        for (var i = 0, len = arr.length; i < len; i++) {
            key = arr[i];

            if (!obj[key]) {
                result.push(key);
                obj[key] = true;
            }
        }

        return result;
    };

    core.trim = function(str) {
        var re = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g');
        return _trim ? str.trim() : str.replace(re, '');
    };

    core.each = function(arr, fn) {
        if (this.type.isFunction(fn)) {
            for (var i = 0, len = arr.length; i < len; i++) {
                fn(arr[i], i);
            }
        }
    }
    core.getObjectLength = function(obj) {
        var count = 0;
        for (var i in obj) {
            if (!_hasOwn.call(obj, i)) {
                continue;
            }
            count++;
        }
        return count;
    };

    // 验证类
    core.validate = core.validate || {};

    core.validate.isEmail = function(emailStr) {
        var re = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
        return re.test(emailStr);
    };

    core.validate.isMobilePhone = function(phone) {
        var re = /^1(3|4|5|7|8){1}\d{9}$/g;
        return re.test(phone);
    };

    // 日期处理，获得类似这个格式的时间 2015-08-19
    core.date = core.date || {};
    core.date.getNow = function() {
        var dateObj = new Date(),
            year = dateObj.getFullYear(),
            mouth = dateObj.getMonth() + 1,
            day = dateObj.getDate();

        if (mouth < 10) {
            mouth = '0' + mouth;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return year + '-' + mouth + '-' + day; 
    };

    // dom事件
    core.dom = core.dom || {};

    core.dom.query = function(selectors) {
        return doc.querySelectorAll(selectors);
    };

    core.dom.getData = function(element, name) {
        return element.getAttribute('data-' + name);
    };

    core.dom.setData = function(element, name, value) {
        element.setAttribute('data-' + name, value);
    };

    core.dom.hasClass = function(element, classname) {
        var cn = element.className;

        if (!cn) {
            return false;
        }
        if (element.classList && element.classList.contains) {
            return element.classList.contains(classname);
        } else {
            return (' ' + cn + ' ').indexOf(' ' + classname + ' ') !== -1;
        }
    };

    core.dom.addClass = function(element, newClassName) {

        if (/\s/.test(newClassName)) {
            throw new TypeError('only accept a single class name');
        }

        if (!newClassName) {
            return false;
        }

        if (element.classList) {
            element.classList.add(newClassName);
        } else if (!this.hasClass(element, newClassName)) {
            if (element.className === '') {
                element.className = newClassName;
            } else {
                element.className += ' ' + newClassName;
            }
        }
    };

    core.dom.removeClass = function(element, oldClassName) {

        if (/\s/.test(oldClassName)) {
            throw new TypeError('only accept a single className');
        }

        if (!oldClassName) {
            return false;
        }

        if (element.classList) {
            element.classList.remove(oldClassName);
        } else if (this.hasClass(element, oldClassName)) {
            var aCns = element.className.split(/\s+/);

            // 去除指定class
            for (var i = 0, len = aCns.length; i < len; i++) {
                aCns[i] === oldClassName && aCns.splice(i, 1);
                break;
            }
            element.className = aCns.join(' ');
        }
    };

    core.dom.isSiblingNode = function(element, siblingNode) {

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
    };

    core.dom.nextSibling = function(element) {
        var node = element.nextSibling;
        for (node; node; node = node.nextSibling) {
            if (node.nodeType === 1) {
                return node;
            }
        }
        return null;
    };

    core.dom.getPosition = function(element) {
        var current = element;
        var pos = {
            x: 0,
            y: 0
        };

        if (current.getBoundingClientRect) {
            pos.x = current.getBoundingClientRect()['left'];
            pos.y = current.getBoundingClientRect()['top'];
            return pos;
        }

        while (current) {
            pos.x += current.offsetLeft;
            pos.y += current.offsetTop;
            current = current.offsetParent;
        }

        return pos;
    };

    core.dom.on = function(element, event, listener) {
        var realFn = function(event) {
            var e = event || root.event,
                target = e.srcElement ? e.srcElement : e.target;

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

    core.dom.un = function(element, event, listener) {
        var realFn = function(event) {
            var e = event || window.event,
                target = e.srcElement ? e.srcElement : e.target;

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

    core.dom.click = function(element, listener) {
        this.on(element, 'click', listener);
    };

    core.dom.enter = function(element, listener) {
        listener = function(event) {
            var e = event || window.event;
            var keyC = e.keyCode || e.which;

            if (keyC === 13) {
                listener.call(element, event);
            }
        };
    };

    core.dom.delegate = function(element, tag, eventName, listener) {
        var realFn = function(event) {
            var e = event || window.event,
                target = e.target || e.srcElement;

            // 类
            if (/^.\S+$/.test(tag)) {
                if (core.dom.hasClass(target, tag.slice(1))) {
                    listener.call(target, event);
                }
            }
            
            // tag
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

    core.isIE = function() {

        var ua = navigator.userAgent;

        // 检测用户代理字符串
        if (/MSIE ([^;]+)/.test(ua)) {
            return doc.documentMode || +RegExp['\x241'];
        }
        return -1;
    };

    core.isValidCookieName = function(cookieName) {
        return (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24'))
            .test(cookieName);
    };

    core.setCookie = function(cookieName, cookieValue, expiredays) {

        // rfc 2109
        // http://www.w3.org/Protocols/rfc2109/rfc2109
        if (!this.isValidCookieName(cookieName)) {
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

        doc.cookie = cookieText;
    };

    core.getCookie = function(cookieName) {
        if (!this.isValidCookieName(cookieName)) {
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
    };

    var params = function(data) {
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
            	for(var i = 0, type; type = ['MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'][i++]; ){
            		return ActiveXObject(type) && new ActiveXObject(type);
            	}
            	throw new Error('your broswer no support XHR Object');
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
    core.ajax = function(url, options) {
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

    window.$ = core;
})(window, {});