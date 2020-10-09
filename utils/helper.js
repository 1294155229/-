/**
 * 页面跳转
 * @param {Object} url
 */

// 背景图基础服务器地址 暂时废弃
// backgroundImgUrl() {
// 	return 'http://mmxs.yangzhijun.top/h5/';
// }

//常用方法集合
export default {
	// 普通跳转 带返回
	to(url) {
		uni.navigateTo({
			url: url
		});
	},
	//无返回跳转
	redirect(url) {
		uni.redirectTo({
			url: url
		});
	},
	//tap跳转
	tap(url) {
		uni.switchTab({
			url: url
		});
	},
	//清空页面栈后跳转
	reTo(url) {
		uni.reLaunch({
			url: url
		});
	},
	//返回上一层
	back(num = 1) {
		uni.navigateBack({
			delta: num
		});
	},
	/* 
	延时跳转 默认1.5秒
	url 跳转路径
	time 延时时长
	 */
	toL(url, time = 1500) {
		setTimeout(() => {
			console.log('2', url)
			this.to(url)
		}, time)
	},
	//延时tap跳转
	tapL(url, time = 1500) {
		setTimeout(() => {
			this.tap(url)
		}, time)
	},
	//延时无返回跳转
	redirectL(url, time = 1500) {
		setTimeout(() => {
			this.redirect(url)
		}, time)
	},
	//延时清空页面栈后跳转
	reToL(url, time = 1500) {
		setTimeout(() => {
			this.reTo(url)
		}, time)
	},
	//延时返回
	backL(num = 1, time = 1500) {
		setTimeout(() => {
			this.back(num)
		}, time)
	},

	// 页面弹框
	toast(icon, text, duration, mask, position) {
		duration = duration || 1500;
		mask = mask || false;
		position = position || false;
		uni.showToast({
			icon: icon,
			title: text,
			duration: duration,
			mask: mask,
			position: position,
		})
	},
	//同步缓存 存储 setStorageSync
	setS(key, value) {
		return uni.setStorageSync(key, JSON.stringify(value));
	},
	//同步缓存 获取 getStorageSync
	getS(key) {
		let data = uni.getStorageSync(key);
		if (data) return JSON.parse(data);
		else return '';
	},

	/* 成功提示框
	text 提示内容
	duration 提示时长
	 */
	showS(text = '', duration = 1500) {
		uni.showToast({
			icon: 'success',
			title: text,
			duration: duration
		})
	},
	//失败提示框
	showN(text = '', duration = 1500) {
		uni.showToast({
			icon: 'none',
			title: text,
			duration: duration,
			mask: true,
		})
	},

	//加载中等待框  showLoading
	showL(text = '加载中') {
		uni.showLoading({
			title: text
		});
	},
	//关闭加载中等待框 hideLoading
	hideL() {
		uni.hideLoading();
	},

	/* 
	复制 
	str要复制的字符串
	msg复制成功后提示信息
	*/
	copy(str, msg) {
		uni.setClipboardData({
			data: str,
			success: function() {
				if (msg) {
					showS(msg)
				}
			}
		});
	},
	/**
	 * 功能:复制出一个新对象
	 * @param {obj} 传入要复制的对象  
	 */
	newObj(obj) {
		return JSON.parse(JSON.stringify(obj))
	},
	/**
	 * 异步获取设备信息
	 */
	getInfoAsync() {
		return new Promise((resolve, reject) => {
			plus.device.getInfo({
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e.message);
				}
			});
		});
	},
	/**
	 * 获取一个随机数
	 * @param {Object} min
	 * @param {Object} max
	 */
	random(min, max) {
		switch (arguments.length) {
			case 1:
				return parseInt(Math.random() * min + 1, 10);
				break;
			case 2:
				return parseInt(Math.random() * (max - min + 1) + min, 10);
				break;
			default:
				return 0;
				break;
		}
	},
	/*
	 * obj 转 params字符串参数
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objToParam(obj) {
		let paramsStr = '';
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},
	/*
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objToUrlParam(path, obj) {
		let url = path || '/';
		let paramsStr = '';
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		paramsStr && (url += '?');
		url += paramsStr;
		return url;
	},
	/*
	 * 获取url字符串参数
	 */
	getUrlParams(locationhref) {
		let href = locationhref || '';
		let theRequest = new Object();
		let str = href.split('?')[1];
		if (str != undefined) {
			let strs = str.split('&');
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
			}
		}
		return theRequest;
	},
	/**
	 * 加密字符串
	 */
	strEncode(str) {
		const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let l = key.length;
		let a = key.split('');
		let s = '',
			b,
			b1,
			b2,
			b3;
		for (let i = 0; i < str.length; i++) {
			b = str.charCodeAt(i);
			b1 = b % l;
			b = (b - b1) / l;
			b2 = b % l;
			b = (b - b2) / l;
			b3 = b % l;
			s += a[b3] + a[b2] + a[b1];
		}
		return s;
	},
	/**
	 * 解密字符串
	 */
	strDecode(str) {
		const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let l = key.length;
		let b,
			b1,
			b2,
			b3,
			d = 0,
			s;
		s = new Array(Math.floor(str.length / 3));
		b = s.length;
		for (let i = 0; i < b; i++) {
			b1 = key.indexOf(str.charAt(d));
			d++;
			b2 = key.indexOf(str.charAt(d));
			d++;
			b3 = key.indexOf(str.charAt(d));
			d++;
			s[i] = b1 * l * l + b2 * l + b3;
		}
		b = eval('String.fromCharCode(' + s.join(',') + ')');
		return b;
	},
	/**
	 * 比较版本号
	 */
	compareVersion(reqV, curV) {
		if (curV && reqV) {
			let arr1 = curV.split('.'),
				arr2 = reqV.split('.');
			let minLength = Math.min(arr1.length, arr2.length),
				position = 0,
				diff = 0;
			while (
				position < minLength &&
				(diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0
			) {
				position++;
			}
			diff = diff != 0 ? diff : arr1.length - arr2.length;
			if (diff > 0) {
				if (position == minLength - 1) {
					return 1;
				} else {
					return 2;
				}
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	},
	/**
	 * H5复制
	 */
	h5Copy(content) {
		let textarea = document.createElement('textarea');
		textarea.value = content;
		textarea.readOnly = 'readOnly';
		document.body.appendChild(textarea);
		textarea.select(); // 选择对象
		textarea.setSelectionRange(0, content.length); //核心
		let result = document.execCommand('Copy'); // 执行浏览器复制命令
		textarea.remove();
		const msg = result ? '复制成功' : '复制失败';
		this.toast(msg);
	},
	// 判断两个对象是否相同
	objEqual(x, y) {
		// 指向同一内存时
		if (x === y) {
			return true;
		} else if (
			typeof x == 'object' &&
			x != null &&
			typeof y == 'object' && y != null
		) {
			if (Object.keys(x).length != Object.keys(y).length) return false;

			for (var prop in x) {
				if (y.hasOwnProperty(prop)) {
					if (!this.isObjectValueEqual(x[prop], y[prop])) return false;
				} else return false;
			}

			return true;
		} else return false;
	},
	// 去掉字符串中的空格
	trim(str) {
		if (!str) {
			return '';
		}
		return str.replace(/\s*/g, '');
	},

	// 给某人拨打电话
	callPerson(phone) {
		if (!phone) {
			console.err("callPerson_手机号非法: ");
			return;
		}
		uni.makePhoneCall({
			phoneNumber: phone
		});
	},

	// 比较两个对象是否相同
	deepCompare(x, y) {
		var i, l, leftChain, rightChain;

		function compare2Objects(x, y) {
			var p;

			// remember that NaN === NaN returns false
			// and isNaN(undefined) returns true
			if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
				return true;
			}

			// Compare primitives and functions.     
			// Check if both arguments link to the same object.
			// Especially useful on the step where we compare prototypes
			if (x === y) {
				return true;
			}

			// Works in case when functions are created in constructor.
			// Comparing dates is a common scenario. Another built-ins?
			// We can even handle functions passed across iframes
			if ((typeof x === 'function' && typeof y === 'function') ||
				(x instanceof Date && y instanceof Date) ||
				(x instanceof RegExp && y instanceof RegExp) ||
				(x instanceof String && y instanceof String) ||
				(x instanceof Number && y instanceof Number)) {
				return x.toString() === y.toString();
			}

			// At last checking prototypes as good as we can
			if (!(x instanceof Object && y instanceof Object)) {
				return false;
			}

			if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
				return false;
			}

			if (x.constructor !== y.constructor) {
				return false;
			}

			if (x.prototype !== y.prototype) {
				return false;
			}

			// Check for infinitive linking loops
			if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
				return false;
			}

			// Quick checking of one object being a subset of another.
			// todo: cache the structure of arguments[0] for performance
			for (p in y) {
				if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
					return false;
				} else if (typeof y[p] !== typeof x[p]) {
					return false;
				}
			}

			for (p in x) {
				if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
					return false;
				} else if (typeof y[p] !== typeof x[p]) {
					return false;
				}

				switch (typeof(x[p])) {
					case 'object':
					case 'function':

						leftChain.push(x);
						rightChain.push(y);

						if (!compare2Objects(x[p], y[p])) {
							return false;
						}

						leftChain.pop();
						rightChain.pop();
						break;

					default:
						if (x[p] !== y[p]) {
							return false;
						}
						break;
				}
			}

			return true;
		}

		if (arguments.length < 1) {
			return true; //Die silently? Don't know how to handle such case, please help...
			// throw "Need two or more arguments to compare";
		}

		for (i = 1, l = arguments.length; i < l; i++) {

			leftChain = []; //Todo: this can be cached
			rightChain = [];

			if (!compare2Objects(arguments[0], arguments[i])) {
				return false;
			}
		}

		return true;
	}
}
