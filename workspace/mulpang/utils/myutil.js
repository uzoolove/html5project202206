var Util = {
  // 점수를 별로 환산한다.
  toStar: function(satisfaction){
    var star = "";
    for(var i=0; i<Math.floor(satisfaction); i++){
      star += "★";
    }
    if(Math.round(satisfaction) > Math.floor(satisfaction)){
      star += "☆";
    }
    return star;
  },

  /**
   * <select>에 사용할 <option> 목록을 만들어 반환한다.
   * @param {Array | string} items 문자열일 경우 option명과 value 값이 동일하게 지정된다. 배열일 경우 [0]에는 option명, [1]에는 value 값을 전달한다.
   * @param {string} selectItem 선택상태를 유지해야 할 경우 해당 option의 value 값
   */
  generateOptions: function(items, selectItem){
    var options = '';
    items.forEach(function(item){
      let value;
      if(item instanceof Array){        
        value = item[1];        
        item = item[0];
      }else{
        value = item;
      }
      var selected = value==selectItem ? 'selected' : '';
      options += `<option value="${value}" ${selected}>${item}</option>`;
    });
    return options;
  }
}

module.exports = Util;
