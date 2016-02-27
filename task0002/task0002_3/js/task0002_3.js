var Slider = function(options) {
    this.oCarousel = $('.carousel')[0];
    this.oCaInner = $('.carousel-inner')[0];
    this.oItem = $('.carousel-inner .item');

    this.len = this.oItem.length;
    this.itemWidth = 1000;
    this.timer = null;
    this.isAnimate = false;
    this.current = 1;

    this.options = options ? window.extend(this.options, options) : this.options;

    this.init();
};

Slider.prototype = {
    // 默认配置
    options: {
        speed: 3000,
        circle: true
    },

    // 初始化
    init: function(options) {
        var self = this;

        self.render();

        self.slide();
    },

    // 渲染
    render: function() {
        var self = this;
        var lis = '';
        var ol = document.createElement('ol');

        self.oCaInner.style.width = self.itemWidth * self.len + 'px';

        addClass(ol, 'carousel-indicators');
        ol.style.marginLeft = -self.len * 10 + 'px';

        for (var i = 1; i <= self.len; i++) {
            lis += '<li class="' + (i === 1 ? 'active' : '') + '">' + i + '</li>'
        };
        ol.innerHTML = lis;

        $.delegate(ol, 'li', 'click', function(event) {
            self.activeDot(parseInt(this.innerHTML) - 1);
            self.nav(parseInt(this.innerHTML));
        });

        // fix chrome下的bug，定时器切换选项卡时被挂起
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState == 'visible') {
                self.slide();
            } else {
                self.stop();
            }
        });
        
        self.oCarousel.appendChild(ol);
    },

    // 移动
    slide: function() {
        var self = this,
            oItem = self.oItem,
            itemWidth = self.itemWidth,
            len = self.len,
            oCaInner = self.oCaInner,
            oCarousel = self.oCarousel;

        function run() {
            if (self.options.circle) { // 循环
                if (self.current === len) {
                    // 利用position将第一个图片移到最后一个块后面
                    oItem[0].style.position = 'relative';
                    oItem[0].style.left = itemWidth * len + 'px';
                    self.move(oCaInner, 'left', -self.current * itemWidth, 100, function() {
                        // 还原position
                        oItem[0].style.position = 'static';
                        oItem[0].style.left = 0;
                        oCaInner.style.left = 0;
                    });
                } else {
                    self.move(oCaInner, 'left', -self.current * itemWidth, 100);
                }

                if (self.current === len) {
                    self.current = 1; //此时应该从第二个块起步
                } else {
                    self.current++;
                }
            } else { // 不循环
                self.current++;

                if (self.current > len) {
                    self.current = 1;
                }

                var target = -(self.current - 1) * itemWidth;

                if (self.current === 1) {
                    self.move(oCaInner, 'left', target, 50 * len);
                } else {
                    self.move(oCaInner, 'left', target, 50);
                }
            }

            self.activeDot(self.current - 1);
        }

        self.timer = setInterval(function() {
            if (!self.isAnimate)
                run();
        }, self.options.speed);
    },

    stop: function() {
        var self = this;
        clearInterval(self.timer);
    },

    // 导航
    nav: function(index) {
        var self = this,
            oItem = self.oItem,
            itemWidth = self.itemWidth,
            len = self.len,
            oCaInner = self.oCaInner,
            target = (index - 1) * itemWidth,
            dir = Math.abs(index - self.current) * 50; // 跨点击，幅度加速

        self.stop();

        self.move(oCaInner, 'left', -target, dir, function() {
            self.current = index;
            self.slide();
        });
    },

    activeDot: function (index) {
        var lis = this.oCarousel.querySelectorAll('li');

        each(lis, function (el) {
            el.className = '';
        });

        lis[index].className = 'active';
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
    move: function(obj, attr, target, dir, endFn) {
        self.isAnimate = true;
        dir = parseInt(getStyle(obj, attr), 10) < target ? dir : -dir;
        // console.log('dir:' + dir);
        obj.doMoveTimer = null;

        var cValue = 0; // 当前属性值

        clearTimeout(obj.doMoveTimer);

        function go() {
            cValue = parseInt(getStyle(obj, attr), 10) + dir;

            if (cValue > target && dir > 0 || cValue < target && dir < 0) {
                cValue = target;
            }

            obj.style[attr] = cValue + 'px';

            if (cValue === target) {
                clearTimeout(obj.doMoveTimer);

                // 执行回调函数
                endFn && endFn();

                self.isAnimate = false;
            } else {
                obj.doMoveTimer = setTimeout(arguments.callee, 15);
            }
        }

        go();
    }
};

/**
 * [extend 整合默认config] 如果新的config中缺少默认config的项，新的config中填充
 * @param  {Object} oldSrc 默认配置
 * @param  {Object} src    自定义配置
 * @return {Object}        完整的自定义配置
 */
function extend(defaultOptions, options) {
    var key = null;

    for (key in defaultOptions) {
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

window.onload = function() {
    var slider = new Slider({
        speed: 3000,
        circle: true,
        hahaha: false
    });
}