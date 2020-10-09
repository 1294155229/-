/**
 * 功能: 将对象转化为url参数 { a: 1, b: 2 } => a=1&b=2
 * @param {形如: {a: 1, b: 2} 格式的对象} obj
 */
export const objToUrl = function(obj) {
	let arr = [];
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
		}
	}
	return arr.join("&");
}

/**
 * 功能: 把url格式的字符串转化为对象 a=1&b=2 => { a: 1, b:2 }
 * @param {a=1&b=2格式的字符串} url
 */
export const urlToObj = function(url) {
	let string = url.split('&');
	let res = {};
	for (let i = 0; i < string.length; i++) {
		let str = string[i].split('=');
		if (str[0] != '') {
			res[str[0]] = str[1];
		}
	}
	return res;
}
