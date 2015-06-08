window.onload = function() {
  /*var oInput = document.getElementById('input'),
    oSub = document.getElementById('submit');*/

  // 第一阶段
  var showHobbit1 = function() {
    var arr = trim(oInput.value).split(',');

    // 过滤空数组
    for (var i = 0; i < arr.length; i++) {
      if (/\s+/.test(arr[i])) {
        arr[i] = trim(arr[i]);
        if (arr[i] === '') {
          arr[i].splice(i, 1);
        };
      };
    };

    var newArr = uniqArray(arr);

    var oP = document.createElement('p');

    oP.innerHTML = '您的爱好有' + newArr.join('-') + '。';
    document.body.appendChild(oP);
  };

  var oText = document.getElementById('textarea'),
    oSub = document.getElementById('submit'),
    oCheckboxs = document.getElementById('checkboxs');

  // 第二阶段
  var showHobbit2 = function() {
    var arr = trim(oText.value).split(/[\s,，\n、；]/);

    // console.log(arr);

    // 过滤空数组
    for (var i = 0; i < arr.length; i++) {
      if (/\s+/.test(arr[i])) {
        arr[i] = trim(arr[i]);
        if (arr[i] === '') {
          arr[i].splice(i, 1);
        };
      };
    };

    // console.log(arr);

    var newArr = uniqArray(arr);

    var oP = document.createElement('p');

    oP.innerHTML = '您的爱好有' + newArr.join('-') + '。';
    document.body.appendChild(oP);
  }

  // 第三阶段
  var oTip = document.getElementById('tip');

  var check = function() {
    var arr = trim(oText.value).split(/[\s,，\n、；]/);

    // 过滤空数组
    for (var i = 0; i < arr.length; i++) {
      if (/\s+/.test(arr[i])) {
        arr[i] = trim(arr[i]);
        if (arr[i] === '') {
          arr[i].splice(i, 1);
        };
      };
    };

    var arr = uniqArray(arr);

    // 限定数量
    if (arr.length > 10) {
      oTip.style.display = 'block';
      oSub.disabled = true;
      return false;
    } else {
      oTip.style.display = 'none';
      oSub.disabled = false;
      return arr;
    }
  }

  var showHobbit3 = function() {
    var arr = check();

    if (isArray(arr)) {

      var oHtml = '';

      for (var i = 0; i < arr.length; i++) {
        var str = '<p><input type="checkbox" name="" id=""><label for="">' + arr[i] + '</label></p>'
        oHtml += str;
      };

      oCheckboxs.innerHTML = oHtml;
    };

  }

  $.on(oText, 'keyup', check);

  $.click(oSub, showHobbit3);
}