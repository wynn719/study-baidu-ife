window.onload = function() {
  /*var oInput = document.getElementById('input'),
    oSub = document.getElementById('submit');*/

  // // 第一阶段
  // var showHobbit1 = function() {
  //   var arr = trim(oInput.value).split(',');

  //   // 过滤空数组
  //   for (var i = 0; i < arr.length; i++) {
  //     if (/\s+/.test(arr[i])) {
  //       arr[i] = trim(arr[i]);
  //       if (arr[i] === '') {
  //         arr[i].splice(i, 1);
  //       };
  //     };
  //   };

  //   var newArr = uniqArray2(arr);

  //   var oP = document.createElement('p');

  //   oP.innerHTML = '您的爱好有' + newArr.join('-') + '。';
  //   document.body.appendChild(oP);
  // };

  // // 第二阶段
  // var showHobbit2 = function() {
  //   var arr = trim(oText.value).split(/[\s,，\n、；]/);

  //   // console.log(arr);

  //   // 过滤空数组
  //   for (var i = 0; i < arr.length; i++) {
  //     if (/\s+/.test(arr[i])) {
  //       arr[i] = trim(arr[i]);
  //       if (arr[i] === '') {
  //         arr[i].splice(i, 1);
  //       };
  //     };
  //   };

  //   // console.log(arr);

  //   var newArr = uniqArray(arr);

  //   var oP = document.createElement('p');

  //   oP.innerHTML = '您的爱好有' + newArr.join('-') + '。';
  //   document.body.appendChild(oP);
  // }

  // 第三阶段
  var oText = $('#textarea')[0],
    oSub = $('#submit')[0],
    oCheckboxs = $('#checkboxs')[0],
    oTip = $('#tip')[0];

  // 将提示信息独立出来
  var showErr = function(msg){
    if (msg) {
      oTip.innerHTML = msg;
      oTip.style.display = 'block';
    }else{
      oTip.innerHTML = '';   
      oTip.style.display = 'none';
    }
  }

  var filterArray = function(arr){
    var result = [];

    each(arr, function(item){
      if (item) {
        result.push(item);
      }
    });

    return result;
  }

  var toggleBtn = function(statu){
    oSub.disabled = statu;
  }

  var check = function() {
    var inputVal = oText.value;

    if (!inputVal) {
      toggleBtn(true);
      return showErr('输入不能为空');
    }

    var arr = trim(inputVal).split(/[\s\n\t,，、；]/);

    arr = uniqArray1(arr);

    arr = filterArray(arr);

    // 应该独立该处理，降低耦合
    // 过滤空数组
    // for (var i = 0; i < arr.length; i++) {
    //   if (/\s+/.test(arr[i])) {
    //     arr[i] = trim(arr[i]);
    //     if (arr[i] === '') {
    //       arr[i].splice(i, 1);
    //     };
    //   };
    // };

    // 限定数量
    if (arr.length > 10) {
      toggleBtn(true);
      return showErr('输入爱好不能大于10个');
    } else {
      toggleBtn(false);
      return showErr(false);
    }
  }

  var showHobbit3 = function() {
    var arr = oText.value.split(/[\s\n\t,，、；]/);

    var sHtml = '';

    for (var i = 0, len = arr.length; i < len; i++) {
      var str = '<p><input type="checkbox" name="checkbox' + i + '" id=""><label for="checkbox' + i + '">' + arr[i] + '</label></p>'
      sHtml += str;
    }

    oCheckboxs.innerHTML = sHtml;
  }

  // webkit下
  $.on(oText, 'input', check);
  // IE下
  $.on(oText, 'propertychange', check);
  // 剪切黏贴
  $.on(oText, 'cut', check);
  $.on(oText, 'paste', check);
  // 键盘
  $.on(oText, 'keydown', check);

  $.click(oSub, showHobbit3);
}