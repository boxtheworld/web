/* 
解析url
.....?id=12456&name=xiaolongbao 
解析成：{id:1245,name:"xiaolongbao"}
*/

export default function () {
    var urlString = window.location.search;
    var obj = {};
    let reg = /[?&][^?&]+\=[^?&]+/g;
    var arr = urlString.match(reg);
    arr.forEach((item) => {
        // substring(index) 返回值是一个字符串 从index开始 包括index 向后截取字符串
        let tempArr = item.substring(1).split("=");
        console.log(tempArr);
        // encodeURIComponent 和decodeURIComponent 可以编码和解码URI特殊字符（如 # / ￥  等），而decodeURI则不能
        let key = decodeURIComponent(tempArr[0]);
        let val = decodeURIComponent(tempArr[1]);
        obj[key] = val;
    });
    console.log(urlString.match(reg));//返回值是数组["?id=123445","&name=xiaoming"]
    console.log(obj);

    return obj;
}