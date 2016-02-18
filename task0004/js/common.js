define(function() {

    // 定义常量和公共方法
    return {
        ENTER_KEY: 13,

        is_phone: function() {
            var ua = navigator.userAgent;
            return (ua.indexOf('mobile') !== -1);
        }
    };
});