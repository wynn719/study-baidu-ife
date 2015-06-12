window.onload = function() {
  var oInp = $('#date'),
    oP = $('#p'),
    oBtn = $('#btn');

  var validate = function(str) {
    if (/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/.test(str)) {
      oBtn.disabled = false;
      return true;
    }
    oBtn.disabled = true;
  };

  var calDate = function() {
    if (validate(oInp.value)) {

      clearInterval(window.timer);
      window.timer = setInterval(function() {
        var sDate = oInp.value;
        var aDate = sDate.split('-');

        // var end = new Date(sDate);// 默认返回当地时区
        var end = new Date(aDate[0],aDate[1] - 1, aDate[2], 0, 0, 0);
        var now = new Date();

        var str = '距离' + aDate[0] + '年' + aDate[1] + '月' + aDate[2] + '日';

        if (end.getTime() > now.getTime()) {
          var elapsed = (end.getTime() - now.getTime()) / 1000;

          var cs = Math.floor(elapsed % 60);
          elapsed = Math.floor(elapsed / 60);
          var cf = elapsed % 60;
          elapsed = Math.floor(elapsed / 60);
          var ch = elapsed % 24;
          elapsed = Math.floor(elapsed / 24);
          var cd = elapsed;

          str += '还有' + cd + '天' + ch + '小时' + cf + '分' + cs + '秒';

          oP.innerHTML = str;
        }else{
          clearInterval(window.timer);
          oP.innerHTML = '倒计时结束';
        }
      }, 1000);
    }
  };

  $.on(oInp, 'keyup', function() {
    var str = this.value;
    validate(str);
  });
  $.on(oBtn, 'click', function() {
    calDate();
  });
}